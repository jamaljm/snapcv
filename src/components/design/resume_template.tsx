import React from "react";
import { UserProfile } from "@/lib/type";

type ResumeTemplateProps = {
  profile: UserProfile;
};

/* ---------------- small building blocks ---------------- */

const SectionTitle: React.FC<{ accent: string; children: React.ReactNode }> = ({
  accent,
  children,
}) => (
  <h2
    className="text-[13px] font-bold uppercase tracking-wider pb-1 mb-2 border-b"
    style={{ color: accent, borderColor: `${accent}55` }}
  >
    {children}
  </h2>
);

const Pill: React.FC<{ accent: string; children: React.ReactNode }> = ({
  accent,
  children,
}) => (
  <span
    className="inline-block text-[11px] leading-none px-2 py-1 rounded-full border"
    style={{ color: accent, borderColor: `${accent}55`, background: `${accent}0f` }}
  >
    {children}
  </span>
);

const LevelDots: React.FC<{ level?: number; accent: string }> = ({
  level,
  accent,
}) => {
  if (!level || level < 1) return null;
  return (
    <span className="inline-flex items-center gap-0.5 ml-2 align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: i <= level ? accent : `${accent}33` }}
        />
      ))}
    </span>
  );
};

const iconClass = "size-3.5 shrink-0";

const NetworkIcon: React.FC<{ network: string }> = ({ network }) => {
  const n = network.toLowerCase();
  if (n === "linkedin")
    return (
      <svg viewBox="0 0 50 50" className={`${iconClass} mr-1`} fill="currentColor">
        <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z" />
      </svg>
    );
  if (n === "github")
    return (
      <svg viewBox="0 0 30 30" className={`${iconClass} mr-1`} fill="currentColor">
        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z" />
      </svg>
    );
  if (n === "twitter" || n === "x")
    return (
      <svg viewBox="0 0 50 50" className={`${iconClass} mr-1`} fill="currentColor">
        <path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z" />
      </svg>
    );
  // Generic link icon for any custom network (Behance, Medium, blog, etc.)
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={`${iconClass} mr-1`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
      />
    </svg>
  );
};

/* ---------------- resume content (shared by public page + editor preview) ---------------- */

export const ResumeContent: React.FC<ResumeTemplateProps> = ({ profile }) => {
  // Résumés stay monochrome/black — sleek, professional, and ATS-friendly.
  // (The portfolio still uses the chosen accent color; the résumé does not.)
  const accent = "#111111";
  const openToWork = profile.meta?.openToWork;
  const availabilityLabel =
    profile.meta?.availabilityLabel?.trim() || "Open to work";

  const socials = profile.basics.profiles.filter(
    (p) => p.url?.trim() && p.network?.trim()
  );

  return (
    <div className="font-quattrocento text-gray-800 leading-relaxed text-sm">
      {/* Header */}
      <header className="pb-3 mb-4 border-b-2" style={{ borderColor: accent }}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 className="text-3xl font-bold">{profile.basics.name}</h1>
            {openToWork && (
              <span
                className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                style={{ color: accent, border: `1px solid ${accent}` }}
              >
                {availabilityLabel}
              </span>
            )}
          </div>
          {profile.basics.label && (
            <p className="text-sm mt-1 font-semibold" style={{ color: accent }}>
              {profile.basics.label}
            </p>
          )}

          <div className="mt-2 text-xs flex flex-wrap justify-center items-center gap-x-4 gap-y-1">
            {profile.basics.location.city &&
              profile.basics.location.countryCode && (
                <span className="flex items-center">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`${iconClass} mr-1`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                  {profile.basics.location.city},{" "}
                  {profile.basics.location.countryCode}
                </span>
              )}

            {profile.basics.email && (
              <a href={`mailto:${profile.basics.email}`} className="flex items-center hover:underline">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`${iconClass} mr-1`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                {profile.basics.email}
              </a>
            )}

            {profile.basics.phone && (
              <span className="flex items-center">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`${iconClass} mr-1`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                {profile.basics.phone}
              </span>
            )}

            {profile.basics.website && (
              <a
                href={profile.basics.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
              >
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`${iconClass} mr-1`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                  />
                </svg>
                {profile.basics.website}
              </a>
            )}

            {socials.map((social, index) => (
              <a
                key={`profileResume-${index}`}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:underline"
              >
                <NetworkIcon network={social.network} />
                {social.username?.trim() || social.network}
              </a>
            ))}
          </div>
        </div>
      </header>

      {profile.basics.about && (
        <section className="mb-4">
          <p className="text-xs">{profile.basics.about}</p>
        </section>
      )}

      {profile.work.length > 0 && profile.work[0].name !== "" && (
        <section className="mb-4">
          <SectionTitle accent={accent}>Experience</SectionTitle>
          {profile.work.map((work, index) => (
            <div key={`workResume-${index}`} className="mb-3">
              <div className="flex justify-between items-baseline gap-2 flex-wrap">
                <h3 className="text-[15px] font-semibold">{work.position}</h3>
                {(work.startDate || work.endDate) && (
                  <span className="text-[11px] text-gray-500 whitespace-nowrap">
                    {work.startDate}
                    {work.endDate && ` – ${work.endDate}`}
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold" style={{ color: accent }}>
                {work.name}
                {work.location && (
                  <span className="text-gray-500 font-normal"> · {work.location}</span>
                )}
              </p>
              {work.summary && <p className="text-xs mt-1">{work.summary}</p>}
              {work.highlights &&
                work.highlights.filter((h) => h && h.trim() !== "" && h !== "•")
                  .length > 0 && (
                  <ul className="list-disc pl-5 mt-1 text-xs space-y-0.5">
                    {work.highlights
                      .filter((h) => h && h.trim() !== "" && h !== "•")
                      .map((highlight, idx) => (
                        <li key={`highlightWork-${idx}`}>{highlight}</li>
                      ))}
                  </ul>
                )}
            </div>
          ))}
        </section>
      )}

      {profile.education.length > 0 &&
        profile.education[0].institution !== "" && (
          <section className="mb-4">
            <SectionTitle accent={accent}>Education</SectionTitle>
            {profile.education.map((edu, index) => (
              <div key={`educationResume-${index}`} className="mb-3">
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <h3 className="text-[15px] font-semibold">{edu.institution}</h3>
                  {(edu.startDate || edu.endDate) && (
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">
                      {edu.startDate}
                      {edu.endDate && ` – ${edu.endDate}`}
                    </span>
                  )}
                </div>
                {(edu.studyType || edu.area) && (
                  <p className="text-xs font-semibold" style={{ color: accent }}>
                    {edu.studyType}
                    {edu.area && ` in ${edu.area}`}
                  </p>
                )}
                {edu.score && (
                  <p className="text-xs text-gray-600">Score: {edu.score}</p>
                )}
                {edu.courses &&
                  edu.courses.filter((c) => c && c.trim() !== "" && c !== "•")
                    .length > 0 && (
                    <ul className="list-disc pl-5 mt-1 text-xs space-y-0.5">
                      {edu.courses
                        .filter((c) => c && c.trim() !== "" && c !== "•")
                        .map((course, idx) => (
                          <li key={`courseResume-${idx}`}>{course}</li>
                        ))}
                    </ul>
                  )}
              </div>
            ))}
          </section>
        )}

      {profile.projects.projects.length > 0 &&
        profile.projects.projects[0].title !== "" && (
          <section className="mb-4">
            <SectionTitle accent={accent}>Projects</SectionTitle>
            {profile.projects.projects.map((project, index) => (
              <div key={`projectResume-${index}`} className="mb-3">
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <h3 className="text-[15px] font-semibold flex items-center gap-2">
                    {project.title}
                    {project.website && (
                      <a
                        href={project.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-normal hover:underline"
                        style={{ color: accent }}
                      >
                        Live ↗
                      </a>
                    )}
                    {project.source && (
                      <a
                        href={project.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-normal hover:underline"
                        style={{ color: accent }}
                      >
                        Source ↗
                      </a>
                    )}
                  </h3>
                  {project.duration && (
                    <span className="text-[11px] text-gray-500 whitespace-nowrap">
                      {project.duration}
                    </span>
                  )}
                </div>
                {project.description && (
                  <p className="text-xs mt-0.5">{project.description}</p>
                )}
                {project.technologies &&
                  project.technologies.filter((t) => t && t.trim() !== "").length >
                    0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.technologies
                        .filter((t) => t && t.trim() !== "")
                        .map((tech, idx) => (
                          <Pill key={`tech-${idx}`} accent={accent}>
                            {tech}
                          </Pill>
                        ))}
                    </div>
                  )}
                {project.highlights &&
                  project.highlights.filter(
                    (h) => h && h.trim() !== "" && h !== "•"
                  ).length > 0 && (
                    <ul className="list-disc pl-5 mt-1 text-xs space-y-0.5">
                      {project.highlights
                        .filter((h) => h && h.trim() !== "" && h !== "•")
                        .map((highlight, idx) => (
                          <li key={`highlight-${idx}`}>{highlight}</li>
                        ))}
                    </ul>
                  )}
              </div>
            ))}
          </section>
        )}

      {profile.skills.length > 0 && profile.skills[0].name !== "" && (
        <section className="mb-4">
          <SectionTitle accent={accent}>Skills</SectionTitle>
          <div className="space-y-2">
            {profile.skills.map((skill, index) => (
              <div key={`skillResume-${index}`} className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-xs font-semibold min-w-[110px]">
                  {skill.name}
                  <LevelDots level={skill.level} accent={accent} />
                </span>
                <span className="flex flex-wrap gap-1">
                  {skill.keywords
                    .filter((k) => k && k.trim() !== "")
                    .map((kw, idx) => (
                      <Pill key={`kw-${idx}`} accent={accent}>
                        {kw}
                      </Pill>
                    ))}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {profile.certificates &&
        profile.certificates.length > 0 &&
        profile.certificates[0].name !== "" && (
          <section className="mb-4">
            <SectionTitle accent={accent}>Certificates</SectionTitle>
            {profile.certificates.map((cert, index) => (
              <div
                key={`certificateResume-${index}`}
                className="mb-1.5 flex justify-between items-baseline gap-2 flex-wrap"
              >
                <span className="text-xs">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && (
                    <span className="text-gray-500"> · {cert.issuer}</span>
                  )}
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 hover:underline"
                      style={{ color: accent }}
                    >
                      ↗
                    </a>
                  )}
                </span>
                {cert.date && (
                  <span className="text-[11px] text-gray-500">{cert.date}</span>
                )}
              </div>
            ))}
          </section>
        )}

      {profile.awards &&
        profile.awards.length > 0 &&
        profile.awards[0].title !== "" && (
          <section className="mb-4">
            <SectionTitle accent={accent}>Awards</SectionTitle>
            {profile.awards.map((award, index) => (
              <div key={`awardResume-${index}`} className="mb-1.5">
                <div className="flex justify-between items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-semibold">{award.title}</span>
                  {award.date && (
                    <span className="text-[11px] text-gray-500">{award.date}</span>
                  )}
                </div>
                {award.awarder && (
                  <p className="text-[11px]" style={{ color: accent }}>
                    {award.awarder}
                  </p>
                )}
                {award.summary && <p className="text-xs">{award.summary}</p>}
              </div>
            ))}
          </section>
        )}

      {profile.languages &&
        profile.languages.length > 0 &&
        profile.languages[0].language !== "" && (
          <section className="mb-4">
            <SectionTitle accent={accent}>Languages</SectionTitle>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {profile.languages.map((lang, index) => (
                <span key={`languageResume-${index}`} className="text-xs">
                  <span className="font-semibold">{lang.language}</span>
                  {lang.fluency && (
                    <span className="text-gray-500"> — {lang.fluency}</span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

      {profile.interests.length > 0 && profile.interests[0].name !== "" && (
        <section className="mb-4">
          <SectionTitle accent={accent}>Interests</SectionTitle>
          <div className="flex flex-wrap gap-1">
            {profile.interests.map((interest, index) => (
              <Pill key={`interestResume-${index}`} accent={accent}>
                {interest.name}
              </Pill>
            ))}
          </div>
        </section>
      )}

      {profile.references.length > 0 && profile.references[0].name !== "" && (
        <section className="mb-2">
          <SectionTitle accent={accent}>Testimonials</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {profile.references.map((ref, index) => (
              <div
                key={`referenceResume-${index}`}
                className="rounded-lg border p-3"
                style={{ borderColor: `${accent}33` }}
              >
                {ref.reference && (
                  <p className="text-xs italic">“{ref.reference}”</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {ref.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ref.avatarUrl}
                      alt={ref.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
                      style={{ background: accent }}
                    >
                      {(ref.name || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="leading-tight">
                    <p className="text-xs font-semibold">{ref.name}</p>
                    {(ref.role || ref.company) && (
                      <p className="text-[10px] text-gray-500">
                        {ref.role}
                        {ref.role && ref.company && ", "}
                        {ref.company}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

/* ---------------- public /resume page wrapper ---------------- */

const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ profile }) => {
  return (
    <div
      id="resume-template"
      className="sm:border sm:scale-105 sm:mt-24 sm:mb-24 mt-6 sm:border-gray-200 m-2 sm:rounded-lg max-w-2xl mx-auto p-6"
    >
      <ResumeContent profile={profile} />
    </div>
  );
};

export default ResumeTemplate;
