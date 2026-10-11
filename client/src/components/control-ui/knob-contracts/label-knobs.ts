export const labelKnobs = ["--cui-label-root-foreground"] as const;
export type LabelKnobStyle = Partial<Record<(typeof labelKnobs)[number], string>>;
