export const SECTIONS = [
  "hero",
  "skills",
  "work",
  "experience",
  "contact",
  "demos",
] as const;

export type SectionId = (typeof SECTIONS)[number];

export type HomeSectionId = Exclude<SectionId, "demos">;

export const HOME_SECTIONS: HomeSectionId[] = [
  "hero",
  "skills",
  "work",
  "experience",
  "contact",
];
