"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Copy } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Guest } from "@/types/guest";
import { confirmationPathSegment } from "@/lib/confirmation-path";
import { DEFAULT_PUBLIC_APP_URL } from "@/utils/constants";

interface CopyLinkModalProps {
  guest: Guest;
}

export function CopyLinkModal({ guest }: CopyLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || DEFAULT_PUBLIC_APP_URL;
  const invitationLink = `${baseUrl}/confirmation/${confirmationPathSegment(guest.name, guest.uuid)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invitationLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <LinkIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invitation Link</DialogTitle>
          <DialogDescription>
            Share this unique link with {guest.name} to let them RSVP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                value={invitationLink}
                readOnly
                className="flex-1 font-mono text-sm"
              />
              <Button onClick={handleCopy} className="shrink-0">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This link is unique to this guest and can be used to access their
              RSVP form.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
