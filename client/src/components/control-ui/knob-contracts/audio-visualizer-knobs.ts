export const audioVisualizerKnobs = [
  "--cui-audio-visualizer-bar-size",
  "--cui-audio-visualizer-bar-gap",
  "--cui-audio-visualizer-radius",
  "--cui-audio-visualizer-bar-radius",
  "--cui-audio-visualizer-bar-background",
  "--cui-audio-visualizer-line-fill",
  "--cui-audio-visualizer-line-stroke",
  "--cui-audio-visualizer-baseline-stroke",
] as const;
export type AudioVisualizerKnobStyle = Partial<Record<(typeof audioVisualizerKnobs)[number], string>>;
