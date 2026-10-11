export const breadcrumbKnobs = [
  "--cui-breadcrumb-list-foreground",
  "--cui-breadcrumb-page-foreground",
  "--cui-breadcrumb-link-hover-foreground",
] as const;
export type BreadcrumbKnobStyle = Partial<Record<(typeof breadcrumbKnobs)[number], string>>;
