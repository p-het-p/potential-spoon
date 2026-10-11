export const progressiveBlurKnobs = [
  "--cui-progressive-blur-size",
  "--cui-progressive-blur-backdrop-blur",
  "--cui-progressive-blur-fade-size",
  "--cui-progressive-blur-transition-duration",
  "--cui-progressive-blur-transition-delay",
] as const;
export type ProgressiveBlurKnobStyle = Partial<Record<(typeof progressiveBlurKnobs)[number], string>>;
