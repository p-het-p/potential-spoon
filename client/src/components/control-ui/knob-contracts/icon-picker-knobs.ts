export const iconPickerKnobs = [
  "--cui-icon-picker-cell-size",
  "--cui-icon-picker-cell-radius",
  "--cui-icon-picker-icon-size",
  "--cui-icon-picker-foreground",
  "--cui-icon-picker-cell-hover-background",
  "--cui-icon-picker-cell-pressed-background",
] as const;
export type IconPickerKnobStyle = Partial<Record<(typeof iconPickerKnobs)[number], string>>;
