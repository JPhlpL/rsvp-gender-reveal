import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeResponse } from "@/test/factories";

vi.mock("@/repositories/invitationRepository", () => ({
  getInvitationByUuid: vi.fn(),
  getRsvpSettings: vi.fn(),
  insertGuestResponse: vi.fn(),
}));
vi.mock("@/services/emailService", () => ({ sendAdminNotification: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/server", () => ({ after: vi.fn() }));

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getInvitationByUuid,
  getRsvpSettings,
  insertGuestResponse,
} from "@/repositories/invitationRepository";
import { submitRsvpAction } from "./rsvp";

const UUID = "11111111-1111-4111-8111-111111111111";
const guest = { id: "g1", uuid: UUID, name: "Sample Guest One", notes: null };
const openSettings = { rsvp_deadline: "2099-12-01T23:59:59+08:00", rsvp_closed: false };

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const attendingWithTwo = form({
  is_attending: "true",
  name: "Ana",
  guess: "girl",
  plus_one_count: "2",
  plus_one_names: "Ben, Cy",
});

beforeEach(() => {
  vi.mocked(getInvitationByUuid).mockReset().mockResolvedValue({ guest, response: null });
  vi.mocked(getRsvpSettings).mockReset().mockResolvedValue(openSettings);
  vi.mocked(insertGuestResponse).mockReset().mockResolvedValue("inserted");
  vi.mocked(after).mockReset();
});

describe("submitRsvpAction", () => {
  it("returns the first validation message and stores nothing", async () => {
    const result = await submitRsvpAction(UUID, {}, form({ is_attending: "true", name: "Ana" }));
    expect(result).toEqual({ error: "Pick your guess: girl or boy" });
    expect(insertGuestResponse).not.toHaveBeenCalled();
  });

  it("rejects a malformed link code without touching the database", async () => {
    const result = await submitRsvpAction("not-a-uuid", {}, attendingWithTwo);
    expect(result).toEqual({ error: "This invitation link isn't valid." });
    expect(getInvitationByUuid).not.toHaveBeenCalled();
  });

  it("rejects an unknown guest", async () => {
    vi.mocked(getInvitationByUuid).mockResolvedValue(null);
    const result = await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(result).toEqual({ error: "This invitation link isn't valid." });
  });

  it("refuses a guest who already answered", async () => {
    vi.mocked(getInvitationByUuid).mockResolvedValue({ guest, response: makeResponse() });
    const result = await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(result.error).toBe(
      "You've already sent your RSVP. Message Philip & Vera if something changed."
    );
    expect(insertGuestResponse).not.toHaveBeenCalled();
  });

  it("refuses submissions once RSVPs are closed", async () => {
    vi.mocked(getRsvpSettings).mockResolvedValue({ ...openSettings, rsvp_closed: true });
    const result = await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(result.error).toBe(
      "RSVPs are closed. Message Philip & Vera if you'd still like to come."
    );
    expect(insertGuestResponse).not.toHaveBeenCalled();
  });

  it("maps a duplicate insert (double submit) to the already-answered message", async () => {
    vi.mocked(insertGuestResponse).mockResolvedValue("duplicate");
    const result = await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(result.error).toBe(
      "You've already sent your RSVP. Message Philip & Vera if something changed."
    );
    expect(after).not.toHaveBeenCalled();
  });

  it("stores the normalized answer, schedules the email, and succeeds", async () => {
    const result = await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(result).toEqual({ success: true });
    expect(insertGuestResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        guest_id: "g1",
        is_attending: true,
        guess: "girl",
        plus_one_count: 2,
        plus_one_names: "Ben, Cy",
        plus_one_status: "pending",
      })
    );
    expect(after).toHaveBeenCalledTimes(1);
  });

  it("does not refresh the invitation page, so the form can move to the thank-you page", async () => {
    await submitRsvpAction(UUID, {}, attendingWithTwo);
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
