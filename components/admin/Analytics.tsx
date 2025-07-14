"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  Heart,
  TrendingUp,
  LineChart as LucideLineChart,
  PieChart as LucidePieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const Analytics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalUploads: 0,
    totalViews: 0,
    engagementRate: "0.0%",
    totalLikes: 0,
    totalWriters: 0,
  });
  const [loading, setLoading] = useState(true);
  const [likesByDay, setLikesByDay] = useState<{ date: string; count: number }[]>([]);
  const [uploadsByDay, setUploadsByDay] = useState<{ date: string; count: number }[]>([]);
  const [signupsByDay, setSignupsByDay] = useState<{ date: string; count: number }[]>([]);
  const [uploadsByCategory, setUploadsByCategory] = useState<{ category: string; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
          setLikesByDay(data.data.likesByDay || []);
          setUploadsByDay(data.data.uploadsByDay || []);
          setSignupsByDay(data.data.signupsByDay || []);
          setUploadsByCategory(data.data.uploadsByCategory || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: loading ? <span className="animate-pulse text-gray-400">...</span> : stats.totalUsers.toLocaleString(),
      change: "",
      trend: "up",
      icon: Users,
    },
    {
      title: "Total Articles",
      value: loading ? <span className="animate-pulse text-gray-400">...</span> : stats.totalUploads.toLocaleString(),
      change: "",
      trend: "up",
      icon: FileText,
    },
    {
      title: "Total Likes",
      value: loading ? <span className="animate-pulse text-gray-400">...</span> : stats.totalLikes.toLocaleString(),
      change: "",
      trend: "up",
      icon: Heart,
    },
    {
      title: "Writers",
      value: loading ? <span className="animate-pulse text-gray-400">...</span> : stats.totalWriters.toLocaleString(),
      change: "",
      trend: "up",
      icon: Users,
    },
  ];

  const recentActivity = [
    {
      type: "New User",
      description: "John Smith joined the platform",
      time: "2 hours ago"
    },
    {
      type: "New Article",
      description: "Sarah Johnson published 'Fashion Trends 2024'",
      time: "4 hours ago"
    },
    {
      type: "Writer Application",
      description: "Michael Brown applied to become a writer",
      time: "6 hours ago"
    },
    {
      type: "Content Update",
      description: "Emma Wilson updated her profile",
      time: "8 hours ago"
    }
  ];

  const topArticles = [
    {
      title: "Fashion Trends 2024",
      views: "12.5K",
      author: "Sarah Johnson",
      category: "Fashion"
    },
    {
      title: "Sustainable Fashion Guide",
      views: "10.2K",
      author: "John Smith",
      category: "Sustainability"
    },
    {
      title: "Street Style Photography",
      views: "8.7K",
      author: "Michael Brown",
      category: "Photography"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your website's performance and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* Remove change/trend for now, or add if you want to compute them */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-1">
                    {activity.type === "New User" && <Users className="h-4 w-4 text-blue-500" />}
                    {activity.type === "New Article" && <FileText className="h-4 w-4 text-green-500" />}
                    {activity.type === "Writer Application" && <TrendingUp className="h-4 w-4 text-purple-500" />}
                    {activity.type === "Content Update" && <LucideLineChart className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topArticles.map((article, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="mt-1">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{article.title}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Activity Overview Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Overview (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={likesByDay.map((d, i) => ({
                    date: d.date,
                    likes: d.count,
                    uploads: uploadsByDay[i]?.count || 0,
                    signups: signupsByDay[i]?.count || 0,
                  }))} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
                    <Line type="monotone" dataKey="uploads" stroke="#82ca9d" name="Uploads" />
                    <Line type="monotone" dataKey="signups" stroke="#ffc658" name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploads by Category Bar Graph */}
        <Card>
          <CardHeader>
            <CardTitle>Uploads by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {loading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse">Loading chart...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={uploadsByCategory} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <XAxis dataKey="category" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Uploads" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 