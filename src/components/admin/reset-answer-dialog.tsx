"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { resetAnswerAction } from "@/actions/response";
import type { GuestWithResponse } from "@/types/guest";

interface ResetAnswerDialogProps {
  guest: GuestWithResponse;
}

/** Clears a guest's answer so they can answer again from their invitation link. */
export function ResetAnswerDialog({ guest }: ResetAnswerDialogProps) {
  const [open, setOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const hasAnswer = guest.response !== null;

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const result = await resetAnswerAction(guest.id);
      if (result.success) {
        toast.success(`${guest.name} can answer again`);
        setOpen(false);
      } else {
        toast.error(result.error || "Couldn't reset the answer. Please try again.");
      }
    } catch {
      toast.error("Couldn't reset the answer. Please try again.");
    } finally {
      setIsResetting(false);
    }
  };

  if (!hasAnswer) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        aria-label={`${guest.name} hasn't answered yet`}
        title="No answer to reset yet"
      >
        <RotateCcw />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Reset answer for ${guest.name}`}
          title="Reset answer"
        >
          <RotateCcw />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset answer?</DialogTitle>
          <DialogDescription>
            This deletes {guest.name}&apos;s answer, so their invitation link shows the RSVP
            form again. They can only answer while RSVPs are open. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm font-medium">{guest.name}</p>
          <p className="text-sm text-muted-foreground">
            {guest.response?.is_attending ? "Attending" : "Not attending"}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isResetting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleReset} disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset answer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
