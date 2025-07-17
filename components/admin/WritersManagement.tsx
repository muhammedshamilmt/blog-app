"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Mail, Clock, CheckCircle, XCircle, UserCheck, Eye } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

interface Writer {
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  initials?: string;
  specialty?: string;
  articles?: number;
  likes?: number;
  featured?: boolean;
  profile?: {
    title?: string;
    category?: string;
    pitch?: string;
    experience?: string;
    portfolio?: string;
    bio?: string;
    profileImageUrl?: string;
    specialty?: string;
    articlesPublished?: number;
    likes?: number;
    status?: string;
    updatedAt?: string;
  };
}

const WritersManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [writers, setWriters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWriter, setSelectedWriter] = useState<Writer | null>(null);
  const [profileOverlayOpen, setProfileOverlayOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const firstProfileShown = useRef(false);

  useEffect(() => {
    fetchWriters();
  }, [statusFilter]);

  const fetchWriters = async () => {
    try {
      const statusParam = statusFilter === 'all' ? '' : `?status=${statusFilter}`;
      const response = await fetch(`/api/writers${statusParam}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch writers');
      }

      setWriters(Array.isArray(data.data?.requests) ? data.data.requests : []);
    } catch (error) {
      console.error('Error fetching writers:', error);
      toast.error('Failed to fetch writers');
      setWriters([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPending = writers.filter(w => (w.status === 'pending') && (
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  ));
  const filteredApproved = writers.filter(w => (w.status === 'approved') && (
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  ));
  const filteredDeactivated = writers.filter(w => (w.status === 'deactivated') && (
    (w.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const handleViewProfile = async (email: string) => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileOverlayOpen(true);
    try {
      const response = await fetch(`/api/writers/${encodeURIComponent(email)}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch writer profile');
      }
      setSelectedWriter(data.data);
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Failed to fetch writer profile');
      setSelectedWriter(null);
    } finally {
      setProfileLoading(false);
    }
  };

  // No automatic overlay opening; only open on View Profile click

  const handleApprove = async (email: string, id?: string) => {
    try {
      const response = await fetch('/api/writers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          id,
          status: 'approved',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve writer');
      }
      toast.success('Writer approved successfully');
      fetchWriters();
      // Refetch profile overlay if open
      if (profileOverlayOpen && selectedWriter?.email === email) {
        handleViewProfile(email);
      }
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
      // Refetch profile overlay if open
      if (profileOverlayOpen && selectedWriter && selectedWriter.profile?.status !== 'rejected') {
        handleViewProfile(selectedWriter.email);
      }
    } catch (error) {
      console.error('Error rejecting writer:', error);
      toast.error('Failed to reject writer');
    }
  };

  const handleDeactivate = async (email: string) => {
    try {
      const response = await fetch('/api/writers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          status: 'deactivated',
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to deactivate writer');
      }
      toast.success('Writer deactivated successfully');
      fetchWriters();
      // Refetch profile overlay if open
      if (profileOverlayOpen && selectedWriter?.email === email) {
        handleViewProfile(email);
      }
    } catch (error) {
      console.error('Error deactivating writer:', error);
      toast.error('Failed to deactivate writer');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "deactivated":
        return "bg-gray-200 text-gray-700";
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
      {/* Filter Dropdown */}
      <div className="flex items-center gap-4 mb-2">
        <label htmlFor="statusFilter" className="font-medium">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>
      {/* Profile Overlay */}
      {profileOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-8 relative max-h-[80vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              onClick={() => setProfileOverlayOpen(false)}
            >
              <XCircle className="h-6 w-6" />
            </button>
            {profileLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="w-8 h-8 border-4 border-coral-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : profileError ? (
              <div className="text-center text-red-500">{profileError}</div>
            ) : selectedWriter ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedWriter.profile?.profileImageUrl || selectedWriter.avatar || (selectedWriter as any).profileImageUrl || `https://avatar.vercel.sh/${selectedWriter.email}`} />
                    <AvatarFallback>
                      {(selectedWriter.initials || (selectedWriter.name && selectedWriter.name.split(' ').map((n: string) => n[0]).join('')) || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedWriter.name || 'Unknown'}</h3>
                    <p className="text-sm text-muted-foreground">{selectedWriter.profile?.title || (selectedWriter as any).title || selectedWriter.specialty || 'Writer'}</p>
                    <p className="text-xs text-muted-foreground">{selectedWriter.email}</p>
                    <Badge className={getStatusColor(selectedWriter.profile?.status || (selectedWriter as any).status || 'pending')}>
                      {(selectedWriter.profile?.status || (selectedWriter as any).status || 'pending').charAt(0).toUpperCase() + (selectedWriter.profile?.status || (selectedWriter as any).status || 'pending').slice(1)}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedWriter.profile?.bio && <p><span className="font-semibold">Bio:</span> {selectedWriter.profile.bio}</p>}
                  {selectedWriter.profile?.category && <p><span className="font-semibold">Category:</span> {selectedWriter.profile.category}</p>}
                  {selectedWriter.profile?.pitch && <p><span className="font-semibold">Pitch:</span> {selectedWriter.profile.pitch}</p>}
                  {selectedWriter.profile?.experience && <p><span className="font-semibold">Experience:</span> {selectedWriter.profile.experience}</p>}
                  {selectedWriter.profile?.portfolio && <p><span className="font-semibold">Portfolio:</span> <a href={selectedWriter.profile.portfolio} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{selectedWriter.profile.portfolio}</a></p>}
                  {selectedWriter.profile?.specialty && <p><span className="font-semibold">Specialty:</span> {selectedWriter.profile.specialty}</p>}
                  {selectedWriter.profile?.articlesPublished !== undefined && <p><span className="font-semibold">Articles Published:</span> {selectedWriter.profile.articlesPublished}</p>}
                  {selectedWriter.profile?.likes !== undefined && <p><span className="font-semibold">Likes:</span> {selectedWriter.profile.likes}</p>}
                  {selectedWriter.profile?.status && <p><span className="font-semibold">Status:</span> {selectedWriter.profile.status}</p>}
                  {selectedWriter.profile?.updatedAt && <p><span className="font-semibold">Updated At:</span> {new Date(selectedWriter.profile.updatedAt).toLocaleString()}</p>}
                  {(selectedWriter as any).title && <p><span className="font-semibold">Title:</span> {(selectedWriter as any).title}</p>}
                  {(selectedWriter as any).category && <p><span className="font-semibold">Category:</span> {(selectedWriter as any).category}</p>}
                  {(selectedWriter as any).pitch && <p><span className="font-semibold">Pitch:</span> {(selectedWriter as any).pitch}</p>}
                  {(selectedWriter as any).experience && <p><span className="font-semibold">Experience:</span> {(selectedWriter as any).experience}</p>}
                  {(selectedWriter as any).portfolio && <p><span className="font-semibold">Portfolio:</span> <a href={(selectedWriter as any).portfolio} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{(selectedWriter as any).portfolio}</a></p>}
                  {(selectedWriter as any).status && <p><span className="font-semibold">Status:</span> {(selectedWriter as any).status}</p>}
                  {(selectedWriter as any).updatedAt && <p><span className="font-semibold">Updated At:</span> {new Date((selectedWriter as any).updatedAt).toLocaleString()}</p>}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Writer Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Writer Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPending.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending requests found
                </div>
              ) : (
                filteredPending.map((req, idx) => (
                  <div
                    key={req.id || idx}
                    className="flex items-start space-x-4 p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/10"
                  >
                    <Avatar>
                      <AvatarImage src={req.profileImageUrl || `https://avatar.vercel.sh/${req.email}`} />
                      <AvatarFallback>
                        {(req.name && req.name.split(' ').map((n: string) => n[0]).join(''))?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{req.name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">{req.title || 'Writer'}</p>
                        </div>
                        <Badge className={getStatusColor(req.status || 'pending')}>
                          {(req.status || 'pending').charAt(0).toUpperCase() + (req.status || 'pending').slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {req.email}
                        </div>
                      </div>
                      {req.pitch && (
                        <p className="text-sm mt-2">{req.pitch}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(req.email, req.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleReject(req.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewProfile(req.email)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
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
        {/* Approved Writers */}
        <Card>
          <CardHeader>
            <CardTitle>Approved Writers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredApproved.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No writers found
                </div>
              ) : (
                filteredApproved.map((writer, idx) => (
                  <div
                    key={writer.id || idx}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <Avatar>
                      <AvatarImage src={writer.profileImageUrl || `https://avatar.vercel.sh/${writer.email}`} />
                      <AvatarFallback>
                        {(writer.name && writer.name.split(' ').map((n: string) => n[0]).join(''))?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{writer.name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">{writer.title || 'Writer'}</p>
                        </div>
                        <Badge className={getStatusColor(writer.status || 'approved')}>
                          {(writer.status || 'approved').charAt(0).toUpperCase() + (writer.status || 'approved').slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {writer.email}
                        </div>
                      </div>
                      {writer.pitch && (
                        <p className="text-sm mt-2">{writer.pitch}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {writer.status !== 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(writer.email, writer.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve as Writer
                          </Button>
                        )}
                        {writer.status === 'approved' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeactivate(writer.email)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Deactivate Writer
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewProfile(writer.email)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
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
        {/* Deactivated Writers */}
        <Card>
          <CardHeader>
            <CardTitle>Deactivated Writers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDeactivated.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No deactivated writers found
                </div>
              ) : (
                filteredDeactivated.map((writer, idx) => (
                  <div
                    key={writer.id || idx}
                    className="flex items-start space-x-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"
                  >
                    <Avatar>
                      <AvatarImage src={writer.profileImageUrl || `https://avatar.vercel.sh/${writer.email}`} />
                      <AvatarFallback>
                        {(writer.name && writer.name.split(' ').map((n: string) => n[0]).join(''))?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{writer.name || 'Unknown'}</h3>
                          <p className="text-sm text-muted-foreground">{writer.title || 'Writer'}</p>
                        </div>
                        <Badge className={getStatusColor(writer.status || 'deactivated')}>
                          {(writer.status || 'deactivated').charAt(0).toUpperCase() + (writer.status || 'deactivated').slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          {writer.email}
                        </div>
                      </div>
                      {writer.pitch && (
                        <p className="text-sm mt-2">{writer.pitch}</p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleApprove(writer.email, writer.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve as Writer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleViewProfile(writer.email)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
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
    </div>
  );
};

export default WritersManagement; 