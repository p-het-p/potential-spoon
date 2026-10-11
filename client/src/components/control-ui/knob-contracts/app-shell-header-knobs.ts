export const appShellHeaderKnobs = [
  "--cui-app-shell-header-height",
  "--cui-app-shell-header-padding-inline",
  "--cui-app-shell-header-background",
  "--cui-app-shell-header-border-color",
  "--cui-app-shell-header-border-width",
] as const;
export type AppShellHeaderKnobStyle = Partial<Record<(typeof appShellHeaderKnobs)[number], string>>;
