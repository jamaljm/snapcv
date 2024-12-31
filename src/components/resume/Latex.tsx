import { UserProfile } from "@/lib/type";

export const latexTemplate = (user: UserProfile): string => {
  return `
    \\documentclass[11pt,a4paper]{article}
    \\usepackage[utf8]{inputenc}
    \\usepackage{hyperref}
    \\usepackage{geometry}
    \\usepackage{fontawesome5}
    \\usepackage{titlesec}
    \\usepackage{enumitem}
    \\usepackage{xcolor}
    
    % Define colors
    \\definecolor{primary}{RGB}{55, 65, 81}
    \\definecolor{secondary}{RGB}{107, 114, 128}
    
    % Page margins
    \\geometry{
      top=1.5cm,
      bottom=1.5cm,
      left=2cm,
      right=2cm
    }
    
    % Custom section style
    \\titleformat{\\section}
      {\\Large\\bfseries}{}{0em}
      {\\color{primary}}[{\\titlerule[0.8pt]}]
    
    % Remove page numbers
    \\pagenumbering{gobble}
    
    \\begin{document}
    
    % Header
    \\begin{center}
      {\\Huge\\bfseries ${user.basics.name}}\\\\[0.5em]
      {\\small\\color{secondary}
        \\faMapMarker\\ ${user.basics.location.city}, ${
    user.basics.location.countryCode
  } ~|~
        \\faEnvelope\\ \\href{mailto:${user.basics.email}}{${
    user.basics.email
  }} ~|~
        \\faPhone\\ ${user.basics.phone} ~|~
        \\faGlobe\\ \\href{${user.basics.website}}{${user.basics.website}}
      }\\\\[0.3em]
      {\\small\\color{secondary}
        ${user.basics.profiles
          .map(
            (profile) =>
              `\\href{${profile.url}}{\\fa${
                profile.network === "GitHub"
                  ? "Github"
                  : profile.network === "LinkedIn"
                  ? "Linkedin"
                  : profile.network === "Twitter"
                  ? "Twitter"
                  : ""
              }\\ ${profile.username}}`
          )
          .join(" ~|~ ")}
      }
    \\end{center}

    % About
    \\vspace{0.5em}
    {\\small ${user.basics.about}}
    
    % Experience
    \\section*{Experience}
    ${user.work
      .map(
        (work) => `
      {\\bfseries ${work.position}}\\hfill{\\small ${work.startDate} - ${
          work.endDate
        }}\\\\
      {\\itshape ${work.name}, ${work.location}}\\\\
      {\\small ${work.summary}}
      \\begin{itemize}[leftmargin=*,nosep,noitemsep]
        ${work.highlights
          .map((highlight) => `\\item {\\small ${highlight}}`)
          .join("\n")}
      \\end{itemize}
    `
      )
      .join("\n\\vspace{0.5em}\n")}
    
    % Education
    \\section*{Education}
    ${user.education
      .map(
        (edu) => `
      {\\bfseries ${edu.institution}}\\hfill{\\small ${edu.startDate} - ${
          edu.endDate
        }}\\\\
      {\\itshape ${edu.studyType} in ${edu.area}}
      ${edu.score ? `\\\\{\\small Score: ${edu.score}}` : ""}
      ${
        edu.courses.length > 0
          ? `
        \\begin{itemize}[leftmargin=*,nosep,noitemsep]
          ${edu.courses
            .map((course) => `\\item {\\small ${course}}`)
            .join("\n")}
        \\end{itemize}
      `
          : ""
      }
    `
      )
      .join("\n\\vspace{0.5em}\n")}
    
    % Projects
    \\section*{Projects}
    ${user.projects.projects
      .map(
        (project) => `
      {\\bfseries ${project.title}}\\\\
      {\\small ${project.description}}\\\\
      {\\small \\textbf{Duration:} ${project.duration}}\\\\
      {\\small \\textbf{Technologies:} ${project.technologies.join(", ")}}
      \\begin{itemize}[leftmargin=*,nosep,noitemsep]
        ${project.highlights
          .map((highlight) => `\\item {\\small ${highlight}}`)
          .join("\n")}
      \\end{itemize}
    `
      )
      .join("\n\\vspace{0.5em}\n")}
    
    % Skills
    \\section*{Skills}
    \\begin{itemize}[leftmargin=*,nosep]
      ${user.skills
        .map(
          (skill) => `
        \\item {\\bfseries ${skill.name}}: {\\small ${skill.keywords.join(
            ", "
          )}}
      `
        )
        .join("\n")}
    \\end{itemize}
    
    ${
      user.certificates && user.certificates.length > 0
        ? `
      % Certificates
      \\section*{Certificates}
      \\begin{itemize}[leftmargin=*,nosep]
        ${user.certificates
          .map(
            (cert) => `
          \\item {\\bfseries ${cert.name}} - {\\small ${cert.issuer} (${
              cert.date
            })}
          ${
            cert.url
              ? `\\\\{\\small \\href{${cert.url}}{View Certificate}}`
              : ""
          }
        `
          )
          .join("\n")}
      \\end{itemize}
    `
        : ""
    }
    
    ${
      user.awards && user.awards.length > 0
        ? `
      % Awards
      \\section*{Awards}
      \\begin{itemize}[leftmargin=*,nosep]
        ${user.awards
          .map(
            (award) => `
          \\item {\\bfseries ${award.title}} - {\\small ${award.awarder} (${award.date})}
          \\\\{\\small ${award.summary}}
        `
          )
          .join("\n")}
      \\end{itemize}
    `
        : ""
    }
    
    ${
      user.languages && user.languages.length > 0
        ? `
      % Languages
      \\section*{Languages}
      ${user.languages
        .map((lang) => `${lang.language}: ${lang.fluency}`)
        .join(" ~|~ ")}
    `
        : ""
    }
    
    % Interests
    \\section*{Interests}
    \\begin{itemize}[leftmargin=*,nosep]
      ${user.interests
        .map(
          (interest) => `
        \\item {\\bfseries ${interest.name}}: {\\small ${interest.keywords.join(
            ", "
          )}}
      `
        )
        .join("\n")}
    \\end{itemize}
    
    ${
      user.references.length > 0
        ? `
      % References
      \\section*{References}
      ${user.references
        .map(
          (ref) => `
        \\begin{quote}
          {\\small "${ref.reference}"}\\\\
          {\\small --- ${ref.name}}
        \\end{quote}
      `
        )
        .join("\n")}
    `
        : ""
    }
    
    \\end{document}
  `;
};
