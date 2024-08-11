import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Hackathon } from "@/lib/type";
import { link } from "fs";

export function HackathonCard({
  title,
  description,
  dates,
  location,
  image,
  links,
}: Hackathon) {
  return (
    <li className="relative ml-10 py-6">
      <div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
        <Avatar className="border size-12 m-auto">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback>{title[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dates && (
          <time className="text-xs text-muted-foreground">{dates}</time>
        )}
        <h2 className="font-semibold text-base leading-none">{title}</h2>
        {location && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-xs text-muted-foreground">
            {description}
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
        {links.website && (
          <Link
            href={links?.website}
            key={"idx"}
            target="_blank"
            className="flex gap-2 items-center text-xs border rounded-xl px-4 py-1.5 "
          >
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
        {links.github && (
          <Link
            href={links.github}
            className="flex gap-2 items-center text-xs border rounded-xl px-4 py-1.5 "
          >
            <img
              className="size-4 text-gray-600"
              src="https://img.icons8.com/ios-glyphs/30/github.png"
              alt="github"
            />
            Github
          </Link>
        )}
      </div>
    </li>
  );
}
