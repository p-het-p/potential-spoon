export const buttonGroupKnobs = [
  "--cui-button-group-text-radius",
  "--cui-button-group-text-background",
  "--cui-button-group-text-foreground",
  "--cui-button-group-separator-background",
] as const;
export type ButtonGroupKnobStyle = Partial<Record<(typeof buttonGroupKnobs)[number], string>>;
