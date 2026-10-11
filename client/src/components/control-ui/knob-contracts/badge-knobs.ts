export const badgeKnobs = [
  "--cui-badge-radius",
  "--cui-badge-background",
  "--cui-badge-foreground",
  "--cui-badge-border-color",
  "--cui-badge-font-size",
] as const;
export type BadgeKnobStyle = Partial<Record<(typeof badgeKnobs)[number], string>>;
