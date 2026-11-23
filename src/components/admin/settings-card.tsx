"use client";

import { useActionState, useEffect } from "react";
import { CalendarClock, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateRsvpSettingsAction, type SettingsActionState } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsCardProps {
  /** Current deadline as a Manila calendar date (YYYY-MM-DD), or "" for none. */
  deadlineDate: string;
  rsvpClosed: boolean;
  /** Computed on the server so it matches the server's clock. */
  statusLine: string;
  isOpen: boolean;
  /** On: guests need their personal link. Off: anyone can RSVP at the general link. */
  personalizedLinks: boolean;
  /** Full URL of the general /invitation link. */
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

  const copyGeneralLink = async () => {
    try {
      await navigator.clipboard.writeText(generalLinkUrl);
      toast.success("General link copied");
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarClock className="h-4 w-4" />
          RSVP settings
        </CardTitle>
        <CardDescription>
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
            className="ml-2 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground"
          >
            {personalizedLinks ? "Personalized links" : "General link: anyone can RSVP"}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* key resets the uncontrolled inputs after the server sends new values */}
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

          <div className="flex flex-col gap-2 rounded-lg border border-border p-3">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="personalized_links"
                defaultChecked={personalizedLinks}
                disabled={isPending}
                className="h-4 w-4 accent-party-ink"
              />
              Personalized links
            </label>
            <p className="text-xs text-muted-foreground">
              On: add guests first; each answers from their own link. Off: anyone can RSVP at
              the general link, and each answer adds a guest to your list. Personal links keep
              working either way.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 text-xs">{generalLinkUrl}</code>
              <Button type="button" variant="outline" size="sm" onClick={copyGeneralLink}>
                <Copy />
                Copy general link
              </Button>
            </div>
          </div>

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
