export const collapsibleKnobs = ["--cui-collapsible-trigger-radius", "--cui-collapsible-trigger-hover-background"] as const;
export type CollapsibleKnobStyle = Partial<Record<(typeof collapsibleKnobs)[number], string>>;
