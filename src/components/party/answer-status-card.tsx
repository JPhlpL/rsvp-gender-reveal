import { dressCodeFor } from "@/lib/dress-code";
import { answerStatus } from "@/lib/invitation-view";
import type { GuestResponse } from "@/types/response";
import { COPY_CHANGE_SOMETHING, EVENT_DATE_SHORT } from "@/utils/constants";

function GuessLine({ guess }: { guess: GuestResponse["guess"] }) {
  if (guess === "girl") {
    return (
      <p className="mt-3 inline-block rounded-full bg-party-pink/60 px-4 py-1.5 font-semibold text-party-pink-ink">
        Your guess: Girl. {dressCodeFor(guess)}
      </p>
    );
  }
  if (guess === "boy") {
    return (
      <p className="mt-3 inline-block rounded-full bg-party-blue/60 px-4 py-1.5 font-semibold text-party-blue-ink">
        Your guess: Boy. {dressCodeFor(guess)}
      </p>
    );
  }
  return null;
}

/** What a guest sees on their invitation after answering. */
export function AnswerStatusCard({ response }: { response: GuestResponse }) {
  const status = answerStatus(response);
  const names = response.plus_one_names ? ` (${response.plus_one_names})` : "";

  let title: string;
  let detail: string | null = null;

  switch (status) {
    case "not_attending":
      title = "We'll miss you!";
      detail = "Thank you for letting us know.";
      break;
    case "plus_pending":
      title = "You're coming!";
      detail = `Waiting for Philip & Vera to confirm your +${response.plus_one_count}${names}`;
      break;
    case "plus_approved":
      title = "You're coming!";
      detail = `Confirmed: you + ${response.plus_one_approved_count ?? 0}`;
      break;
    case "plus_declined":
      title = "You're coming!";
      detail = "Just you this time — Philip & Vera will message you about your companions.";
      break;
    default:
      title = "You're coming!";
      detail = `See you on ${EVENT_DATE_SHORT}!`;
  }

  return (
    <div
      className="rounded-3xl border border-party-ink/10 bg-party-white/90 p-6 text-center shadow-sm sm:p-8"
      data-answer-status={status}
    >
      <p className="font-display text-2xl font-semibold text-party-ink sm:text-3xl">{title}</p>
      {detail && <p className="mt-2 text-base text-party-ink-soft">{detail}</p>}
      {response.is_attending && <GuessLine guess={response.guess} />}
      <p className="mt-5 text-sm text-party-ink-soft">{COPY_CHANGE_SOMETHING}</p>
    </div>
  );
}
