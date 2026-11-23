/** Marks a guest who answered on the general /invitation link instead of being added by the couple. */
export function GeneralLinkBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
      via general link
    </span>
  );
}
