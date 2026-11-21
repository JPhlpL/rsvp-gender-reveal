import { describe, expect, it } from "vitest";
import { toExportRows } from "./exportGuests";
import { makeGuestRow, makeResponse } from "@/test/factories";

describe("toExportRows", () => {
  it("describes an attending guest with approved plus-ones", () => {
    const [row] = toExportRows([
      makeGuestRow({
        name: "Ana Cruz",
        phone: "0917",
        attendance_status: "attending",
        submitted_at: "2026-11-25T04:30:00Z",
        notes: "Pool towel",
        response: makeResponse({
          guess: "girl",
          plus_one_count: 2,
          plus_one_names: "Ben, Cy",
          plus_one_status: "approved",
          plus_one_approved_count: 2,
          message: "So excited!",
        }),
      }),
    ]);

    expect(row).toEqual({
      Name: "Ana Cruz",
      Phone: "0917",
      Email: "",
      Status: "Attending",
      Guess: "Girl",
      "Plus-ones requested": 2,
      "Plus-one names": "Ben, Cy",
      "Plus-one status": "Approved",
      "Plus-ones approved": 2,
      Message: "So excited!",
      "Admin notes": "Pool towel",
      "Answered at": "Nov 25, 2026, 12:30 PM",
    });
  });

  it("leaves answer columns empty for a guest who has not answered", () => {
    const [row] = toExportRows([makeGuestRow()]);
    expect(row).toMatchObject({
      Status: "No answer yet",
      Guess: "",
      "Plus-ones requested": "",
      "Plus-one names": "",
      "Plus-one status": "",
      "Plus-ones approved": "",
      Message: "",
      "Answered at": "",
    });
  });

  it("keeps the column order from the design", () => {
    const [row] = toExportRows([makeGuestRow()]);
    expect(Object.keys(row)).toEqual([
      "Name",
      "Phone",
      "Email",
      "Status",
      "Guess",
      "Plus-ones requested",
      "Plus-one names",
      "Plus-one status",
      "Plus-ones approved",
      "Message",
      "Admin notes",
      "Answered at",
    ]);
  });
});
