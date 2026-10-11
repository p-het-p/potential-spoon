export const spinnerKnobs = ["--cui-spinner-foreground", "--cui-spinner-animation-duration"] as const;
export type SpinnerKnobStyle = Partial<Record<(typeof spinnerKnobs)[number], string>>;
