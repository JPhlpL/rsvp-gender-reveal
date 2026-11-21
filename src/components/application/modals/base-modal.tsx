"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

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

interface BaseModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formAction?: (
    prevState: { error?: string; success?: boolean },
    formData: FormData
  ) => Promise<{ error?: string; success?: boolean }>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  submitLabel?: string;
  cancelLabel?: string;
  maxWidth?: string;
  hideFooter?: boolean;
}

type ActionState = { error?: string; success?: boolean };

export function BaseModal({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  formAction,
  onSuccess,
  onError,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  maxWidth = "sm:max-w-[500px]",
  hideFooter = false,
}: BaseModalProps) {
  const initialState: ActionState = { error: undefined, success: undefined };

  const noOpAction = async (): Promise<ActionState> => initialState;

  const [state, action, isPending] = useActionState(
    formAction || noOpAction,
    initialState
  );

  const hasShownSuccessRef = useRef(false);
  const hasShownErrorRef = useRef(false);

  useEffect(() => {
    if (state?.success && open && !hasShownSuccessRef.current) {
      hasShownSuccessRef.current = true;
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state?.success, open, onSuccess]);

  useEffect(() => {
    if (state?.error && open && !hasShownErrorRef.current) {
      hasShownErrorRef.current = true;
      if (onError) {
        onError(state.error);
      }
    }
  }, [state?.error, open, onError]);

  useEffect(() => {
    if (!open) {
      hasShownSuccessRef.current = false;
      hasShownErrorRef.current = false;
    }
  }, [open]);

  const content = formAction ? (
    <form action={action}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>

      <div className="py-4">{children}</div>

      {!hideFooter && (
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="animate-spin" />
                {submitLabel}...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </DialogFooter>
      )}
    </form>
  ) : (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className="py-4">{children}</div>
      {!hideFooter && (
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
        </DialogFooter>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={maxWidth}>{content}</DialogContent>
    </Dialog>
  );
}
