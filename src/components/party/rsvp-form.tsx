"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitRsvpAction, type RsvpActionState } from "@/actions/rsvp";
import { parseRsvpFormData, rsvpAnswerSchema } from "@/schemas/rsvp";
import { COPY_PLUS_ONE_NOTE, PLUS_ONE_MAX } from "@/utils/constants";

interface RsvpFormProps {
  uuid: string;
  /** Canonical `<slug>-<uuid>` segment, for the thank-you redirect. */
  slug: string;
  guestName: string;
}

type FieldErrors = Partial<Record<string, string>>;

const COUNT_OPTIONS = Array.from({ length: PLUS_ONE_MAX + 1 }, (_, i) => i);

const labelClass = "block text-sm font-bold text-party-ink";
const inputClass =
  "w-full rounded-xl border border-party-ink/20 bg-party-white px-4 py-2.5 text-base text-party-ink placeholder:text-party-ink-soft/60 focus:border-party-ink/40 focus:outline-none focus:ring-2 focus:ring-party-ink/15 disabled:opacity-60";
const choiceClass =
  "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-party-white px-4 py-3 text-base text-party-ink transition";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm font-semibold text-red-700">{message}</p>;
}

export function RsvpForm({ uuid, slug, guestName }: RsvpFormProps) {
  const [state, formAction, isPending] = useActionState<RsvpActionState, FormData>(
    submitRsvpAction.bind(null, uuid),
    {}
  );
  const [attending, setAttending] = useState<"true" | "false" | null>(null);
  const [plusCount, setPlusCount] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (state.success) {
      window.location.assign(`/rsvp/${slug}/thank-you`);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, slug]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    // Same rules as the server, so guests see problems before sending.
    const result = rsvpAnswerSchema.safeParse(parseRsvpFormData(formData));
    if (!result.success) {
      const next: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "form");
        next[key] ??= issue.path[0] === "is_attending"
          ? "Please tell us if you can make it"
          : issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    startTransition(() => formAction(formData));
  };

  const isAttending = attending === "true";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-3xl border border-party-ink/10 bg-party-white/90 p-5 shadow-sm sm:p-8"
    >
      <p className="text-center font-display text-xl font-semibold text-party-ink">
        Dear {guestName},
      </p>

      <fieldset>
        <legend className={labelClass}>Will you be there?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className={`${choiceClass} ${attending === "true" ? "border-party-ink" : "border-party-ink/15"}`}>
            <input
              type="radio"
              name="is_attending"
              value="true"
              checked={attending === "true"}
              onChange={() => setAttending("true")}
              disabled={isPending}
              className="h-4 w-4 accent-party-ink"
            />
            Yes, I&apos;ll be there!
          </label>
          <label className={`${choiceClass} ${attending === "false" ? "border-party-ink" : "border-party-ink/15"}`}>
            <input
              type="radio"
              name="is_attending"
              value="false"
              checked={attending === "false"}
              onChange={() => setAttending("false")}
              disabled={isPending}
              className="h-4 w-4 accent-party-ink"
            />
            Sorry, I can&apos;t make it
          </label>
        </div>
        <FieldError message={errors.is_attending} />
      </fieldset>

      <div>
        <label htmlFor="rsvp-name" className={labelClass}>
          Your name
        </label>
        <input
          id="rsvp-name"
          name="name"
          type="text"
          autoComplete="name"
          defaultValue={guestName}
          disabled={isPending}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError message={errors.name} />
      </div>

      {isAttending && (
        <>
          <fieldset>
            <legend className={labelClass}>Your guess</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className={`${choiceClass} border-party-pink has-[:checked]:border-party-pink-deep has-[:checked]:bg-party-pink/40`}>
                <input type="radio" name="guess" value="girl" disabled={isPending} className="h-4 w-4 accent-party-pink-deep" />
                Girl (pink)
              </label>
              <label className={`${choiceClass} border-party-blue has-[:checked]:border-party-blue-deep has-[:checked]:bg-party-blue/40`}>
                <input type="radio" name="guess" value="boy" disabled={isPending} className="h-4 w-4 accent-party-blue-deep" />
                Boy (blue)
              </label>
            </div>
            <FieldError message={errors.guess} />
          </fieldset>

          <div>
            <label htmlFor="rsvp-plus-count" className={labelClass}>
              Bringing anyone?
            </label>
            <select
              id="rsvp-plus-count"
              name="plus_one_count"
              value={plusCount}
              onChange={(e) => setPlusCount(Number(e.target.value))}
              disabled={isPending}
              className={`mt-2 ${inputClass}`}
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Just me" : `+${n}`}
                </option>
              ))}
            </select>
            <FieldError message={errors.plus_one_count} />
          </div>

          {plusCount > 0 && (
            <div>
              <label htmlFor="rsvp-plus-names" className={labelClass}>
                Their names
              </label>
              <input
                id="rsvp-plus-names"
                name="plus_one_names"
                type="text"
                placeholder="e.g. Ben Cruz, Cy Santos"
                disabled={isPending}
                className={`mt-2 ${inputClass}`}
              />
              <p className="mt-1 text-sm text-party-ink-soft">{COPY_PLUS_ONE_NOTE}</p>
              <FieldError message={errors.plus_one_names} />
            </div>
          )}
        </>
      )}

      <div>
        <label htmlFor="rsvp-message" className={labelClass}>
          Message <span className="font-normal text-party-ink-soft">(optional)</span>
        </label>
        <textarea
          id="rsvp-message"
          name="message"
          rows={3}
          placeholder="A note for Philip & Vera"
          disabled={isPending}
          className={`mt-2 resize-none ${inputClass}`}
        />
        <FieldError message={errors.message} />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-party-ink py-3.5 font-display text-lg font-semibold text-party-white transition hover:bg-party-ink/90 active:scale-[0.99] disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending…
          </>
        ) : (
          "Send RSVP"
        )}
      </button>
    </form>
  );
}
