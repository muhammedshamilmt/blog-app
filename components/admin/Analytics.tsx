"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  FileText,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  BarChart3,
  LineChart,
  PieChart
} from "lucide-react";

const Analytics = () => {
  // Mock data for analytics
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Users
    },
    {
      title: "Total Articles",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: FileText
    },
    {
      title: "Total Views",
      value: "45.2K",
      change: "-2.4%",
      trend: "down",
      icon: Eye
    },
    {
      title: "Engagement Rate",
      value: "68.5%",
      change: "+5.1%",
      trend: "up",
      icon: TrendingUp
    }
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
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
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
                    {activity.type === "Content Update" && <Clock className="h-4 w-4 text-yellow-500" />}
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
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <LineChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Traffic chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <PieChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Content distribution chart will be displayed here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics; 