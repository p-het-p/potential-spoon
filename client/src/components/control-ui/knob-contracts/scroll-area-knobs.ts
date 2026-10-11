export const scrollAreaKnobs = [
  "--cui-scroll-area-thumb-radius",
  "--cui-scroll-area-thumb-background",
  "--cui-scroll-area-corner-background",
] as const;
export type ScrollAreaKnobStyle = Partial<Record<(typeof scrollAreaKnobs)[number], string>>;
