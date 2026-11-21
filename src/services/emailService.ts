import emailjs from "@emailjs/nodejs";

interface RSVPNotificationData {
  guestName: string;
  respondentName: string;
  attendanceStatus: string;
  declineReason: string | null;
  remarks: string | null;
  submittedAt: string;
}

/**
 * Send email notification to admin when a guest submits their RSVP
 * This is a non-blocking operation - failures won't prevent RSVP submission
 */
export async function sendAdminNotification(
  data: RSVPNotificationData
): Promise<{ success: boolean; error?: unknown }> {
  try {
    // Validate environment variables
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      console.warn("EmailJS not configured - skipping email notification");
      return { success: false, error: "EmailJS not configured" };
    }

    // Prepare template parameters
    const templateParams = {
      guest_name: data.guestName,
      respondent_name: data.respondentName,
      attendance_status: data.attendanceStatus,
      decline_reason: data.declineReason || "N/A",
      remarks: data.remarks || "No additional remarks",
      submitted_at: new Date(data.submittedAt).toLocaleString("en-US", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      login_url: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      dashboard_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/guests`,
      to_email: adminEmail,
    };

    // Send email using server-side SDK
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      {
        publicKey: publicKey,
        privateKey: privateKey,
      }
    );

    console.log("Admin notification sent successfully:", response.status);
    return { success: true };
  } catch (error) {
    console.error("Failed to send admin notification:", error);
    // Don't throw - email failure shouldn't block RSVP submission
    return { success: false, error };
  }
}
