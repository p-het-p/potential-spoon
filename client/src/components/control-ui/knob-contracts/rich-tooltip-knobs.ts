export const richTooltipKnobs = [
  "--cui-rich-tooltip-content-background",
  "--cui-rich-tooltip-content-foreground",
  "--cui-rich-tooltip-content-radius",
  "--cui-rich-tooltip-content-shadow",
  "--cui-rich-tooltip-dot-background",
  "--cui-rich-tooltip-action-radius",
  "--cui-rich-tooltip-action-background",
  "--cui-rich-tooltip-action-foreground",
  "--cui-rich-tooltip-focus-ring-color",
] as const;
export type RichTooltipKnobStyle = Partial<Record<(typeof richTooltipKnobs)[number], string>>;
