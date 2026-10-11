export const calendarKnobs = [
  "--cui-calendar-day-radius",
  "--cui-calendar-today-background",
  "--cui-calendar-selected-background",
  "--cui-calendar-selected-foreground",
  "--cui-calendar-range-background",
] as const;
export type CalendarKnobStyle = Partial<Record<(typeof calendarKnobs)[number], string>>;
