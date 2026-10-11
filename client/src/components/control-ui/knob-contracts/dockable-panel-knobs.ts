export const dockablePanelKnobs = [
  "--cui-dockable-panel-radius",
  "--cui-dockable-panel-background",
  "--cui-dockable-panel-foreground",
  "--cui-dockable-panel-border-color",
  "--cui-dockable-panel-border-width",
  "--cui-dockable-panel-shadow",
  "--cui-dockable-panel-drop-zone-active-background",
  "--cui-dockable-panel-drop-zone-active-border-color",
  "--cui-dockable-panel-drop-zone-background",
] as const;
export type DockablePanelKnobStyle = Partial<Record<(typeof dockablePanelKnobs)[number], string>>;
