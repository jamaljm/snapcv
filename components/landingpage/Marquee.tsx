import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import Link from "next/link";

const reviews = [
  {
    name: "Jamal",
    website: "jamal.snapcv.me",
    img: "/profile/jamal.jpeg",
  },
  {
    name: "Goutham",
    website: "goutham.snapcv.me",
    img: "/profile/goutham.jpeg",
  },
  {
    name: "Jeff",
    website: "jeff.snapcv.me",
    img: "/profile/jeff.jpeg",
  },
  {
    name: "Vaidyanath",
    website: "vaidyan.snapcv.me",
    img: "/profile/vaidyan.jpeg",
  },
  {
    name: "Anand",
    website: "anand.snapcv.me",
    img: "/profile/anand.jpeg",
  },
  {
    name: "James",
    website: "james.snapcv.me",
    img: "/profile/james.jpeg",
  },
];

const ReviewCard = ({
  img,
  name,
  website,
}: {
  img: string;
  name: string;
  website: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-56 sm:w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-white/70 hover:bg-gray-50",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <Link
        target="_blank"
        href={"https://" + website}
        className="flex flex-row justify-between items-center gap-2"
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full"
            width="32"
            height="32"
            alt=""
            src={img}
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">{website}</p>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="gray"
            className="size-4 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </div>
      </Link>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="absolute bottom-5  flex  h-fit w-full flex-col items-center justify-center overflow-hidden rounded-lg  ">
      <Marquee pauseOnHover className="[--duration:20s]">
        {reviews.map((review) => (
          <ReviewCard key={review.name} {...review} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3  bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
