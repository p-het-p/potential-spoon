export const itemKnobs = [
  "--cui-item-radius",
  "--cui-item-hover-background",
  "--cui-item-hover-border-color",
  "--cui-item-border-width",
  "--cui-item-active-scale",
  "--cui-item-gap",
  "--cui-item-padding-block",
  "--cui-item-padding-inline",
] as const;
export type ItemKnobStyle = Partial<Record<(typeof itemKnobs)[number], string>>;
