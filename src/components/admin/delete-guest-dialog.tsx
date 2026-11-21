"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
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
import { deleteGuestAction } from "@/actions/guest";
import type { Guest } from "@/types/guest";

interface DeleteGuestDialogProps {
  guest: Guest;
}

export function DeleteGuestDialog({ guest }: DeleteGuestDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteGuestAction(guest.id);
      if (result.success) {
        toast.success("Guest deleted successfully");
        setOpen(false);
      } else {
        toast.error(result.error || "Failed to delete guest");
      }
    } catch {
      toast.error("Failed to delete guest. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Guest</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this guest? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm font-medium">{guest.name}</p>
          {guest.email && (
            <p className="text-sm text-muted-foreground">{guest.email}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Guest"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
