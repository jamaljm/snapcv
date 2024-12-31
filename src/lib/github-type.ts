export interface GithubData {
  activity_overview: {
    total_contributions: {
      commits: number;
      pull_requests: number;
      issues: number;
      code_reviews: number;
    };
    active_days: {
      [date: string]: number;
    };
    languages_used: {
      [language: string]: number;
    };
  };
  repository_highlights: {
    most_starred_repositories: Array<{
      name: string;
      stars: number;
    }>;
    most_forked_repositories: Array<{
      name: string;
      forks: number;
    }>;
    new_repositories: Array<{
      name: string;
      created_at: string;
    }>;
  };
  collaboration_metrics: {
    top_collaborators: Array<{
      username: string;
      contributions: number;
    }>;
    merged_pull_requests: number;
    issues_created_and_closed: {
      created: number;
      closed: number;
    };
  };
  productivity_stats: {
    lines_of_code: {
      added: number;
      deleted: number;
    };
    average_commit_time: string;
  };
  engagement: {
    stars_and_followers: {
      stars: number;
      followers: number;
    };
    watchers_and_forkers: {
      watchers: number;
      forkers: number;
    };
  };
  milestones_and_achievements: {
    first_contribution: string;
    top_achievements: Array<{
      title: string;
      date: string;
    }>;
  };
  community_interaction: {
    repositories_contributed_to: string[];
    discussions_participated: number;
  };
  trending_projects: {
    repositories_that_trended: Array<{
      name: string;
      stars: number;
    }>;
    project_stats: {
      views: number;
      clones: number;
      referrals: number;
    };
  };
  future_oriented_metrics: {
    pending_pull_requests: number;
    open_issues: number;
  };
  visual_summaries: {
    activity_heatmap: {
      [date: string]: number;
    };
    language_distribution_chart: {
      [language: string]: number;
    };
    contribution_breakdown: {
      commits: number;
      pull_requests: number;
      issues: number;
      code_reviews: number;
    };
  };
}
