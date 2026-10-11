export const chatComposerAttachmentKnobs = [
  "--cui-chat-composer-attachment-radius",
  "--cui-chat-composer-attachment-height",
  "--cui-chat-composer-attachment-list-padding",
  "--cui-chat-composer-attachment-background",
  "--cui-chat-composer-attachment-border-color",
  "--cui-chat-composer-attachment-shadow",
  "--cui-chat-composer-attachment-backdrop-filter",
  "--cui-chat-composer-attachment-progress-background",
  "--cui-chat-composer-attachment-progress-foreground",
  "--cui-chat-composer-attachment-image-outline-color",
] as const;
export type ChatComposerAttachmentKnobStyle = Partial<Record<(typeof chatComposerAttachmentKnobs)[number], string>>;
