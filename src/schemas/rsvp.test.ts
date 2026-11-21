import { describe, expect, it } from "vitest";
import { parseRsvpFormData, rsvpAnswerSchema } from "./rsvp";

function form(fields: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) fd.set(key, value);
  return fd;
}

const validAttending = {
  is_attending: "true",
  name: " Ana ",
  guess: "girl",
  plus_one_count: "2",
  plus_one_names: "Ben, Cy",
  message: "",
};

describe("parseRsvpFormData + rsvpAnswerSchema", () => {
  it("parses a valid attending answer", () => {
    const result = rsvpAnswerSchema.safeParse(parseRsvpFormData(form(validAttending)));
    expect(result.success).toBe(true);
    expect(result.data).toEqual({
      is_attending: true,
      name: "Ana",
      guess: "girl",
      plus_one_count: 2,
      plus_one_names: "Ben, Cy",
      message: null,
    });
  });

  it.each([
    ["plus_one_count", "7"],
    ["plus_one_count", "-1"],
    ["plus_one_count", "abc"],
    ["guess", "maybe"],
  ])("rejects out-of-range or malformed fields (%s = %s)", (field, value) => {
    const result = rsvpAnswerSchema.safeParse(
      parseRsvpFormData(form({ ...validAttending, [field]: value }))
    );
    expect(result.success).toBe(false);
  });

  it("rejects out-of-range or malformed fields (is_attending missing)", () => {
    const rest: Record<string, string> = { ...validAttending };
    delete rest.is_attending;
    expect(rsvpAnswerSchema.safeParse(parseRsvpFormData(form(rest))).success).toBe(false);
  });

  it("requires a guess when attending", () => {
    const result = rsvpAnswerSchema.safeParse(
      parseRsvpFormData(form({ ...validAttending, guess: "" }))
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      path: ["guess"],
      message: "Pick your guess: girl or boy",
    });
  });

  it("requires plus-one names when bringing someone", () => {
    const result = rsvpAnswerSchema.safeParse(
      parseRsvpFormData(form({ ...validAttending, plus_one_count: "1", plus_one_names: "" }))
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({
      path: ["plus_one_names"],
      message: "Please tell us their names",
    });
  });

  it("asks for a name when it is blank", () => {
    const result = rsvpAnswerSchema.safeParse(
      parseRsvpFormData(form({ ...validAttending, name: "   " }))
    );
    expect(result.error?.issues[0]).toMatchObject({
      path: ["name"],
      message: "Please enter your name",
    });
  });

  it("accepts not attending without a guess", () => {
    const result = rsvpAnswerSchema.safeParse(
      parseRsvpFormData(form({ is_attending: "false", name: "Ana" }))
    );
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ is_attending: false, guess: null, plus_one_count: 0 });
  });
});
