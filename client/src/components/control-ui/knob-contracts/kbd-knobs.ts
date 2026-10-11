export const kbdKnobs = [
  "--cui-kbd-radius",
  "--cui-kbd-background",
  "--cui-kbd-foreground",
  "--cui-kbd-border-color",
  "--cui-kbd-shadow",
] as const;
export type KbdKnobStyle = Partial<Record<(typeof kbdKnobs)[number], string>>;
