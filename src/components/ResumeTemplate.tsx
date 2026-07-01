import React from "react";
import { UserProfile } from "../lib/type";
import { ResumeContent } from "./design/resume_template";

type ResumeTemplateProps = {
  profile: UserProfile;
};

// Editor-preview wrapper. Reuses the same ResumeContent as the public /resume
// page so the preview always matches what visitors see.
const ResumeTemplate: React.FC<ResumeTemplateProps> = ({ profile }) => {
  return (
    <div id="resume-template" className="max-w-4xl mx-auto p-5">
      <ResumeContent profile={profile} />
    </div>
  );
};

export default ResumeTemplate;
