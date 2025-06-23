"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Clock, CheckCircle, XCircle, UserCheck } from "lucide-react";
import { toast } from "sonner";

interface Writer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isWriter: boolean;
  writerStatus: string;
  profile?: {
    title?: string;
    category?: string;
    pitch?: string;
    experience?: string;
    portfolio?: string;
  };
  createdAt: string;
}

const WritersManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [writers, setWriters] = useState<Writer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWriters();
  }, []);

  const fetchWriters = async () => {
    try {
      const response = await fetch('/api/writers');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch writers');
      }

      setWriters(data.writers);
    } catch (error) {
      console.error('Error fetching writers:', error);
      toast.error('Failed to fetch writers');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWriters = writers.filter(writer =>
    `${writer.firstName} ${writer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    writer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    writer.profile?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/writers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: 'approved'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve writer');
      }

      toast.success("Writer approved successfully");
      fetchWriters(); // Refresh the list
    } catch (error) {
      console.error('Error approving writer:', error);
      toast.error('Failed to approve writer');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch('/api/writers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: 'rejected'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject writer');
      }

      toast.success("Writer rejected");
      fetchWriters(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting writer:', error);
      toast.error('Failed to reject writer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Writer Management</h2>
          <p className="text-muted-foreground">
            Manage writer applications and approvals
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search writers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Writer Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredWriters.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No writers found
              </div>
            ) : (
              filteredWriters.map((writer) => (
                <div
                  key={writer._id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${writer.email}`} />
                    <AvatarFallback>
                      {writer.firstName[0]}{writer.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {writer.firstName} {writer.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {writer.profile?.title || 'Writer'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(writer.writerStatus || 'pending')}>
                        {(writer.writerStatus || 'pending').charAt(0).toUpperCase() + 
                         (writer.writerStatus || 'pending').slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {writer.email}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {new Date(writer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {writer.profile?.pitch && (
                      <p className="text-sm mt-2">{writer.profile.pitch}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {writer.writerStatus !== 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(writer._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      {writer.writerStatus !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(writer._id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WritersManagement; 