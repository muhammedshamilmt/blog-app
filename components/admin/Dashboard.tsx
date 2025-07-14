"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileText, Heart, User } from "lucide-react";

type MostLikedArticle = {
  _id: string;
  titles: string[] | string;
  likes: number;
  author?: { name?: string; email?: string };
  publishedAt?: string;
  featuredImage?: string;
};

const Dashboard = () => {
  const [stats, setStats] = useState<{
    totalUsers: number;
    totalUploads: number;
    totalLikes: number;
    totalWriters: number;
    pendingWriterApplications: number;
    pendingContentReviews: number;
    unreadMessages: number;
    mostLikedArticles: MostLikedArticle[];
  }>({
    totalUsers: 0,
    totalUploads: 0,
    totalLikes: 0,
    totalWriters: 0,
    pendingWriterApplications: 0,
    pendingContentReviews: 0,
    unreadMessages: 0,
    mostLikedArticles: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Uploads",
      value: stats.totalUploads.toLocaleString(),
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Total Likes",
      value: stats.totalLikes.toLocaleString(),
      icon: Heart,
      color: "text-purple-600",
    },
    {
      label: "Writers",
      value: stats.totalWriters.toLocaleString(),
      icon: User,
      color: "text-coral-600",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      user: "Sarah Johnson",
      action: "published",
      article: "Fashion Trends 2024",
      status: "published",
      views: "2.5K",
      date: "2 hours ago",
    },
    {
      id: "2",
      user: "Michael Brown",
      action: "submitted",
      article: "Sustainable Fashion Guide",
      status: "pending",
      views: "0",
      date: "5 hours ago",
    },
    {
      id: "3",
      user: "Emma Wilson",
      action: "applied",
      article: "Writer Application",
      status: "pending",
      views: "0",
      date: "1 day ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {loading ? <span className="animate-pulse text-gray-400">...</span> : stat.value}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {activity.user
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{activity.user}</h4>
                  <p className="text-sm text-muted-foreground">
                    {activity.action} {activity.article}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
                {activity.views !== "0" && (
                  <p className="text-sm font-medium mt-1">
                    {/* <Eye className="h-4 w-4 inline mr-1" /> */}
                    {activity.views} views
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {/* <Clock className="h-3 w-3 inline mr-1" /> */}
                  {activity.date}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* <UserCheck className="h-5 w-5 text-coral-600" /> */}
                  <span>Writer Applications</span>
                </div>
                <Badge variant="outline">{loading ? <span className="animate-pulse text-gray-400">...</span> : `${stats.pendingWriterApplications} pending`}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* <FileText className="h-5 w-5 text-green-600" /> */}
                  <span>Content Reviews</span>
                </div>
                <Badge variant="outline">{loading ? <span className="animate-pulse text-gray-400">...</span> : `${stats.pendingContentReviews} pending`}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* <MessageSquare className="h-5 w-5 text-blue-600" /> */}
                  <span>Messages</span>
                </div>
                <Badge variant="outline">{loading ? <span className="animate-pulse text-gray-400">...</span> : `${stats.unreadMessages} unread`}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse text-gray-400">Loading...</div>
              ) : stats.mostLikedArticles.length === 0 ? (
                <div className="text-muted-foreground">No articles found.</div>
              ) : (
                stats.mostLikedArticles.map((article, idx) => {
                  let displayTitle = 'Untitled';
                  if (Array.isArray(article.titles)) {
                    const t = article.titles[0];
                    if (typeof t === 'string') displayTitle = t;
                    else if (t && typeof t === 'object' && 'value' in t && typeof (t as any).value === 'string') displayTitle = (t as any).value;
                  } else if (typeof article.titles === 'string') {
                    displayTitle = article.titles;
                  } else if (article.titles && typeof article.titles === 'object' && 'value' in article.titles && typeof (article.titles as any).value === 'string') {
                    displayTitle = (article.titles as any).value;
                  }
                  return (
                    <div key={article._id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{displayTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {article.author?.name || article.author?.email || 'Unknown Author'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{article.likes?.toLocaleString?.() ?? 0} likes</p>
                        <p className="text-xs text-muted-foreground">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 