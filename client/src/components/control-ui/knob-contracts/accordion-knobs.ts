export const accordionKnobs = [
  "--cui-accordion-item-border-color",
  "--cui-accordion-item-border-width",
  "--cui-accordion-trigger-foreground",
  "--cui-accordion-trigger-hover-foreground",
  "--cui-accordion-icon-foreground",
] as const;
export type AccordionKnobStyle = Partial<Record<(typeof accordionKnobs)[number], string>>;
