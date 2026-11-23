"use client";

import { startTransition, useActionState, useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitGeneralRsvpAction } from "@/actions/general-rsvp";
import { submitRsvpAction, type RsvpActionState } from "@/actions/rsvp";
import { dressCodeFor } from "@/lib/dress-code";
import { parseRsvpFormData, rsvpAnswerSchema } from "@/schemas/rsvp";
import { RSVP_BOT_TRAP_FIELD } from "@/utils/constants";

type RsvpFormProps =
  | {
      /** A guest's personal link. */
      mode: "guest";
      uuid: string;
      /** Canonical `<slug>-<uuid>` segment, for the thank-you redirect. */
      slug: string;
      guestName: string;
    }
  | {
      /** The general /invitation link: anyone can answer (personalized links off). */
      mode: "general";
    };

type FieldErrors = Partial<Record<string, string>>;
type Guess = "girl" | "boy";

const DRESS_CODE_TONE: Record<Guess, string> = {
  girl: "bg-party-pink/60 text-party-pink-ink",
  boy: "bg-party-blue/60 text-party-blue-ink",
};

const labelClass = "block text-sm font-bold text-party-ink";
const inputClass =
  "w-full rounded-xl border border-party-ink/20 bg-party-white px-4 py-2.5 text-base text-party-ink placeholder:text-party-ink-soft/60 focus:border-party-ink/40 focus:outline-none focus:ring-2 focus:ring-party-ink/15 disabled:opacity-60";
const choiceClass =
  "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-party-white px-4 py-3 text-base text-party-ink transition";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-sm font-semibold text-red-700">{message}</p>;
}

export function RsvpForm(props: RsvpFormProps) {
  const isGeneral = props.mode === "general";
  const guestName = props.mode === "guest" ? props.guestName : "";
  const [state, formAction, isPending] = useActionState<RsvpActionState, FormData>(
    props.mode === "guest" ? submitRsvpAction.bind(null, props.uuid) : submitGeneralRsvpAction,
    {}
  );
  const thankYouSlug = props.mode === "guest" ? props.slug : state.slug;
  const [attending, setAttending] = useState<"true" | "false" | null>(null);
  const [guess, setGuess] = useState<Guess | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (state.success && thankYouSlug) {
      window.location.assign(`/rsvp/${thankYouSlug}/thank-you`);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, thankYouSlug]);

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
      className="relative space-y-6 rounded-3xl border border-party-ink/10 bg-party-white/90 p-5 shadow-sm sm:p-8"
    >
      <p className="text-center font-display text-xl font-semibold text-party-ink">
        Dear {isGeneral ? "guest" : guestName},
      </p>

      {isGeneral && (
        // Bot trap: hidden from people and screen readers; bots fill in every field.
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Leave this empty
            <input type="text" name={RSVP_BOT_TRAP_FIELD} tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      )}

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
          placeholder={isGeneral ? "Your full name" : undefined}
          disabled={isPending}
          className={`mt-2 ${inputClass}`}
        />
        <FieldError message={errors.name} />
      </div>

      {isAttending && (
        <fieldset>
          <legend className={labelClass}>Your guess</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className={`${choiceClass} border-party-pink has-[:checked]:border-party-pink-deep has-[:checked]:bg-party-pink/40`}>
              <input
                type="radio"
                name="guess"
                value="girl"
                checked={guess === "girl"}
                onChange={() => setGuess("girl")}
                disabled={isPending}
                className="h-4 w-4 accent-party-pink-deep"
              />
              Girl (pink)
            </label>
            <label className={`${choiceClass} border-party-blue has-[:checked]:border-party-blue-deep has-[:checked]:bg-party-blue/40`}>
              <input
                type="radio"
                name="guess"
                value="boy"
                checked={guess === "boy"}
                onChange={() => setGuess("boy")}
                disabled={isPending}
                className="h-4 w-4 accent-party-blue-deep"
              />
              Boy (blue)
            </label>
          </div>
          <div aria-live="polite" className="text-center">
            {guess && (
              <p
                className={`mt-3 inline-block rounded-full px-4 py-1.5 font-semibold ${DRESS_CODE_TONE[guess]}`}
              >
                {dressCodeFor(guess)}
              </p>
            )}
          </div>
          <FieldError message={errors.guess} />
        </fieldset>
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
