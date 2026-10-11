export const paginationKnobs = [
  "--cui-pagination-link-radius",
  "--cui-pagination-link-background",
  "--cui-pagination-link-hover-background",
  "--cui-pagination-link-foreground",
  "--cui-pagination-link-shadow",
] as const;
export type PaginationKnobStyle = Partial<Record<(typeof paginationKnobs)[number], string>>;
