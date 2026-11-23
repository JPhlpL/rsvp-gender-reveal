import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { makeGuestRow, makeResponse } from "@/test/factories";
import { DashboardStats } from "./dashboard-stats";

const rows = [
  makeGuestRow({
    id: "A",
    attendance_status: "attending",
    response: makeResponse({ plus_one_count: 2, plus_one_status: "approved", plus_one_approved_count: 2 }),
  }),
  makeGuestRow({ id: "B", attendance_status: "attending", response: makeResponse() }),
  makeGuestRow({ id: "C" }),
];

describe("DashboardStats", () => {
  const html = renderToStaticMarkup(<DashboardStats rows={rows} />);

  it("has no plus-one requests tile, since only the couple sets plus-ones now", () => {
    expect(html).not.toContain("Plus-one requests waiting");
  });

  it("breaks the expected headcount into guests and the plus-ones the couple set", () => {
    expect(html).toContain("2 guests + 2 plus-ones");
    expect(html).not.toContain("pending");
  });
});
