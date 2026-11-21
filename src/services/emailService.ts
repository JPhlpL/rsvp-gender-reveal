import emailjs from "@emailjs/nodejs";
import { MANILA_TIME_ZONE } from "@/utils/constants";

export interface RsvpNotificationData {
  guestName: string;
  respondentName: string;
  isAttending: boolean;
  guess: "girl" | "boy" | null;
  plusOneCount: number;
  plusOneNames: string | null;
  message: string | null;
  submittedAt: string;
}

/**
 * Email the couple when a guest RSVPs. Never throws: a failed or unconfigured
 * email must not affect the guest's submission.
 */
export async function sendAdminNotification(
  data: RsvpNotificationData
): Promise<{ success: boolean; error?: unknown }> {
  try {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.warn("EmailJS not configured - skipping RSVP notification");
      return { success: false, error: "EmailJS not configured" };
    }

    const templateParams = {
      guest_name: data.guestName,
      respondent_name: data.respondentName,
      attendance_status: data.isAttending ? "Attending" : "Not attending",
      guess: data.guess === "girl" ? "Girl" : data.guess === "boy" ? "Boy" : "—",
      plus_one_request:
        data.plusOneCount > 0
          ? `+${data.plusOneCount}${data.plusOneNames ? `: ${data.plusOneNames}` : ""}`
          : "None",
      message: data.message || "No message",
      submitted_at: new Date(data.submittedAt).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: MANILA_TIME_ZONE,
      }),
      dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      to_email: process.env.ADMIN_NOTIFICATION_EMAIL,
    };

    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
      privateKey,
    });

    console.log("RSVP notification sent:", response.status);
    return { success: true };
  } catch (error) {
    console.error("Failed to send RSVP notification:", error);
    return { success: false, error };
  }
}
