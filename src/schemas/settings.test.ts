import { describe, expect, it } from "vitest";
import { parseSettingsFormData, settingsFormSchema, toSettingsUpdate } from "./settings";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

describe("settings form", () => {
  it("turns a picked date into the last second of that day in Manila", () => {
    const parsed = settingsFormSchema.parse(parseSettingsFormData(form({ deadline_date: "2026-12-01" })));
    expect(toSettingsUpdate(parsed)).toEqual({
      rsvp_deadline: "2026-12-01T23:59:59+08:00",
      rsvp_closed: false,
      personalized_links: false,
    });
  });

  it("treats an empty date as no deadline", () => {
    const parsed = settingsFormSchema.parse(parseSettingsFormData(form({ deadline_date: "" })));
    expect(toSettingsUpdate(parsed).rsvp_deadline).toBeNull();
  });

  it("reads the checked close switch as true", () => {
    const parsed = settingsFormSchema.parse(
      parseSettingsFormData(form({ deadline_date: "2026-12-01", rsvp_closed: "on" }))
    );
    expect(parsed.rsvp_closed).toBe(true);
  });

  it("reads the checked personalized-links switch as on", () => {
    const parsed = settingsFormSchema.parse(
      parseSettingsFormData(form({ deadline_date: "2026-12-01", personalized_links: "on" }))
    );
    expect(toSettingsUpdate(parsed).personalized_links).toBe(true);
  });

  it("reads an unchecked personalized-links switch as off (general link)", () => {
    const parsed = settingsFormSchema.parse(
      parseSettingsFormData(form({ deadline_date: "2026-12-01" }))
    );
    expect(toSettingsUpdate(parsed).personalized_links).toBe(false);
  });

  it("rejects impossible dates", () => {
    expect(
      settingsFormSchema.safeParse(parseSettingsFormData(form({ deadline_date: "2026-13-01" }))).success
    ).toBe(false);
  });
});
