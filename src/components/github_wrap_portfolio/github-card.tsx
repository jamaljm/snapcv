import React from "react";
import styles from "./github-card.module.css";
import Link from "next/link";

interface GithubCardProps {
  data: {
    profile: {
      name: string;
      avatar_url: string;
      followers: number;
      public_repos: number;
      username: string;
    };
    activity_overview: {
      total_contributions: {
        commits: number;
        pull_requests: number;
        issues: number;
      };
      languages_used: {
        [key: string]: number;
      };
    };
    repository_highlights: {
      most_starred_repositories: Array<{
        name: string;
        stars: number;
      }>;
    };
  };
}

const languageColors: { [key: string]: string } = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Java: "#b07219",
  Ruby: "#701516",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Swift: "#ffac45",
  Kotlin: "#F18E33",
  Rust: "#dea584",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  Vue: "#41b883",
  React: "#61dafb",
  Dart: "#00B4AB",
  Shell: "#89e051",
  PowerShell: "#012456",
};

const getLanguageColor = (language: string): string => {
  if (languageColors[language]) {
    return languageColors[language];
  }

  let hash = 0;
  for (let i = 0; i < language.length; i++) {
    hash = language.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = hash % 360;
  return `hsl(${h}, 65%, 50%)`;
};

const CommitIcon = () => (
  <svg className={styles.statIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M7,13H17V11H7" />
  </svg>
);

const PullRequestIcon = () => (
  <svg className={styles.statIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6,3A3,3 0 0,1 9,6C9,7.31 8.17,8.42 7,8.83V15.17C8.17,15.58 9,16.69 9,18A3,3 0 0,1 6,21A3,3 0 0,1 3,18C3,16.69 3.83,15.58 5,15.17V8.83C3.83,8.42 3,7.31 3,6A3,3 0 0,1 6,3M6,5A1,1 0 0,0 5,6A1,1 0 0,0 6,7A1,1 0 0,0 7,6A1,1 0 0,0 6,5M6,17A1,1 0 0,0 5,18A1,1 0 0,0 6,19A1,1 0 0,0 7,18A1,1 0 0,0 6,17M21,18A3,3 0 0,1 18,21A3,3 0 0,1 15,18C15,16.69 15.83,15.58 17,15.17V7H15V10L12,7L15,4V7H17A2,2 0 0,1 19,9V15.17C20.17,15.58 21,16.69 21,18M18,17A1,1 0 0,0 17,18A1,1 0 0,0 18,19A1,1 0 0,0 19,18A1,1 0 0,0 18,17Z" />
  </svg>
);

const CodeIcon = () => (
  <svg className={styles.statIcon} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z" />
  </svg>
);

export default function GithubCard({ data }: GithubCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.decorativeSphere1} />
      <div className={styles.decorativeSphere2} />
      <div className={styles.codePatternOverlay} />

      <div className={styles.wrapTitle}>
        <span className={styles.year}>2024</span>
        <span className={styles.wrap}>Wrapped</span>
      </div>

      <img
        src="/github-mark.svg"
        alt="GitHub"
        className={styles.decorativeImage}
      />

      <div className={styles.profileSection}>
        <img
          src={data.profile.avatar_url}
          alt={data.profile.name}
          className={styles.profileImage}
        />
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{data.profile.name}</h2>
          <div className={styles.profileStats}>
            <span>@{data.profile.username}</span>
            <div className={styles.statHighlight}>
              <svg
                className={styles.statIcon}
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16.5,13C15.1,13 14,14.1 14,15.5C14,16.9 15.1,18 16.5,18C17.9,18 19,16.9 19,15.5C19,14.1 17.9,13 16.5,13M16.5,16.5C15.9,16.5 15.5,16.1 15.5,15.5C15.5,14.9 15.9,14.5 16.5,14.5C17.1,14.5 17.5,14.9 17.5,15.5C17.5,16.1 17.1,16.5 16.5,16.5M12,9C10.6,9 9.5,10.1 9.5,11.5C9.5,12.9 10.6,14 12,14C13.4,14 14.5,12.9 14.5,11.5C14.5,10.1 13.4,9 12,9M12,12.5C11.4,12.5 11,12.1 11,11.5C11,10.9 11.4,10.5 12,10.5C12.6,10.5 13,10.9 13,11.5C13,12.1 12.6,12.5 12,12.5M7.5,13C6.1,13 5,14.1 5,15.5C5,16.9 6.1,18 7.5,18C8.9,18 10,16.9 10,15.5C10,14.1 8.9,13 7.5,13M7.5,16.5C6.9,16.5 6.5,16.1 6.5,15.5C6.5,14.9 6.9,14.5 7.5,14.5C8.1,14.5 8.5,14.9 8.5,15.5C8.5,16.1 8.1,16.5 7.5,16.5M12,0C5.4,0 0,5.4 0,12C0,18.6 5.4,24 12,24C18.6,24 24,18.6 24,12C24,5.4 18.6,0 12,0M12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2C17.5,2 22,6.5 22,12C22,17.5 17.5,22 12,22Z" />
              </svg>
              <span className={styles.statNumber}>
                {data.profile.followers.toLocaleString()}
              </span>
              followers
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <CommitIcon />
          <div className={styles.statValue}>
            {data.activity_overview.total_contributions.commits.toLocaleString()}
          </div>
          <div className={styles.statLabel}>Total Commits</div>
          <svg
            className={styles.sparkline}
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 L20 8 L40 12 L60 7 L80 13 L100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className={styles.statBox}>
          <PullRequestIcon />
          <div className={styles.statValue}>
            {data.activity_overview.total_contributions.pull_requests}
          </div>
          <div className={styles.statLabel}>Pull Requests</div>
          <svg
            className={styles.sparkline}
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 10 L20 8 L40 12 L60 7 L80 13 L100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className={styles.statBox}>
          <CodeIcon />
          <div className={styles.statValue}>{data.profile.public_repos}</div>
          <div className={styles.statLabel}>Total Repositories</div>
          <svg
            className={styles.sparkline}
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 15 L20 5 L40 15 L60 10 L80 15 L100 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className={`${styles.statBox} ${styles.languageBox}`}>
          <img
            src="/code.png"
            alt=""
            className={styles.languageDecorativeImage}
          />
          <div className={styles.statLabel}>Languages</div>
          <div className={styles.languageBar}>
            {Object.entries(data.activity_overview.languages_used)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([lang, percentage], index) => (
                <div
                  key={lang}
                  className={styles.languageSegment}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getLanguageColor(lang),
                    zIndex: 10 - index,
                  }}
                  title={`${lang}: ${percentage}%`}
                />
              ))}
            {Object.entries(data.activity_overview.languages_used).length >
              3 && (
              <div
                className={styles.languageSegment}
                style={{
                  width: `${Object.entries(
                    data.activity_overview.languages_used
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(3)
                    .reduce((sum, [_, percentage]) => sum + percentage, 0)}%`,
                  backgroundColor: "#666",
                  zIndex: 7,
                }}
                title="Others"
              />
            )}
          </div>
          <div className={styles.languageLabels}>
            {Object.entries(data.activity_overview.languages_used)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([lang, percentage]) => (
                <span key={lang} className={styles.languageLabel}>
                  <span
                    className={styles.languageColor}
                    style={{ backgroundColor: getLanguageColor(lang) }}
                  />
                  <span className={styles.languageName}>{lang}</span>
                  <span className={styles.languagePercentage}>
                    {percentage}%
                  </span>
                </span>
              ))}
          </div>
        </div>

        <div className={`${styles.statBox} ${styles.repoBox}`}>
          <div className={styles.statLabel}>Top Repositories</div>
          <div className={styles.repoList}>
            {data.repository_highlights.most_starred_repositories.map(
              (repo) => (
                <Link
                  href={`https://github.com/${repo.name}`}
                  target="_blank"
                  key={repo.name}
                  className={styles.repoItem}
                >
                  <span className="block sm:hidden">
                    {repo.name.length > 24
                      ? `${repo.name.slice(0, 24)}...`
                      : repo.name}
                  </span>
                  <span className="hidden sm:block">
                    {repo.name.length > 11
                      ? `${repo.name.slice(0, 11)}...`
                      : repo.name}
                  </span>
                  <span>⭐ {repo.stars}</span>
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
