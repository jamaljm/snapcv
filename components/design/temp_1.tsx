import { HackathonCard } from "@/components/hackathon-card";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import { EducationCard } from "@/components/education-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { UserProfile, ThemeColor } from "@/lib/type";
import { tailwindColors100 } from "@/lib/utils";
import { AwardCard } from "@/components/award-card";

const socialMediaImages: { [key: string]: string } = {
  GitHub: "/icon/github.png",
  LinkedIn: "/icon/linkedin.png",
  X: "/icon/twitter.png",
  Youtube: "/icon/youtube.png",
  dribbble: "/icon/dribbble.png",
  default: "/icon/dribbble.png", // Default icon URL
};

export default function page({ user }: { user: UserProfile }) {
  const gradientColor =
    tailwindColors100[user.meta.portfolioColor as ThemeColor];

  return (
    <>
      <div
        style={{
          background: `linear-gradient(to bottom, ${gradientColor} 0%, white 100%)`,
        }}
        className=" h-52 mx-auto flex justify-center left-0 z-0 w-full top-0"
      >
        <main className="flex w-full flex-col  max-w-2xl  pb-16 font-dmSans  min-h-[100dvh] ">
          <section
            className={cn("z-50 p-6 pt-20")}
            style={{
              background: `linear-gradient(to bottom, ${gradientColor} 0%, white 100%)`,
            }}
          >
            <div className="mx-auto w-full  max-w-2xl space-y-8">
              <div className="gap-4 flex flex-col">
                <div className="flex-col flex gap-1  font-semibold flex-1 space-y-1.5">
                  <Avatar className="size-20 border-2 border-white">
                    <AvatarImage
                      className="w-full h-full object-cover object-top"
                      alt={user.basics.name}
                      src={user.basics.avatarUrl}
                    />
                    <AvatarFallback>
                      {user.basics.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl">{user.basics.name}</h1>
                </div>
              </div>
            </div>
          </section>
          <section className="flex z-50 flex-col gap-4 px-6">
            <div className=" ">
              <h2 className="font-medium text-base">{user.basics.label}</h2>
              <p className="text-sm font-light mt-2">{user.basics.about}</p>
            </div>
            {/* {user.skills.length > 0 && (
              <div>
                <p className="font-medium text-sm text-slate-600">Skills</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.skills.map((skill) => (
                    <Badge
                      className="bg-slate-100/40  font-medium  hover:bg-slate-200 text-blue-950/95 text-xs shadow-none rounded-xl px-3.5 py-1.5"
                      key={skill}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )} */}
          </section>
          <section className="flex justify-start w-full gap-4 p-6 pt-8">
            <Link
              target="_blank"
              href={user.basics.resumeUrl}
              className="bg-none flex justify-center hover:bg-slate-50 text-slate-900 flex-1 border text-sm font-medium py-2 px-4 rounded-xl"
            >
              Resume
            </Link>
            <Link
              className="bg-gradient-to-r from-slate-900/90 to-slate-800 text-white flex-1 text-sm justify-center flex items-center rounded-xl font-medium py-2 px-4 "
              href={`mailto:${user.basics.email}`}
            >
              {user.meta.buttonText}{" "}
            </Link>
          </section>
          {user.work.length > 0 && (
            <section id="work" className="p-6">
              <div className="flex min-h-0 flex-col gap-y-3">
                <h2 className="text-lg font-semibold">Work Experience</h2>
                <div className="mt-3 space-y-6">
                  {user.work.map((work, id) => (
                    <ResumeCard
                      key={work.name}
                      logoUrl={work.logo}
                      altText={work.name}
                      title={work.name}
                      subtitle={work.position}
                      period={`${work.startDate} - ${
                        work.endDate ?? "Present"
                      }`}
                      description={work.summary}
                      href={work.website}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          {user.education.length > 0 && (
            <section id="education" className="p-6">
              <div className="flex min-h-0 flex-col gap-y-3">
                <h2 className="text-lg font-semibold">Education</h2>
                <div className="space-y-6 mt-3">
                  {user.education.map((education, id) => (
                    <EducationCard
                      key={education.institution}
                      href={education.url}
                      logoUrl={education.logo}
                      altText={education.institution}
                      title={education.institution}
                      period={`${education.startDate} - ${education.endDate}`}
                      subtitle={education.area}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          {user.projects.projects.length > 0 && (
            <section id="projects" className="p-6">
              <div className="space-y-12 w-full py-1">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block border rounded-xl bg-none text-black font-medium px-3 py-1 text-sm">
                      My Projects
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
                      Check out my latest work
                    </h2>
                    <p className="text-muted-foreground max-w-lg text-sm md:text-sm/relaxed lg:text-sm/relaxed xl:text-sm/relaxed">
                      {user.projects.description !== ""
                        ? user.projects.description
                        : `I've worked on a variety of projects, from simple
                 websites to complex web applications. Here are a few of my
                 favorites..`}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 px-3 max-w-[800px] mx-auto">
                  {user.projects.projects.map((project, id) => (
                    <ProjectCard
                      key={project.title}
                      title={project.title}
                      description={project.description}
                      duration={project.duration}
                      technologies={project.technologies}
                      image={project.image}
                      highlights={project.highlights}
                      website={project.website}
                      source={project.source}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          {user.hackathons.hackathons.length > 0 && (
            <section id="hackathons" className="p-6">
              <div className="space-y-12 w-full py-1">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block border rounded-xl bg-none text-black font-medium px-3 py-1 text-sm">
                      Hackathons
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
                      I like building things
                    </h2>
                    <p className="text-muted-foreground max-w-lg text-sm md:text-sm/relaxed lg:text-sm/relaxed xl:text-sm/relaxed">
                      {user.hackathons.description !== ""
                        ? user.hackathons.description
                        : `During my time in university, I attended ${user.hackathons.hackathons.length}+ hackathons. People from around the
                 country would come together and build incredible things in
                 2-3 days. It was eye-opening to see the endless
                 possibilities brought to life by a group of motivated and
                 passionate individuals.`}
                    </p>
                  </div>
                </div>
                <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                  {user.hackathons.hackathons.map((hackathon, id) => (
                    <HackathonCard
                      key={id}
                      title={hackathon.title}
                      description={hackathon.description}
                      location={hackathon.location}
                      win={hackathon.win}
                      dates={hackathon.dates}
                      image={hackathon.image}
                      url={hackathon.url}
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}
          {user.awards && user.awards.length > 0 && (
            <section id="awards" className="p-6">
              <div className="space-y-8 w-full py-1">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="space-y-2">
                    <div className="inline-block border rounded-xl bg-none text-black font-medium px-3 py-1 text-sm">
                      Awards & Certifications
                    </div>
                    <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
                      Recognitions and Achievements
                    </h2>
                    <p className="text-muted-foreground max-w-lg text-sm md:text-sm/relaxed lg:text-sm/relaxed xl:text-sm/relaxed">
                      Here are some of the awards and certifications I've earned throughout my career.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 px-3 sm:grid-cols-1 gap-6">
                  {user.awards.map((award, index) => (
                    <AwardCard
                      key={index}
                      title={award.title}
                      date={award.date}
                      issuer={award.awarder}
                      description={award.summary}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
          <section id="skills" className=" p-6 pb-0">
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full">
              <div className="space-y-3">
                <div className="inline-block border  rounded-xl bg-none  text-black font-medium px-3 py-1 text-sm ">
                  Contact
                </div>{" "}
                <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
                  Get in Touch
                </h2>
              </div>
            </div>
          </section>{" "}
          <div className=" w-full bg-gradient-to-t from-white to-transparent fr pb-15 z-50 flex gap-5 justify-center  p-4 px-10 sticky bottom-0">
            <div className="flex  px-4 rounded-full h-fit  justify-center items-center gap-1">
              <Link
                href={"mailto:" + user.basics.email}
                target="_blank"
                className={cn(
                  "size-12 bg-slate-100 flex justify-center items-center hover:bg-white hover:border-2 active:bg-white active:border-2 rounded-full p-2"
                )}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </Link>
              {user.basics.profiles.map(
                (profile) =>
                  profile.url && (
                    <Link
                      href={profile.url}
                      target="_blank"
                      className={cn(
                        "size-12 bg-slate-100 flex justify-center items-center hover:bg-white hover:border-2 active:bg-white active:border-2 rounded-full p-2"
                      )}
                      key={profile.network}
                    >
                      <img
                        src={
                          socialMediaImages[profile.network] ||
                          socialMediaImages.default
                        }
                        alt={`${profile.network} icon`}
                        className="size-6"
                      />
                    </Link>
                  )
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
