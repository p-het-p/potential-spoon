export const activityKnobs = [
  "--cui-activity-row-foreground",
  "--cui-activity-trigger-radius",
  "--cui-activity-trigger-hover-background",
  "--cui-activity-code-background",
  "--cui-activity-code-radius",
] as const;
export type ActivityKnobStyle = Partial<Record<(typeof activityKnobs)[number], string>>;
