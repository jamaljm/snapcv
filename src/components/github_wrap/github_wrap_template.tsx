import React from "react";
import { GithubData } from "@/lib/github-type";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const COLORS = ["#A855F7", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"];

interface GithubWrapTemplateProps {
  profile: GithubData;
}

interface HeatmapValue {
  date: string | Date;
  count: number;
}

export default function GithubWrapTemplate({
  profile,
}: GithubWrapTemplateProps) {
  // Transform activity data for the chart
  const activityData = Object.entries(
    profile.activity_overview.active_days
  ).map(([date, count]) => ({
    name: new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    value: count,
  }));

  // Transform language data for the chart
  const languageData = Object.entries(
    profile.activity_overview.languages_used
  ).map(([name, value]) => ({
    name,
    value,
  }));

  // Transform data for pie chart
  const pieData = Object.entries(profile.activity_overview.languages_used).map(
    ([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  // Transform data for heatmap
  const heatmapData: HeatmapValue[] = Object.entries(
    profile.activity_overview.active_days
  ).map(([date, count]) => ({
    date: new Date(date),
    count,
  }));

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-8">
        {/* Hero Section */}
        {/* <div className="max-w-7xl mx-auto mb-16 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Your 2024 GitHub Wrapped
          </h1>
          <p className="text-xl text-gray-300">A year of code in review</p>
        </div> */}

        {/* Stats Overview */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
          {Object.entries(profile.activity_overview.total_contributions).map(
            ([key, value]) => (
              <Card
                key={key}
                className="bg-black/30 backdrop-blur-xl border-purple-500/20"
              >
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key.replace("_", " ")}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Total in 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-bold text-purple-400">
                    {value}
                  </span>
                </CardContent>
              </Card>
            )
          )}
        </div> */}

        {/* Activity Timeline */}
        {/* <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle>Contribution Timeline</CardTitle>
              <CardDescription className="text-gray-400">
                Your coding journey through the year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#A855F7"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div> */}

        {/* Activity Heatmap */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle>Contribution Heatmap</CardTitle>
              <CardDescription className="text-gray-400">
                Your coding activity throughout the year
              </CardDescription>
            </CardHeader>
       
          </Card>
        </div>

        {/* Productivity Stats */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle>Code Impact</CardTitle>
              <CardDescription className="text-gray-400">
                Your contribution to the codebase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-lg font-medium">Lines Added</div>
                  <div className="text-3xl font-bold text-green-400">
                    {profile.productivity_stats.lines_of_code.added.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-medium">Lines Deleted</div>
                  <div className="text-3xl font-bold text-red-400">
                    {profile.productivity_stats.lines_of_code.deleted.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Distribution Pie Chart */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              {/* <CardTitle>Language Distribution</CardTitle>
              <CardDescription className="text-gray-400">
                Your programming language usage
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {/* <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer> */}
                {/* <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div> */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Repository Highlights */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle>Repository Highlights</CardTitle>
              <CardDescription className="text-gray-400">
                Your most impactful projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.repository_highlights.most_starred_repositories.map(
                  (repo) => (
                    <div
                      key={repo.name}
                      className="p-4 bg-purple-900/30 rounded-lg"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {repo.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          <span className="text-yellow-400 mr-1">★</span>
                          {repo.stars}
                        </Badge>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Impact */}
        <div className="max-w-7xl mx-auto mb-12">
          <Card className="bg-black/30 backdrop-blur-xl border-purple-500/20">
            <CardHeader>
              <CardTitle>Community Impact</CardTitle>
              <CardDescription className="text-gray-400">
                Your influence in the GitHub community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-purple-900/30 rounded-lg">
                  <div className="text-4xl font-bold text-purple-400">
                    {profile.engagement.stars_and_followers.followers}
                  </div>
                  <div className="mt-2 text-gray-300">New Followers</div>
                </div>
                <div className="text-center p-6 bg-purple-900/30 rounded-lg">
                  <div className="text-4xl font-bold text-pink-400">
                    {profile.engagement.stars_and_followers.stars}
                  </div>
                  <div className="mt-2 text-gray-300">Total Stars</div>
                </div>
                <div className="text-center p-6 bg-purple-900/30 rounded-lg">
                  <div className="text-4xl font-bold text-blue-400">
                    {profile.community_interaction.discussions_participated}
                  </div>
                  <div className="mt-2 text-gray-300">Discussions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
