import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import { ProjectDetail } from "@/lib/type";
import { useMemo } from 'react';

function generateGradient(): string {
  const gradients = [
    "from-red-500 to-orange-500",
    "from-slate-500 to-slate-800",
    "from-teal-400 to-gray-800",
    "from-yellow-200 to-pink-400",
    "from-blue-400 to-emerald-400",
    "from-indigo-500 to-purple-500",
    "from-green-400 to-cyan-500",
    "from-rose-400 to-orange-300",
    "from-fuchsia-500 to-cyan-500",
    "from-violet-600 to-indigo-600"
  ];

  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
}

export function ProjectCard({
  title,
  description,
  technologies,
  image,
  website,
  source,
  duration,
  highlights,
}: ProjectDetail) {
  const gradient = useMemo(() => generateGradient(), []);

  return (
    <Card
      className={
        "flex flex-col overflow-hidden font-dmSans border hover:shadow-lg rounded-xl transition-all duration-300 ease-out h-full"
      }
    >
      <Link
        href={website || "#"}
        className={`block cursor-pointer bg-gradient-to-r ${gradient} px-4 pt-4`}
      >
        {image && (
          <img
            src={image}
            alt={title}
            className="h-40 rounded-t-xl w-full overflow-hidden object-cover object-top"
          />
        )}
      </Link>
      <CardHeader className="p-3 pb-1">
        <CardTitle className="mt-1 text-base">{title}</CardTitle>
        {description && (
          <Markdown className="prose mt-1 max-w-full text-pretty  text-xs/relaxed text-muted-foreground dark:prose-invert">
            {description}
          </Markdown>
        )}
      </CardHeader>

      <CardContent className="mt-auto flex flex-col px-3">
        {technologies && technologies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {technologies.map((tech) => (
              <Badge
                className="px-2 hover:bg-slate-200 bg-slate-100 text-slate-800/90 shadow-none rounded-xl py-0.5 text-[.67rem]"
                key={tech}
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="px-3 pb-4 pt-3">
        <div className="flex flex-row flex-wrap items-start gap-2">
          {website && (
            <Link
              href={website}
              target="_blank"
              className="flex gap-2 items-center text-xs border rounded-xl px-4 py-1.5"
            >
              {" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              Website
            </Link>
          )}
          {source && (
            <Link
              href={source}
              target="_blank"
              className="flex gap-2 items-center text-xs border rounded-xl px-4 py-1.5"
            >
              {/* Github link content */}
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
