import type {
  ConsultationMode,
  Practice,
  Profession,
  UserProfile,
} from "@/lib/type";

/** Professions offered in the editor, in display order. */
export const PROFESSIONS: { value: Profession; label: string }[] = [
  { value: "developer", label: "Software developer" },
  { value: "designer", label: "Designer" },
  { value: "dietician", label: "Dietician" },
  { value: "nutritionist", label: "Nutritionist" },
  { value: "therapist", label: "Therapist / counsellor" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "coach", label: "Coach" },
  { value: "doctor", label: "Doctor" },
  { value: "lawyer", label: "Lawyer" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];

export const CONSULTATION_MODES: { value: ConsultationMode; label: string }[] =
  [
    { value: "in_person", label: "In person" },
    { value: "online", label: "Online" },
    { value: "home_visit", label: "Home visit" },
  ];

/** Professions whose portfolio is built around a résumé, not a practice. */
const RESUME_PROFESSIONS: Profession[] = ["developer", "designer"];

/** Profiles saved before professions existed have none: treat as developer. */
export function getProfession(user: UserProfile): Profession {
  return user.meta?.profession || "developer";
}

/** True when the profile should show practice sections (services, FAQs...). */
export function isPractitioner(user: UserProfile): boolean {
  return !RESUME_PROFESSIONS.includes(getProfession(user));
}

export function consultationModeLabel(mode: ConsultationMode): string {
  return CONSULTATION_MODES.find((m) => m.value === mode)?.label || mode;
}

/** Format a service price for display, e.g. "₹1,500" or "From $40". */
export function formatPrice(price?: string, currency?: string): string {
  const raw = (price || "").trim();
  if (!raw) return "";
  const n = Number(raw.replace(/,/g, ""));
  if (!currency || Number.isNaN(n)) return raw;
  try {
    return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${raw} ${currency}`;
  }
}

/** True when the practice has anything worth rendering. */
export function hasPracticeContent(practice?: Practice): boolean {
  if (!practice) return false;
  return Boolean(
    practice.name?.trim() ||
      practice.services?.some((s) => s.name?.trim()) ||
      practice.credentials?.some((c) => c.trim()) ||
      practice.specialities?.some((c) => c.trim()) ||
      practice.faqs?.some((f) => f.question?.trim()) ||
      practice.bookingUrl?.trim()
  );
}

/**
 * schema.org type for the practice entity. LegalService and Physician are
 * real LocalBusiness subtypes; everything else is a ProfessionalService.
 */
export function practiceSchemaType(profession: Profession): string {
  switch (profession) {
    case "lawyer":
      return "LegalService";
    case "doctor":
      return "Physician";
    case "physiotherapist":
      return "Physiotherapy";
    default:
      return "ProfessionalService";
  }
}
