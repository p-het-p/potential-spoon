export const audioDeviceSelectKnobs = ["--cui-audio-device-select-status-foreground"] as const;
export type AudioDeviceSelectKnobStyle = Partial<Record<(typeof audioDeviceSelectKnobs)[number], string>>;
