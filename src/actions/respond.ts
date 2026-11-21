"use server";

import { revalidatePath } from "next/cache";
import { rsvpSchema } from "@/schemas/respond";
import { respondRepository } from "@/repositories/respondRepository";
import { guestRepository } from "@/repositories/guestRepository";
import { sendAdminNotification } from "@/services/emailService";
import { confirmationPathSegment } from "@/lib/confirmation-path";

type ActionState = { error?: string; success?: boolean };

/**
 * Submit or update RSVP response
 */
export async function submitRSVPAction(
  uuid: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    // Parse form data
    const rawData = {
      name: formData.get("name"),
      is_accept_rsvp: formData.get("is_accept_rsvp") === "true",
      decline_reason: formData.get("decline_reason") || null,
      remarks: formData.get("remarks") || null,
    };

    // Validate with Zod
    const parsed = rsvpSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        error: parsed.error.issues[0].message,
        success: false,
      };
    }

    // Get guest by UUID
    const guest = await guestRepository.getGuestByUuid(uuid);

    if (!guest) {
      return {
        error: "Invalid invitation link",
        success: false,
      };
    }

    // Check if already submitted
    if (guest.submitted_at) {
      return {
        error: "You have already submitted your RSVP",
        success: false,
      };
    }

    const validatedData = parsed.data;

    // Upsert respond
    await respondRepository.upsertRespond({
      guest_id: guest.id,
      name: validatedData.name,
      is_accept_rsvp: validatedData.is_accept_rsvp,
      decline_reason: validatedData.decline_reason || null,
      remarks: validatedData.remarks || null,
    });

    // Send email notification to admin (non-blocking)
    sendAdminNotification({
      guestName: guest.name,
      respondentName: validatedData.name,
      attendanceStatus: validatedData.is_accept_rsvp
        ? "Attending"
        : "Not Attending",
      declineReason: validatedData.decline_reason || null,
      remarks: validatedData.remarks || null,
      submittedAt: new Date().toISOString(),
    }).catch((error) => {
      // Log error but don't fail the RSVP submission
      console.error("Email notification failed:", error);
    });

    const pathSeg = confirmationPathSegment(guest.name, guest.uuid);
    revalidatePath(`/confirmation/${pathSeg}`);
    revalidatePath(`/confirmation/${uuid}`);

    return { success: true };
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return {
      error: "Failed to submit RSVP. Please try again.",
      success: false,
    };
  }
}

/**
 * Fetch guest and respond data by UUID for RSVP page
 */
export async function fetchGuestByUuidAction(uuid: string) {
  try {
    const guest = await guestRepository.getGuestByUuid(uuid);

    if (!guest) {
      return { guest: null, respond: null, error: "Guest not found" };
    }

    // Check if guest has already responded
    const respond = await respondRepository.getRespondByGuestId(guest.id);

    return { guest, respond, error: null };
  } catch (error) {
    console.error("Error fetching guest data:", error);
    return { guest: null, respond: null, error: "Failed to load guest data" };
  }
}

/**
 * Fetch respond data by guest ID for admin dashboard
 */
export async function fetchRespondByGuestIdAction(guestId: string) {
  try {
    const respond = await respondRepository.getRespondByGuestId(guestId);
    return { respond, error: null };
  } catch (error) {
    console.error("Error fetching respond data:", error);
    return { respond: null, error: "Failed to load response data" };
  }
}
