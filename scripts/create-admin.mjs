// Usage: npm run admin:create -- <email> <password>
// Creates a confirmed Supabase Auth user. Remember to add the email to ADMIN_EMAILS.
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

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Could not create admin:", error.message);
  process.exit(1);
}

console.log(`Created admin ${data.user.email} (${data.user.id})`);
