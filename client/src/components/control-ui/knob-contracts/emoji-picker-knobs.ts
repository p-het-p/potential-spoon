export const emojiPickerKnobs = [
  "--cui-emoji-picker-cell-size",
  "--cui-emoji-picker-height",
  "--cui-emoji-picker-cell-radius",
  "--cui-emoji-picker-glyph-size",
  "--cui-emoji-picker-active-background",
  "--cui-emoji-picker-header-background",
  "--cui-emoji-picker-header-foreground",
] as const;
export type EmojiPickerKnobStyle = Partial<Record<(typeof emojiPickerKnobs)[number], string>>;
