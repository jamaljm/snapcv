import { NextResponse } from "next/server";

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchGitHubData(username: string) {
  if (!GITHUB_TOKEN) {
    throw new Error("GitHub token is not configured");
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        name
        avatarUrl
        followers {
          totalCount
        }
        repositories(
          first: 100,
          privacy: PUBLIC,
          orderBy: {field: STARGAZERS, direction: DESC}
        ) {
          totalCount
          nodes {
            name
            stargazerCount
            primaryLanguage {
              name
            }
          }
        }
        login
        contributionsCollection {
          totalCommitContributions
          totalPullRequestContributions
          totalIssueContributions
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables: { username } }),
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.user;
}

function calculateLanguageUsage(repositories: any[]) {
  const languageCount: { [key: string]: number } = {};
  let total = 0;

  repositories.forEach((repo) => {
    if (repo.primaryLanguage?.name) {
      languageCount[repo.primaryLanguage.name] =
        (languageCount[repo.primaryLanguage.name] || 0) + 1;
      total++;
    }
  });

  return Object.entries(languageCount).reduce(
    (acc: { [key: string]: number }, [lang, count]) => {
      acc[lang] = Math.round((count / total) * 100);
      return acc;
    },
    {}
  );
}

export async function POST(request: Request) {
  try {
    if (!GITHUB_TOKEN) {
      return NextResponse.json(
        { error: "GitHub token is not configured" },
        { status: 500 }
      );
    }

    const { githubUsername } = await request.json();

    if (!githubUsername) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const githubData = await fetchGitHubData(githubUsername);

    const formattedData = {
      profile: {
        name: githubData.name,
        avatar_url: githubData.avatarUrl,
        followers: githubData.followers.totalCount,
        public_repos: githubData.repositories.totalCount,
        username: githubData.login,
      },
      activity_overview: {
        total_contributions: {
          commits: githubData.contributionsCollection.totalCommitContributions,
          pull_requests:
            githubData.contributionsCollection.totalPullRequestContributions,
          issues: githubData.contributionsCollection.totalIssueContributions,
        },
        languages_used: calculateLanguageUsage(githubData.repositories.nodes),
      },
      repository_highlights: {
        most_starred_repositories: githubData.repositories.nodes
          .slice(0, 3)
          .map((repo: any) => ({
            name: repo.name,
            stars: repo.stargazerCount,
          })),
      },
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("GitHub API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch GitHub data",
      },
      { status: 500 }
    );
  }
}
