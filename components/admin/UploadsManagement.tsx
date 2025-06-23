"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, FileText, Clock, CheckCircle, XCircle, Eye, Download, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { BlogPreview } from "@/components/blog-preview";

interface Upload {
  _id: string;
  title: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
  };
  category: string;
  type: string;
  status: string;
  createdAt: string;
  wordCount: number;
  attachments: string[];
  content: string;
}

const UploadsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUpload, setPreviewUpload] = useState<Upload | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/uploads');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch uploads');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch uploads');
      }

      if (!Array.isArray(data.data)) {
        throw new Error('Invalid data format received');
      }

      setUploads(data.data);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch uploads');
      toast.error(error instanceof Error ? error.message : 'Failed to fetch uploads');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUploads = uploads.filter(upload =>
    upload?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${upload?.author?.firstName || ''} ${upload?.author?.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    upload?.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch('/api/uploads', {
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
        throw new Error(data.message || 'Failed to publish content');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to publish content');
      }

      toast.success(data.message || "Content published successfully");
      fetchUploads(); // Refresh the list
    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to publish content');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch('/api/uploads', {
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
        throw new Error(data.message || 'Failed to reject content');
      }

      if (!data.success) {
        throw new Error(data.message || 'Failed to reject content');
      }

      toast.success(data.message || "Content rejected");
      fetchUploads(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting content:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reject content');
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchUploads} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview Overlay */}
      {previewUpload && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex flex-col">
          {/* Preview Header */}
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setPreviewUpload(null)}
                  className="text-coral-600 hover:text-coral-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-coral-100 text-coral-700">
                    Live Preview Mode
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          {/* Blog Preview */}
          <BlogPreview
            titles={[
              { id: "title", type: "title", value: previewUpload.title || "Untitled" }
            ]}
            excerpts={[]}
            contents={[
              { id: "content", type: "content", value: previewUpload.content || "" }
            ]}
            category={previewUpload.category || "Uncategorized"}
            tags={[]}
            featuredImage={null}
          />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Uploads</h2>
          <p className="text-muted-foreground">
            Manage and review content submissions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[300px]"
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUploads.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No content submissions found
              </div>
            ) : (
              filteredUploads.map((upload) => (
                <div
                  key={upload._id}
                  className="flex items-start space-x-4 p-4 border rounded-lg"
                >
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${upload.author?.email}`} />
                    <AvatarFallback>
                      {upload.author?.firstName?.[0] || ''}{upload.author?.lastName?.[0] || ''}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{upload.title || 'Untitled'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(upload.type || 'article').charAt(0).toUpperCase() + (upload.type || 'article').slice(1)} • {upload.category || 'Uncategorized'}
                        </p>
                      </div>
                      <Badge className={getStatusColor(upload.status || 'pending')}>
                        {(upload.status || 'pending').charAt(0).toUpperCase() + (upload.status || 'pending').slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {upload.wordCount || 0} words
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {upload.createdAt ? new Date(upload.createdAt).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                    {upload.attachments && upload.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {upload.attachments.map((file, index) => (
                          <Badge key={index} variant="outline" className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {file}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {upload.status !== 'published' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(upload._id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Publish
                        </Button>
                      )}
                      {upload.status !== 'rejected' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(upload._id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => setPreviewUpload(upload)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      {upload.attachments && upload.attachments.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
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

export default UploadsManagement; 