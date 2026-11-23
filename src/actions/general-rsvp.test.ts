import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/repositories/invitationRepository", () => ({
  getRsvpSettings: vi.fn(),
  insertGeneralGuest: vi.fn(),
  insertGuestResponse: vi.fn(),
  removeGuest: vi.fn(),
}));
vi.mock("@/services/emailService", () => ({ sendAdminNotification: vi.fn() }));
vi.mock("next/server", () => ({ after: vi.fn() }));

import { after } from "next/server";
import {
  getRsvpSettings,
  insertGeneralGuest,
  insertGuestResponse,
  removeGuest,
} from "@/repositories/invitationRepository";
import { RSVP_BOT_TRAP_FIELD } from "@/utils/constants";
import { submitGeneralRsvpAction } from "./general-rsvp";

const UUID = "44444444-4444-4444-8444-444444444444";
const generalOpen = {
  rsvp_deadline: "2099-12-01T23:59:59+08:00",
  rsvp_closed: false,
  personalized_links: false,
};
const CLOSED = "RSVPs are closed. Message Philip & Vera if you'd still like to come.";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const walkIn = () =>
  form({ is_attending: "true", name: "Dina Reyes", guess: "boy", message: "Yay" });

beforeEach(() => {
  vi.mocked(getRsvpSettings).mockReset().mockResolvedValue(generalOpen);
  vi.mocked(insertGeneralGuest)
    .mockReset()
    .mockResolvedValue({ id: "g9", uuid: UUID, name: "Dina Reyes" });
  vi.mocked(insertGuestResponse).mockReset().mockResolvedValue("inserted");
  vi.mocked(removeGuest).mockReset().mockResolvedValue(undefined);
  vi.mocked(after).mockReset();
});

describe("submitGeneralRsvpAction", () => {
  it("adds the person as a guest, stores their answer and sends them to their thank-you page", async () => {
    const result = await submitGeneralRsvpAction({}, walkIn());

    expect(result).toEqual({ success: true, slug: `dina-reyes-${UUID}` });
    expect(insertGeneralGuest).toHaveBeenCalledWith("Dina Reyes");
    expect(insertGuestResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        guest_id: "g9",
        name: "Dina Reyes",
        is_attending: true,
        guess: "boy",
        plus_one_count: 0,
        plus_one_status: "none",
        message: "Yay",
      })
    );
    expect(after).toHaveBeenCalledTimes(1);
  });

  it("accepts a second answer with the same name (no duplicate check)", async () => {
    await submitGeneralRsvpAction({}, walkIn());
    const second = await submitGeneralRsvpAction({}, walkIn());
    expect(second.success).toBe(true);
    expect(insertGeneralGuest).toHaveBeenCalledTimes(2);
  });

  it("refuses answers while personalized links are on", async () => {
    vi.mocked(getRsvpSettings).mockResolvedValue({ ...generalOpen, personalized_links: true });
    const result = await submitGeneralRsvpAction({}, walkIn());
    expect(result).toEqual({
      error: "Please RSVP using the personal link Philip & Vera sent you.",
    });
    expect(insertGeneralGuest).not.toHaveBeenCalled();
  });

  it("refuses answers after the deadline", async () => {
    vi.mocked(getRsvpSettings).mockResolvedValue({
      ...generalOpen,
      rsvp_deadline: "2020-01-01T23:59:59+08:00",
    });
    const result = await submitGeneralRsvpAction({}, walkIn());
    expect(result).toEqual({ error: CLOSED });
    expect(insertGeneralGuest).not.toHaveBeenCalled();
  });

  it("refuses answers while RSVPs are closed by hand", async () => {
    vi.mocked(getRsvpSettings).mockResolvedValue({ ...generalOpen, rsvp_closed: true });
    const result = await submitGeneralRsvpAction({}, walkIn());
    expect(result).toEqual({ error: CLOSED });
    expect(insertGeneralGuest).not.toHaveBeenCalled();
  });

  it("stores nothing when the hidden bot field is filled in", async () => {
    const bot = form({
      is_attending: "true",
      name: "Spam",
      guess: "girl",
      [RSVP_BOT_TRAP_FIELD]: "http://spam.example",
    });
    const result = await submitGeneralRsvpAction({}, bot);
    expect(result.success).toBeUndefined();
    expect(getRsvpSettings).not.toHaveBeenCalled();
    expect(insertGeneralGuest).not.toHaveBeenCalled();
  });

  it("returns the first validation message and stores nothing", async () => {
    const result = await submitGeneralRsvpAction({}, form({ is_attending: "true", name: "" }));
    expect(result).toEqual({ error: "Please enter your name" });
    expect(insertGeneralGuest).not.toHaveBeenCalled();
  });

  it("ignores plus-ones sent with the answer", async () => {
    await submitGeneralRsvpAction(
      {},
      form({ is_attending: "true", name: "Dina", guess: "girl", plus_one_count: "3" })
    );
    expect(insertGuestResponse).toHaveBeenCalledWith(
      expect.objectContaining({ plus_one_count: 0, plus_one_names: null })
    );
  });

  it("removes the new guest again if their answer can't be saved", async () => {
    vi.mocked(insertGuestResponse).mockRejectedValue(new Error("db down"));
    const result = await submitGeneralRsvpAction({}, walkIn());
    expect(result).toEqual({ error: "Something went wrong. Please try again." });
    expect(removeGuest).toHaveBeenCalledWith("g9");
    expect(after).not.toHaveBeenCalled();
  });
});
