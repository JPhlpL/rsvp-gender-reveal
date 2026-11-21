"use client";

import { useState } from "react";
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
import { fetchRespondByGuestIdAction } from "@/actions/respond";

interface ViewResponseModalProps {
  guest: Guest;
}

export function ViewResponseModal({ guest }: ViewResponseModalProps) {
  const [open, setOpen] = useState(false);
  const [respond, setRespond] = useState<{
    name: string;
    decline_reason: string | null;
    remarks: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Determine if there's a response to show
  const hasResponse = guest.submitted_at !== null;

  // Fetch respond data when modal opens
  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    
    if (isOpen && hasResponse && !respond) {
      setLoading(true);
      const { respond: fetchedRespond } = await fetchRespondByGuestIdAction(guest.id);
      if (fetchedRespond) {
        setRespond(fetchedRespond);
      }
      setLoading(false);
    }
  };

  if (!hasResponse) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Guest Response</DialogTitle>
          <DialogDescription>
            RSVP details for {guest.name}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            {/* Respondent Name */}
            {respond && (
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Respondent Name</Label>
                <p className="text-sm">{respond.name}</p>
              </div>
            )}

            {/* Attendance Status */}
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Attendance Status</Label>
              <div>
                {guest.attendance_status === "attending" && (
                  <span className="inline-flex items-center rounded-full border bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm font-medium">
                    Attending
                  </span>
                )}
                {guest.attendance_status === "not_attending" && (
                  <span className="inline-flex items-center rounded-full border bg-red-50 text-red-700 border-red-200 px-3 py-1 text-sm font-medium">
                    Not Attending
                  </span>
                )}
                {guest.attendance_status === "pending" && (
                  <span className="inline-flex items-center rounded-full border bg-beige-50 text-beige-700 border-beige-200 px-3 py-1 text-sm font-medium">
                    Pending
                  </span>
                )}
              </div>
            </div>

            {/* Submitted At */}
            <div className="flex flex-col gap-2">
              <Label className="font-semibold">Submitted At</Label>
              <p className="text-sm text-muted-foreground">
                {guest.submitted_at
                  ? new Date(guest.submitted_at).toLocaleString()
                  : "Not submitted yet"}
              </p>
            </div>

            {/* Decline Reason (only if not attending) */}
            {guest.attendance_status === "not_attending" && respond && (
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Decline Reason</Label>
                <div className="rounded-md border bg-muted/50 p-3 min-h-[60px]">
                  <p className="text-sm">
                    {respond.decline_reason ? (
                      respond.decline_reason
                    ) : (
                      <span className="text-muted-foreground italic">
                        No reason provided
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Remarks */}
            {respond && (
              <div className="flex flex-col gap-2">
                <Label className="font-semibold">Remarks</Label>
                <div className="rounded-md border bg-muted/50 p-3 min-h-[60px]">
                  <p className="text-sm">
                    {respond.remarks ? (
                      respond.remarks
                    ) : (
                      <span className="text-muted-foreground italic">
                        No remarks provided
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
