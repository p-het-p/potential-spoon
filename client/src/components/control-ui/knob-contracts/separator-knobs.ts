export const separatorKnobs = ["--cui-separator-root-background"] as const;
export type SeparatorKnobStyle = Partial<Record<(typeof separatorKnobs)[number], string>>;
