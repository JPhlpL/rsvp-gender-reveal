"use client";

import { useState, type ReactNode } from "react";
import { FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Guest } from "@/types/guest";
import type { GuestResponse } from "@/types/response";
import { fetchResponseAction } from "@/actions/response";

interface ViewResponseModalProps {
  guest: Guest;
}

const PLUS_ONE_STATUS_LABEL: Record<GuestResponse["plus_one_status"], string> = {
  none: "None requested",
  pending: "Waiting for approval",
  approved: "Approved",
  declined: "Declined",
};

function formatManila(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Manila",
  });
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="font-semibold">{label}</Label>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function ViewResponseModal({ guest }: ViewResponseModalProps) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<GuestResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const hasResponse = guest.submitted_at !== null;

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen && hasResponse) {
      setLoading(true);
      setResponse(await fetchResponseAction(guest.id));
      setLoading(false);
    }
  };

  if (!hasResponse) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`View ${guest.name}'s answer`}>
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Guest Answer</DialogTitle>
          <DialogDescription>RSVP details for {guest.name}</DialogDescription>
        </DialogHeader>

        {loading || !response ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {loading ? "Loading..." : "No answer found."}
          </p>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <Field label="Name they gave">{response.name}</Field>
            <Field label="Coming?">
              {response.is_attending ? "Yes, attending" : "Not attending"}
            </Field>
            {response.is_attending && (
              <>
                <Field label="Guess">
                  {response.guess === "girl"
                    ? "Girl (pink)"
                    : response.guess === "boy"
                      ? "Boy (blue)"
                      : "—"}
                </Field>
                <Field label="Plus-ones">
                  {response.plus_one_count > 0 ? (
                    <>
                      +{response.plus_one_count}
                      {response.plus_one_names ? `: ${response.plus_one_names}` : ""}
                      {" · "}
                      {PLUS_ONE_STATUS_LABEL[response.plus_one_status]}
                      {response.plus_one_status === "approved" &&
                        ` (${response.plus_one_approved_count ?? 0} allowed)`}
                    </>
                  ) : (
                    "None"
                  )}
                </Field>
              </>
            )}
            <Field label="Message">
              {response.message ? (
                <span className="whitespace-pre-wrap">{response.message}</span>
              ) : (
                <span className="italic text-muted-foreground">No message</span>
              )}
            </Field>
            <Field label="Answered at (Manila)">
              {guest.submitted_at ? formatManila(guest.submitted_at) : "—"}
            </Field>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
