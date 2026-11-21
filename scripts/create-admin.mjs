// Usage: npm run admin:create -- <email> <password>
// Creates a confirmed Supabase Auth user marked as admin (app_metadata.role = "admin").
// The database only lets marked admins read or change data. If the email already has
// an account, it is marked as admin and its password is left unchanged.
// Remember to also add the email to ADMIN_EMAILS.
import { createClient } from "@supabase/supabase-js";

const [email, password] = process.argv.slice(2);
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error("Usage: npm run admin:create -- <email> <password>");
  process.exit(1);
}
if (!url || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const ADMIN = { role: "admin" };

async function findUserByEmail(target) {
  const wanted = target.trim().toLowerCase();
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === wanted);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
  app_metadata: ADMIN,
});

if (!error) {
  console.log(`Created admin ${data.user.email} (${data.user.id})`);
  process.exit(0);
}

const existing = await findUserByEmail(email).catch(() => null);
if (!existing) {
  console.error("Could not create admin:", error.message);
  process.exit(1);
}

const { error: updateError } = await supabase.auth.admin.updateUserById(existing.id, {
  app_metadata: { ...existing.app_metadata, ...ADMIN },
});

if (updateError) {
  console.error("Could not mark existing user as admin:", updateError.message);
  process.exit(1);
}

console.log(
  `${existing.email} already had an account: marked as admin (password unchanged). Sign out and back in to pick it up.`
);
