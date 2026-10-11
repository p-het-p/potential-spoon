export const transcriptDividerKnobs = [
  "--cui-transcript-divider-foreground",
  "--cui-transcript-divider-line-color",
  "--cui-transcript-divider-danger-foreground",
  "--cui-transcript-divider-success-foreground",
  "--cui-transcript-divider-warning-foreground",
] as const;
export type TranscriptDividerKnobStyle = Partial<Record<(typeof transcriptDividerKnobs)[number], string>>;
