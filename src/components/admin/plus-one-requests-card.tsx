"use client";

import { useState, useTransition } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { decidePlusOneAction } from "@/actions/response";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GuestWithResponse } from "@/types/guest";

type PendingRow = GuestWithResponse & { response: NonNullable<GuestWithResponse["response"]> };

function isPendingRequest(row: GuestWithResponse): row is PendingRow {
  return (
    row.response !== null &&
    row.response.is_attending &&
    row.response.plus_one_count > 0 &&
    row.response.plus_one_status === "pending"
  );
}

function RequestItem({ row }: { row: PendingRow }) {
  const requested = row.response.plus_one_count;
  const [count, setCount] = useState(requested);
  const [isPending, startTransition] = useTransition();

  const decide = (approve: boolean) =>
    startTransition(async () => {
      const result = await decidePlusOneAction(
        row.id,
        approve ? { approve: true, count } : { approve: false }
      );
      if (result.success) {
        toast.success(
          approve ? `Approved +${count} for ${row.name}` : `Declined plus-ones for ${row.name}`
        );
      } else if (result.error) {
        toast.error(result.error);
      }
    });

  return (
    <li className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-semibold">
          {row.name} <span className="text-muted-foreground">asks for +{requested}</span>
        </p>
        {row.response.plus_one_names && (
          <p className="text-sm text-muted-foreground">{row.response.plus_one_names}</p>
        )}
        {row.response.message && (
          <p className="mt-1 text-sm italic text-muted-foreground">“{row.response.message}”</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={1}
          max={requested}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          disabled={isPending}
          className="w-16"
          aria-label={`How many plus-ones to allow for ${row.name}`}
        />
        <Button size="sm" onClick={() => decide(true)} disabled={isPending}>
          <Check />
          Approve
        </Button>
        <Button size="sm" variant="outline" onClick={() => decide(false)} disabled={isPending}>
          <X />
          Decline
        </Button>
      </div>
    </li>
  );
}

/** Plus-one requests waiting for Philip & Vera's decision. */
export function PlusOneRequestsCard({ rows }: { rows: GuestWithResponse[] }) {
  const pending = rows.filter(isPendingRequest);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserPlus className="h-4 w-4" />
          Plus-one requests
        </CardTitle>
        <CardDescription>
          Approve or decline, then message the guest to let them know.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No plus-one requests waiting.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((row) => (
              <RequestItem key={row.id} row={row} />
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
