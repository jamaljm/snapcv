import React from "react";
import { UserProfile } from "@/lib/type";

type ResumeTemplateProps = {
  profile: UserProfile;
};

/* ---------------- helpers ---------------- */

// "May 2022 - Present" style range with an en dash. Tolerates either side
// being empty so partial data never renders a dangling separator.
const dateRange = (start?: string, end?: string): string => {
  const s = start?.trim();
  const e = end?.trim();
  if (s && e) return `${s} – ${e}`;
  return s || e || "";
};

// Bare, readable URL for print: no protocol, no www, no trailing slash.
const displayUrl = (url: string): string =>
  url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "");

const clean = (items?: string[]): string[] =>
  (items || []).filter((v) => v && v.trim() !== "" && v.trim() !== "•");

/* ---------------- small building blocks ---------------- */

// Section heading: small caps with a hairline that runs out to the right.
// Structure without decoration; the rule never touches the descenders.
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <section className="mb-[18px]">
    <div className="flex items-center gap-3 mb-2.5">
      <h2 className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-neutral-900 leading-none shrink-0">
        {title}
      </h2>
      <span aria-hidden="true" className="flex-1 border-t border-neutral-200" />
    </div>
    {children}
  </section>
);

// Right-aligned dates and other meta. Tabular figures keep columns steady.
const Meta: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[10.5px] text-neutral-500 tabular-nums whitespace-nowrap pt-px">
    {children}
  </span>
);

// Proficiency as text glyphs, not painted backgrounds, so every printer
// keeps them. Reads as filled and hollow dots in pure monochrome.
const LevelDots: React.FC<{ level?: number }> = ({ level }) => {
  if (!level || level < 1) return null;
  const filled = Math.min(level, 5);
  return (
    <span
      aria-label={`Proficiency ${filled} of 5`}
      className="ml-2 text-[7px] tracking-[0.2em] align-[1.5px] select-none"
    >
      <span className="text-neutral-800">{"●".repeat(filled)}</span>
      <span className="text-neutral-300">{"●".repeat(5 - filled)}</span>
    </span>
  );
};

// Shared bullet list for Experience and Projects.
const Bullets: React.FC<{ items?: string[] }> = ({ items }) => {
  const list = clean(items);
  if (list.length === 0) return null;
  return (
    <ul className="list-disc pl-[1.15em] mt-1.5 space-y-[3px] text-[11.5px] leading-[1.5] text-neutral-700 marker:text-neutral-400">
      {list.map((item, idx) => (
        <li key={idx} className="pl-[2px]">
          {item}
        </li>
      ))}
    </ul>
  );
};

// Quiet inline link for Live / Source / certificate references.
const LinkOut: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-[10px] font-medium text-neutral-500 whitespace-nowrap hover:text-neutral-900 hover:underline underline-offset-2"
  >
    {children}
  </a>
);

/* ---------------- resume content (shared by public page + editor preview) ---------------- */

export const ResumeContent: React.FC<ResumeTemplateProps> = ({ profile }) => {
  const basics = profile.basics;
  const openToWork = profile.meta?.openToWork;
  const availabilityLabel =
    profile.meta?.availabilityLabel?.trim() || "Open to work";

  // Pre-filter every collection so section guards and rows agree.
  const work = (profile.work || []).filter(
    (w) => w && (w.position?.trim() || w.name?.trim())
  );
  const projects = (profile.projects?.projects || []).filter((p) =>
    p?.title?.trim()
  );
  const skillGroups = (profile.skills || []).filter((s) => s?.name?.trim());
  const flatSkills = clean(basics?.skills);
  const education = (profile.education || []).filter((e) =>
    e?.institution?.trim()
  );
  const certificates = (profile.certificates || []).filter((c) =>
    c?.name?.trim()
  );
  const awards = (profile.awards || []).filter((a) => a?.title?.trim());
  const languages = (profile.languages || []).filter((l) =>
    l?.language?.trim()
  );
  const interests = (profile.interests || []).filter((i) => i?.name?.trim());
  const references = (profile.references || []).filter((r) => r?.name?.trim());

  // One contact line: location, email, phone, then bare URLs for site and
  // socials. Bare URLs survive on paper, where nothing is clickable.
  const contacts: React.ReactNode[] = [];
  const loc = basics?.location;
  if (loc?.city && loc?.countryCode)
    contacts.push(
      <span key="loc">
        {loc.city}, {loc.countryCode}
      </span>
    );
  if (basics?.email)
    contacts.push(
      <a
        key="email"
        href={`mailto:${basics.email}`}
        className="hover:text-neutral-900 hover:underline underline-offset-2"
      >
        {basics.email}
      </a>
    );
  if (basics?.phone) contacts.push(<span key="phone">{basics.phone}</span>);
  if (basics?.website)
    contacts.push(
      <a
        key="site"
        href={basics.website}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-neutral-900 hover:underline underline-offset-2"
      >
        {displayUrl(basics.website)}
      </a>
    );
  (basics?.profiles || [])
    .filter((p) => p?.url?.trim() && p?.network?.trim())
    .forEach((s, i) =>
      contacts.push(
        <a
          key={`s-${i}`}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-900 hover:underline underline-offset-2"
        >
          {displayUrl(s.url) || s.username?.trim() || s.network}
        </a>
      )
    );

  return (
    <div className="font-dmSans text-neutral-700 text-[11.5px] leading-[1.5] antialiased">
      {/* Header: flush-left letterhead. The single near-black rule below is
          the only strong line on the page; every other rule is a hairline. */}
      <header className="pb-4 mb-[18px] border-b border-neutral-800">
        <div className="flex items-baseline justify-between gap-x-4 gap-y-1 flex-wrap">
          <h1 className="text-[26px] font-bold tracking-[-0.015em] leading-[1.1] text-neutral-900">
            {basics?.name}
          </h1>
          {openToWork && (
            <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-neutral-900 whitespace-nowrap">
              <span aria-hidden="true" className="text-[7px] leading-none">
                ●
              </span>
              {availabilityLabel}
            </span>
          )}
        </div>
        {basics?.label && (
          <p className="mt-1 text-[12.5px] text-neutral-600">{basics.label}</p>
        )}
        {contacts.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] text-neutral-600">
            {contacts.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-neutral-300">
                    ·
                  </span>
                )}
                {c}
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* Summary */}
      {basics?.about && (
        <Section title="Summary">
          <p className="text-[11.5px] leading-[1.55] text-neutral-700">
            {basics.about}
          </p>
        </Section>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <Section title="Experience">
          <div className="space-y-3.5">
            {work.map((job, index) => (
              <div key={`workResume-${index}`} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-x-3 gap-y-0.5 flex-wrap">
                  <h3 className="text-[12.5px] font-semibold text-neutral-900 leading-snug">
                    {job.position || job.name}
                  </h3>
                  {(job.startDate || job.endDate) && (
                    <Meta>{dateRange(job.startDate, job.endDate)}</Meta>
                  )}
                </div>
                {(job.position ? job.name : "") || job.location ? (
                  <p className="text-[11.5px] leading-snug mt-px">
                    {job.position && job.name && (
                      <span className="font-medium text-neutral-800">
                        {job.name}
                      </span>
                    )}
                    {job.location && (
                      <span className="text-neutral-500">
                        {job.position && job.name && " · "}
                        {job.location}
                      </span>
                    )}
                  </p>
                ) : null}
                {job.summary && (
                  <p className="mt-1 text-[11.5px] leading-[1.5] text-neutral-700">
                    {job.summary}
                  </p>
                )}
                <Bullets items={job.highlights} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <Section title="Projects">
          <div className="space-y-3.5">
            {projects.map((project, index) => {
              const tech = clean(project.technologies);
              return (
                <div
                  key={`projectResume-${index}`}
                  className="break-inside-avoid"
                >
                  <div className="flex justify-between items-baseline gap-x-3 gap-y-0.5 flex-wrap">
                    <h3 className="text-[12.5px] font-semibold text-neutral-900 leading-snug">
                      {project.title}
                      {project.website && (
                        <>
                          {"  "}
                          <LinkOut href={project.website}>Live ↗</LinkOut>
                        </>
                      )}
                      {project.source && (
                        <>
                          {"  "}
                          <LinkOut href={project.source}>Source ↗</LinkOut>
                        </>
                      )}
                    </h3>
                    {project.duration && <Meta>{project.duration}</Meta>}
                  </div>
                  {project.description && (
                    <p className="mt-0.5 text-[11.5px] leading-[1.5] text-neutral-700">
                      {project.description}
                    </p>
                  )}
                  {tech.length > 0 && (
                    <p className="mt-1 text-[10.5px] leading-snug text-neutral-500">
                      {tech.join(" · ")}
                    </p>
                  )}
                  <Bullets items={project.highlights} />
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {/* Skills: a definition grid so keyword columns align, which is what
          makes a skills block scan in one pass. Falls back to the flat
          basics list when no groups exist. */}
      {(skillGroups.length > 0 || flatSkills.length > 0) && (
        <Section title="Skills">
          {skillGroups.length > 0 ? (
            <div className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-5 gap-y-[5px]">
              {skillGroups.map((skill, index) => {
                const kws = clean(skill.keywords);
                return (
                  <React.Fragment key={`skillResume-${index}`}>
                    <div className="text-[11.5px] font-semibold text-neutral-900 leading-[1.5]">
                      {skill.name}
                      <LevelDots level={skill.level} />
                    </div>
                    <div className="text-[11.5px] text-neutral-700 leading-[1.5]">
                      {kws.join(", ")}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <p className="text-[11.5px] leading-[1.5] text-neutral-700">
              {flatSkills.join(", ")}
            </p>
          )}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Education">
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div
                key={`educationResume-${index}`}
                className="break-inside-avoid"
              >
                <div className="flex justify-between items-baseline gap-x-3 gap-y-0.5 flex-wrap">
                  <h3 className="text-[12.5px] font-semibold text-neutral-900 leading-snug">
                    {edu.institution}
                  </h3>
                  {(edu.startDate || edu.endDate) && (
                    <Meta>{dateRange(edu.startDate, edu.endDate)}</Meta>
                  )}
                </div>
                {(edu.studyType || edu.area || edu.score) && (
                  <p className="text-[11.5px] leading-snug mt-px text-neutral-700">
                    {edu.studyType}
                    {edu.studyType && edu.area
                      ? ` in ${edu.area}`
                      : edu.area}
                    {edu.score && (
                      <span className="text-neutral-500">
                        {(edu.studyType || edu.area) && " · "}
                        {edu.score}
                      </span>
                    )}
                  </p>
                )}
                {clean(edu.courses).length > 0 && (
                  <p className="mt-1 text-[10.5px] leading-snug text-neutral-500">
                    Coursework: {clean(edu.courses).join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certificates.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-[5px]">
            {certificates.map((cert, index) => (
              <div
                key={`certificateResume-${index}`}
                className="flex justify-between items-baseline gap-x-3 gap-y-0.5 flex-wrap text-[11.5px] leading-snug"
              >
                <span className="text-neutral-700">
                  <span className="font-medium text-neutral-900">
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span className="text-neutral-500"> · {cert.issuer}</span>
                  )}
                  {cert.url && (
                    <>
                      {"  "}
                      <LinkOut href={cert.url}>↗</LinkOut>
                    </>
                  )}
                </span>
                {cert.date && <Meta>{cert.date}</Meta>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <Section title="Awards">
          <div className="space-y-2">
            {awards.map((award, index) => (
              <div key={`awardResume-${index}`} className="break-inside-avoid">
                <div className="flex justify-between items-baseline gap-x-3 gap-y-0.5 flex-wrap">
                  <span className="text-[11.5px] leading-snug font-medium text-neutral-900">
                    {award.title}
                    {award.awarder && (
                      <span className="font-normal text-neutral-500">
                        {" "}
                        · {award.awarder}
                      </span>
                    )}
                  </span>
                  {award.date && <Meta>{award.date}</Meta>}
                </div>
                {award.summary && (
                  <p className="text-[11.5px] leading-[1.5] text-neutral-600">
                    {award.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages">
          <p className="text-[11.5px] leading-[1.5] text-neutral-700">
            {languages.map((l, i) => (
              <React.Fragment key={`languageResume-${i}`}>
                {i > 0 && (
                  <span aria-hidden="true" className="text-neutral-300">
                    {"  ·  "}
                  </span>
                )}
                {l.language}
                {l.fluency && (
                  <span className="text-neutral-500"> ({l.fluency})</span>
                )}
              </React.Fragment>
            ))}
          </p>
        </Section>
      )}

      {/* Interests */}
      {interests.length > 0 && (
        <Section title="Interests">
          <p className="text-[11.5px] leading-[1.5] text-neutral-700">
            {interests.map((i) => i.name).join("  ·  ")}
          </p>
        </Section>
      )}

      {/* References */}
      {references.length > 0 && (
        <Section title="References">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
            {references.map((ref, index) => (
              <div
                key={`referenceResume-${index}`}
                className="break-inside-avoid"
              >
                {ref.reference && (
                  <p className="text-[11.5px] leading-[1.5] italic text-neutral-700">
                    “{ref.reference}”
                  </p>
                )}
                <p className="mt-1 text-[10.5px] leading-snug text-neutral-500">
                  <span className="font-medium text-neutral-800">
                    {ref.name}
                  </span>
                  {(ref.role || ref.company) && (
                    <>
                      {" · "}
                      {ref.role}
                      {ref.role && ref.company && ", "}
                      {ref.company}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
};

/* ---------------- public /resume page wrapper ---------------- */

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ profile }) => {
  return (
    <div
      id="resume-template"
      className="sm:border sm:mt-24 sm:mb-24 mt-6 sm:border-neutral-200 m-2 sm:rounded-lg max-w-2xl mx-auto p-8 sm:p-12 bg-white"
    >
      <ResumeContent profile={profile} />
    </div>
  );
};

export default ResumeTemplate;
