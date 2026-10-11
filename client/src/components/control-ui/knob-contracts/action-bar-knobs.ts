export const actionBarKnobs = ["--cui-action-bar-hidden-opacity", "--cui-action-bar-visible-opacity"] as const;
export type ActionBarKnobStyle = Partial<Record<(typeof actionBarKnobs)[number], string>>;
