import React from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";

interface AwardCardProps {
  title: string;
  issuer: string;
  date: string;
  description?: string;
  url?: string;
}

export function AwardCard({
  title,
  issuer,
  date,
  description,
  url,
}: AwardCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden transform hover:-translate-y-1">
      <div className="p-4 space-y-3 relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out"></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-grow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"
              />
            </svg>

            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
              {title}
            </h3>
            <Badge
              variant="secondary"
              className="w-fit rounded-full font-semibold"
            >
              {issuer}
            </Badge>
            {/* <span className="text-sm font-medium text-blue-600 truncate">
              - {issuer}
            </span> */}
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {date}
          </span>
        </div>

        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {url && (
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200 group"
          >
            View Certificate
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
