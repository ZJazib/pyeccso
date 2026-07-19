// CMS field configuration per content type.
// Each type defines the fields shown in the editor form.

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "url"
  | "email"
  | "number"
  | "date"
  | "datetime"
  | "select"
  | "image"
  | "gallery"
  | "i18n-text"
  | "i18n-textarea"
  | "i18n-richtext"
  | "tags"
  | "boolean";

export type Field = {
  name: string; // path in `data` jsonb, or "cover_url" for column
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  placeholder?: string;
  help?: string;
  required?: boolean;
  column?: boolean; // true = top-level column, else stored under `data`
};

export type CmsConfig = {
  type: string;
  label: string;
  singular: string;
  description?: string;
  titleField?: string; // key inside `data.en` used to display the row
  listColumns?: { key: string; label: string; kind?: "text" | "date" | "status" | "cover" }[];
  fields: Field[];
};

const LANGS = ["en", "dr", "ps", "ar", "fr"] as const;
export type Lang = typeof LANGS[number];
export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "dr", label: "Dari" },
  { code: "ps", label: "Pashto" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "French" },
];

const COMMON_LIST: CmsConfig["listColumns"] = [
  { key: "cover_url", label: "", kind: "cover" },
  { key: "title", label: "Title" },
  { key: "status", label: "Status", kind: "status" },
  { key: "updated_at", label: "Updated", kind: "date" },
];

const I18N_TITLE_SUMMARY_BODY: Field[] = [
  { name: "title", label: "Title", type: "i18n-text", required: true },
  { name: "summary", label: "Short summary", type: "i18n-textarea" },
  { name: "body", label: "Body", type: "i18n-richtext" },
];

export const CMS_CONFIGS: Record<string, CmsConfig> = {
  page: {
    type: "page",
    label: "Pages",
    singular: "Page",
    titleField: "title",
    listColumns: [
      { key: "title", label: "Title" },
      { key: "slug", label: "Slug" },
      { key: "status", label: "Status", kind: "status" },
      { key: "updated_at", label: "Updated", kind: "date" },
    ],
    fields: [
      ...I18N_TITLE_SUMMARY_BODY,
      { name: "meta_title", label: "SEO title", type: "i18n-text" },
      { name: "meta_description", label: "SEO description", type: "i18n-textarea" },
    ],
  },
  program: {
    type: "program",
    label: "Programs",
    singular: "Program",
    titleField: "title",
    listColumns: COMMON_LIST,
    fields: [
      { name: "cover_url", label: "Cover image", type: "image", column: true },
      ...I18N_TITLE_SUMMARY_BODY,
      { name: "category", label: "Category", type: "text" },
      { name: "icon", label: "Icon name (lucide)", type: "text", help: "e.g. GraduationCap, Users, Heart" },
    ],
  },
  project: {
    type: "project",
    label: "Projects",
    singular: "Project",
    titleField: "title",
    listColumns: COMMON_LIST,
    fields: [
      { name: "cover_url", label: "Cover image", type: "image", column: true },
      ...I18N_TITLE_SUMMARY_BODY,
      { name: "category", label: "Category", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "end_date", label: "End date", type: "date" },
      { name: "budget", label: "Budget (USD)", type: "number" },
      { name: "beneficiaries", label: "Beneficiaries", type: "number" },
      { name: "gallery", label: "Gallery", type: "gallery" },
      { name: "partner", label: "Partner", type: "text" },
    ],
  },
  news: {
    type: "news",
    label: "News",
    singular: "News article",
    titleField: "title",
    listColumns: COMMON_LIST,
    fields: [
      { name: "cover_url", label: "Cover image", type: "image", column: true },
      { name: "title", label: "Title", type: "i18n-text", required: true },
      { name: "excerpt", label: "Excerpt", type: "i18n-textarea" },
      { name: "body", label: "Article body", type: "i18n-richtext" },
      { name: "author", label: "Author", type: "text" },
      { name: "category", label: "Category", type: "text" },
    ],
  },
  event: {
    type: "event",
    label: "Events",
    singular: "Event",
    titleField: "title",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "title", label: "Event" },
      { key: "start_date", label: "Starts" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Cover image", type: "image", column: true },
      { name: "title", label: "Title", type: "i18n-text", required: true },
      { name: "description", label: "Description", type: "i18n-textarea" },
      { name: "start_date", label: "Start date & time", type: "datetime" },
      { name: "end_date", label: "End date & time", type: "datetime" },
      { name: "venue", label: "Venue", type: "text" },
      { name: "city", label: "City / Province", type: "text" },
      { name: "rsvp_url", label: "RSVP link", type: "url" },
    ],
  },
  team: {
    type: "team",
    label: "Team",
    singular: "Team member",
    titleField: "name",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "department", label: "Department" },
    ],
    fields: [
      { name: "cover_url", label: "Photo", type: "image", column: true },
      { name: "name", label: "Full name", type: "text", required: true },
      { name: "role", label: "Role", type: "text" },
      { name: "department", label: "Department", type: "select", options: [
        { label: "Leadership", value: "leadership" },
        { label: "Programs", value: "programs" },
        { label: "Operations", value: "operations" },
        { label: "Communications", value: "communications" },
        { label: "Finance", value: "finance" },
      ] },
      { name: "bio", label: "Bio", type: "i18n-textarea" },
      { name: "email", label: "Email", type: "email" },
      { name: "linkedin", label: "LinkedIn URL", type: "url" },
      { name: "twitter", label: "Twitter URL", type: "url" },
    ],
  },
  partner: {
    type: "partner",
    label: "Partners",
    singular: "Partner",
    titleField: "name",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "name", label: "Partner" },
      { key: "category", label: "Category" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Logo", type: "image", column: true },
      { name: "name", label: "Partner name", type: "text", required: true },
      { name: "website", label: "Website", type: "url" },
      { name: "category", label: "Category", type: "select", options: [
        { label: "Donor", value: "donor" },
        { label: "Implementation partner", value: "implementation" },
        { label: "Government", value: "government" },
        { label: "UN Agency", value: "un" },
        { label: "NGO", value: "ngo" },
      ] },
      { name: "description", label: "Description", type: "i18n-textarea" },
    ],
  },
  testimonial: {
    type: "testimonial",
    label: "Testimonials",
    singular: "Testimonial",
    titleField: "name",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "name", label: "From" },
      { key: "role", label: "Role" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Photo", type: "image", column: true },
      { name: "name", label: "Person name", type: "text", required: true },
      { name: "role", label: "Role or affiliation", type: "text" },
      { name: "quote", label: "Quote", type: "i18n-textarea", required: true },
      { name: "rating", label: "Rating (1-5)", type: "number" },
    ],
  },
  publication: {
    type: "publication",
    label: "Publications",
    singular: "Publication",
    titleField: "title",
    listColumns: COMMON_LIST,
    fields: [
      { name: "cover_url", label: "Cover", type: "image", column: true },
      { name: "title", label: "Title", type: "i18n-text", required: true },
      { name: "description", label: "Description", type: "i18n-textarea" },
      { name: "year", label: "Year", type: "number" },
      { name: "category", label: "Category", type: "select", options: [
        { label: "Annual Report", value: "annual" },
        { label: "Research", value: "research" },
        { label: "Policy Brief", value: "policy" },
        { label: "Newsletter", value: "newsletter" },
        { label: "Report", value: "report" },
      ] },
      { name: "file_url", label: "PDF / File URL", type: "url" },
    ],
  },
  career: {
    type: "career",
    label: "Careers",
    singular: "Job posting",
    titleField: "title",
    listColumns: [
      { key: "title", label: "Position" },
      { key: "location", label: "Location" },
      { key: "employment_type", label: "Type" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "title", label: "Position title", type: "i18n-text", required: true },
      { name: "description", label: "Job description", type: "i18n-richtext" },
      { name: "requirements", label: "Requirements", type: "i18n-textarea" },
      { name: "department", label: "Department", type: "text" },
      { name: "location", label: "Location", type: "text" },
      { name: "employment_type", label: "Type", type: "select", options: [
        { label: "Full-time", value: "full-time" },
        { label: "Part-time", value: "part-time" },
        { label: "Contract", value: "contract" },
        { label: "Internship", value: "internship" },
        { label: "Volunteer", value: "volunteer" },
      ] },
      { name: "deadline", label: "Application deadline", type: "date" },
      { name: "salary_range", label: "Salary range", type: "text" },
    ],
  },
  donation: {
    type: "donation",
    label: "Donation Campaigns",
    singular: "Campaign",
    titleField: "title",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "title", label: "Campaign" },
      { key: "goal_amount_afn", label: "Goal (AFN)" },
      { key: "raised_amount_afn", label: "Raised (AFN)" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Cover image", type: "image", column: true },
      { name: "title", label: "Campaign title", type: "i18n-text", required: true },
      { name: "description", label: "Description", type: "i18n-textarea" },
      { name: "goal_amount_afn", label: "Goal amount (AFN)", type: "number" },
      { name: "raised_amount_afn", label: "Raised so far (AFN)", type: "number" },
      { name: "beneficiaries", label: "Beneficiaries", type: "number" },
      { name: "province", label: "Province", type: "text" },
    ],
  },
  media: {
    type: "media",
    label: "Media Center",
    singular: "Media item",
    titleField: "title",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "title", label: "Title" },
      { key: "kind", label: "Kind" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Thumbnail", type: "image", column: true },
      { name: "title", label: "Title", type: "i18n-text", required: true },
      { name: "description", label: "Description", type: "i18n-textarea" },
      { name: "kind", label: "Kind", type: "select", options: [
        { label: "Photo", value: "photo" },
        { label: "Video", value: "video" },
        { label: "Press Release", value: "press" },
        { label: "News Story", value: "story" },
        { label: "Media Coverage", value: "coverage" },
      ] },
      { name: "external_url", label: "External URL (video / press link)", type: "url" },
    ],
  },
  learn: {
    type: "learn",
    label: "Learn Trainings",
    singular: "Training",
    titleField: "title",
    listColumns: COMMON_LIST,
    fields: [
      { name: "cover_url", label: "Cover", type: "image", column: true },
      { name: "title", label: "Training title", type: "i18n-text", required: true },
      { name: "description", label: "Description", type: "i18n-richtext" },
      { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 4 weeks" },
      { name: "level", label: "Level", type: "select", options: [
        { label: "Beginner", value: "beginner" },
        { label: "Intermediate", value: "intermediate" },
        { label: "Advanced", value: "advanced" },
      ] },
      { name: "seats", label: "Seats available", type: "number" },
      { name: "start_date", label: "Start date", type: "date" },
      { name: "deadline", label: "Registration deadline", type: "date" },
      { name: "instructor", label: "Instructor", type: "text" },
      { name: "location", label: "Location / Online", type: "text" },
    ],
  },
  office: {
    type: "office",
    label: "Offices",
    singular: "Office",
    titleField: "name",
    listColumns: [
      { key: "cover_url", label: "", kind: "cover" },
      { key: "name", label: "Office" },
      { key: "city", label: "City / Province" },
      { key: "status", label: "Status", kind: "status" },
    ],
    fields: [
      { name: "cover_url", label: "Cover / photo", type: "image", column: true },
      { name: "name", label: "Office name", type: "i18n-text", required: true },
      { name: "summary", label: "Short summary", type: "i18n-textarea" },
      { name: "body", label: "About this office", type: "i18n-richtext" },
      { name: "city", label: "City / Province", type: "text" },
      { name: "address", label: "Street address", type: "textarea" },
      { name: "phone", label: "Phone", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "hours", label: "Opening hours", type: "text" },
      { name: "map_url", label: "Google Maps embed URL", type: "url" },
      { name: "lat", label: "Latitude", type: "number" },
      { name: "lng", label: "Longitude", type: "number" },
    ],
  },
  sector: {
    type: "sector",
    label: "Sectors of Work",
    singular: "Sector",
    description: "Categories shown in the 'Our Sectors of Work' section on the home page.",
    titleField: "title",
    listColumns: [
      { key: "title", label: "Sector" },
      { key: "status", label: "Status", kind: "status" },
      { key: "updated_at", label: "Updated", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Title", type: "i18n-text", required: true },
      { name: "summary", label: "Short description", type: "i18n-textarea" },
      { name: "icon", label: "Icon name (lucide)", type: "text", help: "e.g. GraduationCap, HeartPulse, Leaf, Users", placeholder: "GraduationCap" },
    ],
  },
};

