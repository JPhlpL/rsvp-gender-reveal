"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteAllGuestsAction } from "@/actions/guest";
import { ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE } from "@/utils/constants";

interface DeleteAllGuestsDialogProps {
  guestCount: number;
}

export function DeleteAllGuestsDialog({ guestCount }: DeleteAllGuestsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const canSubmit =
    confirmText === ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE && guestCount > 0;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setConfirmText("");
  };

  const handleDeleteAll = async () => {
    if (!canSubmit) return;
    setIsDeleting(true);
    try {
      const result = await deleteAllGuestsAction();
      if (result.success) {
        toast.success("All guests removed");
        setOpen(false);
        setConfirmText("");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete all guests");
      }
    } catch {
      toast.error("Failed to delete all guests. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (guestCount === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full border-destructive/60 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Delete all guests
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete all guests?</DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                This permanently removes <strong className="text-foreground">{guestCount}</strong>{" "}
                guest{guestCount === 1 ? "" : "s"} and all linked RSVP responses. Confirmation links
                will stop working. This cannot be undone.
              </p>
              <p>
                Type{" "}
                <span className="font-mono font-semibold text-foreground">
                  {ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE}
                </span>{" "}
                to confirm.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="delete-all-confirm">Confirmation</Label>
          <Input
            id="delete-all-confirm"
            autoComplete="off"
            placeholder={ADMIN_DELETE_ALL_GUESTS_CONFIRM_PHRASE}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={!canSubmit || isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete all guests"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
