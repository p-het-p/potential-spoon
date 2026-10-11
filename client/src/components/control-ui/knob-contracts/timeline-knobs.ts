export const timelineKnobs = [
  "--cui-timeline-indicator-background",
  "--cui-timeline-indicator-foreground",
  "--cui-timeline-running-foreground",
  "--cui-timeline-success-foreground",
  "--cui-timeline-error-foreground",
  "--cui-timeline-separator-background",
  "--cui-timeline-title-foreground",
] as const;
export type TimelineKnobStyle = Partial<Record<(typeof timelineKnobs)[number], string>>;
