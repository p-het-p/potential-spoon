export const chatLayoutKnobs = [
  "--cui-chat-layout-radius",
  "--cui-chat-layout-background",
  "--cui-chat-layout-border-color",
  "--cui-chat-layout-border-width",
  "--cui-chat-layout-shadow",
  "--cui-chat-layout-scroll-button-gap",
  "--cui-chat-layout-turn-gap",
] as const;
export type ChatLayoutKnobStyle = Partial<Record<(typeof chatLayoutKnobs)[number], string>>;
