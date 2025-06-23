"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileText, MessageSquare, TrendingUp, Eye, Clock, UserCheck } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Total Articles",
      value: "1,234",
      change: "+8%",
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Total Views",
      value: "45.2K",
      change: "+23%",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      label: "Writer Requests",
      value: "15",
      change: "+5",
      icon: UserCheck,
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
        {stats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 font-medium">
                    {stat.change}
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
                    <Eye className="h-4 w-4 inline mr-1" />
                    {activity.views} views
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
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
                  <UserCheck className="h-5 w-5 text-coral-600" />
                  <span>Writer Applications</span>
                </div>
                <Badge variant="outline">5 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Content Reviews</span>
                </div>
                <Badge variant="outline">8 pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <span>Messages</span>
                </div>
                <Badge variant="outline">12 unread</Badge>
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Fashion Trends 2024</p>
                  <p className="text-sm text-muted-foreground">Sarah Johnson</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">12.5K views</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sustainable Fashion Guide</p>
                  <p className="text-sm text-muted-foreground">John Smith</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">10.2K views</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Street Style Photography</p>
                  <p className="text-sm text-muted-foreground">Michael Brown</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">8.7K views</p>
                  <p className="text-xs text-muted-foreground">5 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 