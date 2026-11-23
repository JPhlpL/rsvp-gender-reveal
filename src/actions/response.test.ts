import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeResponse } from "@/test/factories";

vi.mock("@/lib/auth/require-admin", () => ({ requireAdmin: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/repositories/responseRepository", () => ({
  responseRepository: {
    getResponseByGuestId: vi.fn(),
    upsertAdminResponse: vi.fn(),
    deleteResponse: vi.fn(),
  },
}));

import { requireAdmin } from "@/lib/auth/require-admin";
import { responseRepository } from "@/repositories/responseRepository";
import { revalidatePath } from "next/cache";
import { resetAnswerAction, saveAdminAnswerAction } from "./response";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const pendingThree = makeResponse({
  plus_one_count: 3,
  plus_one_names: "A, B, C",
  plus_one_status: "pending",
});

beforeEach(() => {
  vi.mocked(requireAdmin).mockReset();
  vi.mocked(responseRepository.getResponseByGuestId).mockReset().mockResolvedValue(pendingThree);
});

describe("saveAdminAnswerAction", () => {
  beforeEach(() => {
    vi.mocked(responseRepository.upsertAdminResponse).mockReset().mockResolvedValue(makeResponse());
  });

  it("checks the admin first", async () => {
    await saveAdminAnswerAction("g2", {}, form({ is_attending: "false", name: "Dee" }));
    expect(requireAdmin).toHaveBeenCalledTimes(1);
  });

  it("saves plus-ones entered by the admin as already approved", async () => {
    const result = await saveAdminAnswerAction(
      "g2",
      {},
      form({ is_attending: "true", name: "Two", guess: "boy", plus_one_count: "1", plus_one_names: "Dee" })
    );
    expect(result).toEqual({ success: true });
    expect(responseRepository.upsertAdminResponse).toHaveBeenCalledWith(
      "g2",
      expect.objectContaining({
        is_attending: true,
        guess: "boy",
        plus_one_count: 1,
        plus_one_status: "approved",
        plus_one_approved_count: 1,
      })
    );
  });

  it("clears guess and plus-ones when switched to not attending", async () => {
    await saveAdminAnswerAction(
      "g2",
      {},
      form({ is_attending: "false", name: "Two", guess: "boy", plus_one_count: "1", plus_one_names: "Dee" })
    );
    expect(responseRepository.upsertAdminResponse).toHaveBeenCalledWith(
      "g2",
      expect.objectContaining({
        is_attending: false,
        guess: null,
        plus_one_count: 0,
        plus_one_names: null,
        plus_one_status: "none",
        plus_one_approved_count: null,
      })
    );
  });

  it("keeps the couple's plus-one decision when only the message changes", async () => {
    vi.mocked(responseRepository.getResponseByGuestId).mockResolvedValue(
      makeResponse({
        is_attending: true,
        guess: "girl",
        plus_one_count: 2,
        plus_one_names: "Dee, Eve",
        plus_one_status: "declined",
        plus_one_approved_count: 0,
      })
    );
    await saveAdminAnswerAction(
      "g2",
      {},
      form({
        is_attending: "true",
        name: "Two",
        guess: "girl",
        plus_one_count: "2",
        plus_one_names: "Dee, Eve",
        message: "See you!",
      })
    );
    expect(responseRepository.getResponseByGuestId).toHaveBeenCalledWith("g2");
    expect(responseRepository.upsertAdminResponse).toHaveBeenCalledWith(
      "g2",
      expect.objectContaining({
        message: "See you!",
        plus_one_count: 2,
        plus_one_status: "declined",
        plus_one_approved_count: 0,
      })
    );
  });

  it("returns validation messages without saving", async () => {
    const result = await saveAdminAnswerAction("g2", {}, form({ is_attending: "true", name: "Two" }));
    expect(result).toEqual({ error: "Pick your guess: girl or boy" });
    expect(responseRepository.upsertAdminResponse).not.toHaveBeenCalled();
  });
});

describe("resetAnswerAction", () => {
  beforeEach(() => {
    vi.mocked(responseRepository.deleteResponse).mockReset().mockResolvedValue(undefined);
    vi.mocked(revalidatePath).mockReset();
  });

  it("checks the admin before deleting anything", async () => {
    vi.mocked(requireAdmin).mockRejectedValueOnce(new Error("NEXT_REDIRECT"));
    await expect(resetAnswerAction("g3")).rejects.toThrow("NEXT_REDIRECT");
    expect(responseRepository.deleteResponse).not.toHaveBeenCalled();
  });

  it("deletes the guest's answer so their link shows the form again", async () => {
    const result = await resetAnswerAction("g3");
    expect(result).toEqual({ success: true });
    expect(responseRepository.deleteResponse).toHaveBeenCalledWith("g3");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(revalidatePath).toHaveBeenCalledWith("/dashboard/guests");
  });

  it("reports a failure without claiming success", async () => {
    vi.mocked(responseRepository.deleteResponse).mockRejectedValue(new Error("db down"));
    const result = await resetAnswerAction("g3");
    expect(result).toEqual({ error: "Couldn't reset the answer. Please try again." });
  });
});
