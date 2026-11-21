import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/** `/rsvp` without a guest code is never valid. */
export default function RsvpIndexPage() {
  redirect("/rsvp/error");
}
