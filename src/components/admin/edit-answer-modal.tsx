"use client";

import { useState } from "react";
import { ClipboardPen } from "lucide-react";
import { toast } from "sonner";
import { saveAdminAnswerAction } from "@/actions/response";
import { BaseModal } from "@/components/application/modals/base-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { GuestWithResponse } from "@/types/guest";
import { PLUS_ONE_MAX } from "@/utils/constants";

const COUNT_OPTIONS = Array.from({ length: PLUS_ONE_MAX + 1 }, (_, i) => i);
const selectClass =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** Record or edit a guest's answer (e.g. replied on Messenger). Works after the deadline too. */
export function EditAnswerModal({ guest }: { guest: GuestWithResponse }) {
  const response = guest.response;
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [attending, setAttending] = useState<"true" | "false" | null>(
    response ? (response.is_attending ? "true" : "false") : null
  );
  const [plusCount, setPlusCount] = useState(response?.plus_one_count ?? 0);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setAttending(response ? (response.is_attending ? "true" : "false") : null);
      setPlusCount(response?.plus_one_count ?? 0);
      setKey((k) => k + 1);
    }
    setOpen(next);
  };

  const title = response ? "Edit answer" : "Record answer";

  return (
    <BaseModal
      key={key}
      trigger={
        <Button variant="ghost" size="icon" aria-label={`${title} for ${guest.name}`}>
          <ClipboardPen className="h-4 w-4" />
        </Button>
      }
      title={title}
      description={`For ${guest.name}. Changing the plus-ones here approves them; leaving them as they are keeps your earlier decision. The RSVP deadline doesn't apply.`}
      open={open}
      onOpenChange={handleOpenChange}
      formAction={saveAdminAnswerAction.bind(null, guest.id)}
      onSuccess={() => {
        toast.success("Answer saved");
        setOpen(false);
      }}
      onError={(error) => toast.error(error)}
      submitLabel="Save answer"
    >
      <div className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Coming?</legend>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="is_attending"
                value="true"
                checked={attending === "true"}
                onChange={() => setAttending("true")}
              />
              Attending
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="is_attending"
                value="false"
                checked={attending === "false"}
                onChange={() => setAttending("false")}
              />
              Not attending
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label htmlFor={`answer-name-${guest.id}`}>Name</Label>
          <Input
            id={`answer-name-${guest.id}`}
            name="name"
            defaultValue={response?.name ?? guest.name}
          />
        </div>

        {attending === "true" && (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-1 text-sm font-medium">Guess</legend>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="guess"
                    value="girl"
                    defaultChecked={response?.guess === "girl"}
                  />
                  Girl
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="guess"
                    value="boy"
                    defaultChecked={response?.guess === "boy"}
                  />
                  Boy
                </label>
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`answer-plus-${guest.id}`}>Plus-ones</Label>
              <select
                id={`answer-plus-${guest.id}`}
                name="plus_one_count"
                value={plusCount}
                onChange={(e) => setPlusCount(Number(e.target.value))}
                className={selectClass}
              >
                {COUNT_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n === 0 ? "None" : `+${n}`}
                  </option>
                ))}
              </select>
            </div>

            {plusCount > 0 && (
              <div className="flex flex-col gap-2">
                <Label htmlFor={`answer-names-${guest.id}`}>Their names</Label>
                <Input
                  id={`answer-names-${guest.id}`}
                  name="plus_one_names"
                  defaultValue={response?.plus_one_names ?? ""}
                />
              </div>
            )}
          </>
        )}

        <div className="flex flex-col gap-2">
          <Label htmlFor={`answer-message-${guest.id}`}>Message</Label>
          <Textarea
            id={`answer-message-${guest.id}`}
            name="message"
            rows={2}
            defaultValue={response?.message ?? ""}
          />
        </div>
      </div>
    </BaseModal>
  );
}
