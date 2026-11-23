"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarClock, Copy, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateRsvpSettingsAction, type SettingsActionState } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { linkModeCopy } from "@/lib/link-mode";

interface SettingsCardProps {
  /** Current deadline as a Manila calendar date (YYYY-MM-DD), or "" for none. */
  deadlineDate: string;
  rsvpClosed: boolean;
  /** Computed on the server so it matches the server's clock. */
  statusLine: string;
  isOpen: boolean;
  /** Saved value. On: guests need their personal link. Off: anyone can RSVP at /invitation. */
  personalizedLinks: boolean;
  /** Full URL of the /invitation link. */
  generalLinkUrl: string;
}

export function SettingsCard({
  deadlineDate,
  rsvpClosed,
  statusLine,
  isOpen,
  personalizedLinks,
  generalLinkUrl,
}: SettingsCardProps) {
  const [state, formAction, isPending] = useActionState<SettingsActionState, FormData>(
    updateRsvpSettingsAction,
    {}
  );

  useEffect(() => {
    if (state.success) toast.success("Settings saved");
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4" />
          RSVP settings
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          <span
            data-rsvp-status
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isOpen ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {statusLine}
          </span>
          <span
            data-link-mode
            className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground"
          >
            {linkModeCopy(personalizedLinks).badge}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* key resets the inputs (and the switch below) after the server sends new values */}
        <form
          key={`${deadlineDate}-${rsvpClosed}-${personalizedLinks}`}
          action={formAction}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="deadline_date">RSVP deadline (Manila time, end of day)</Label>
              <Input
                id="deadline_date"
                name="deadline_date"
                type="date"
                defaultValue={deadlineDate}
                disabled={isPending}
                className="w-full sm:w-48"
              />
              <p className="text-xs text-muted-foreground">Leave empty for no deadline.</p>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium sm:pb-6">
              <input
                type="checkbox"
                name="rsvp_closed"
                defaultChecked={rsvpClosed}
                disabled={isPending}
                className="h-4 w-4 accent-party-ink"
              />
              Close RSVPs now
            </label>
          </div>

          <PersonalizedLinksField
            saved={personalizedLinks}
            generalLinkUrl={generalLinkUrl}
            disabled={isPending}
          />

          <div>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : null}
              Save
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface PersonalizedLinksFieldProps {
  saved: boolean;
  generalLinkUrl: string;
  disabled: boolean;
}

/**
 * The Personalized links switch, with notes that follow the switch as it's flipped, so the
 * couple see what /invitation will do before saving.
 */
function PersonalizedLinksField({ saved, generalLinkUrl, disabled }: PersonalizedLinksFieldProps) {
  const [on, setOn] = useState(saved);
  const copy = linkModeCopy(on);
  const unsaved = on !== saved;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(generalLinkUrl);
      toast.success(copy.copiedToast);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="personalized_links" className="text-sm font-semibold">
            Personalized links
          </Label>
          <p className="text-xs text-muted-foreground" data-link-summary>
            {copy.summary}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className={`w-7 text-right text-xs font-semibold ${on ? "text-foreground" : "text-muted-foreground"}`}
            aria-hidden="true"
          >
            {copy.state}
          </span>
          <Switch
            id="personalized_links"
            name="personalized_links"
            checked={on}
            onCheckedChange={setOn}
            disabled={disabled}
          />
        </div>
      </div>

      {unsaved && (
        <p className="rounded-md bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800" role="status">
          Not saved yet. Press Save to apply.
        </p>
      )}

      <div className="flex flex-col gap-2 rounded-md bg-muted/60 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold">
          <Link2 className="h-3.5 w-3.5" />
          {copy.linkTitle}
        </p>
        <p className="text-xs text-muted-foreground" data-link-purpose>
          {copy.linkPurpose}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="rounded bg-background px-2 py-1 text-xs">{generalLinkUrl}</code>
          <Button type="button" variant="outline" size="sm" onClick={copyLink}>
            <Copy />
            {copy.copyLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
