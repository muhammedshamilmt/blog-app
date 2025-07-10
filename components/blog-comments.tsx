"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Heart, Reply, MoreHorizontal, Flag } from "lucide-react"
import { toast } from "sonner"

interface BlogCommentsProps {
  id: string
}

export function BlogComments({ id }: BlogCommentsProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState<{ [createdAt: string]: boolean }>({});

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/comments?blogId=${id}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setComments(data.comments || []);
        } else {
          setComments([]);
          setError(data.message || 'Failed to fetch comments');
        }
      } catch (err: any) {
        setComments([]);
        setError('Failed to fetch comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      toast.error("Please write a comment before submitting")
      return
    }

    const authorName = 'Anonymous';

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentContent: newComment,
          authorName,
          blogId: id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNewComment("");
        toast.success("Comment posted successfully!");
        // Refetch comments after posting
        const fetchComments = async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch(`/api/comments?blogId=${id}`);
            const data = await res.json();
            if (res.ok && data.success) {
              setComments(data.comments || []);
            } else {
              setComments([]);
              setError(data.message || 'Failed to fetch comments');
            }
          } catch (err: any) {
            setComments([]);
            setError('Failed to fetch comments');
          } finally {
            setLoading(false);
          }
        };
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to post comment');
      }
    } catch (error) {
      toast.error('Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLikeComment = async (commentCreatedAt: string) => {
    // Optimistically update UI
    setComments((prev) => prev.map((c) => {
      if (c.createdAt === commentCreatedAt) {
        return { ...c, likes: (c.likes || 0) + 1 };
      }
      return c;
    }));
    try {
      const res = await fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: id, commentCreatedAt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to like comment');
      }
    } catch (error) {
      toast.error('Failed to like comment');
    }
  }

  // Add reply handler
  const handleReplySubmit = async (parentCreatedAt: string) => {
    if (!replyText.trim()) {
      toast.error("Please write a reply before submitting");
      return;
    }
    const authorName = 'Anonymous';
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentContent: replyText,
          authorName,
          blogId: id,
          parentCommentCreatedAt: parentCreatedAt,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReplyText("");
        setReplyingTo(null);
        toast.success("Reply posted successfully!");
        // Refetch comments after posting reply
        const fetchComments = async () => {
          setLoading(true);
          setError(null);
          try {
            const res = await fetch(`/api/comments?blogId=${id}`);
            const data = await res.json();
            if (res.ok && data.success) {
              setComments(data.comments || []);
            } else {
              setComments([]);
              setError(data.message || 'Failed to fetch comments');
            }
          } catch (err: any) {
            setComments([]);
            setError('Failed to fetch comments');
          } finally {
            setLoading(false);
          }
        };
        fetchComments();
      } else {
        toast.error(data.message || 'Failed to post reply');
      }
    } catch (error) {
      toast.error('Failed to post reply');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-6 w-6 mr-2 text-coral-500" />
                Discussion ({comments.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Comment Form */}
              <div className="space-y-4">
                <h4 className="font-semibold">Join the conversation</h4>
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts on this article..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Be respectful and constructive in your comments
                    </p>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !newComment.trim()}
                      className="bg-navy-900 hover:bg-navy-600"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Posting...
                        </div>
                      ) : (
                        "Post Comment"
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <Separator />

              {/* Comments List */}
              <div className="space-y-6">
                {loading && <p className="text-center py-8">Loading comments...</p>}
                {error && <p className="text-center py-8 text-red-500">{error}</p>}
                {!loading && !error && comments.length === 0 && (
                  <p className="text-center py-8 text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                )}
                {!loading && !error && comments.length > 0 && comments.map((comment, index) => {
                  // Patch: Map backend comment structure to frontend expectation
                  const authorName = comment.authorName || 'Anonymous';
                  const initials = authorName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase();
                  const createdAt = comment.createdAt
                    ? new Date(comment.createdAt).toLocaleString()
                    : '';
                  return (
                  <motion.div
                      key={comment._id || comment.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex space-x-4">
                      <Avatar className="h-10 w-10">
                          {/* No avatar in backend, so fallback to initials */}
                          <AvatarImage src={''} alt={authorName} />
                        <AvatarFallback className="bg-navy-500 text-white text-sm">
                            {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                            <h5 className="font-semibold text-sm">{authorName}</h5>
                            {/* No verified info in backend */}
                          <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{createdAt}</span>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {comment.content}
                        </p>

                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                              className={`h-8 px-2 text-muted-foreground`}
                              onClick={() => handleLikeComment(comment.createdAt)}
                          >
                              <Heart className={`h-4 w-4 mr-1`} />
                              {/* No likes in backend, default to 0 */}
                              {comment.likes || 0}
                          </Button>

                            

                            {/* No replies in backend, default to 0 */}
                            {/* Replies button removed since replies are always 0 */}

                            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground ml-auto" onClick={() => setShowReplies((prev) => ({ ...prev, [comment.createdAt]: !prev[comment.createdAt] }))}>
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                            </Button>
                          </div>
                          {/* Reply form, only show if replyingTo === comment.createdAt */}
                          {replyingTo === comment.createdAt && (
                            <form onSubmit={e => { e.preventDefault(); handleReplySubmit(comment.createdAt); }} className="mt-2 space-y-2">
                              <Textarea
                                placeholder="Write your reply..."
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                className="min-h-[60px] resize-none"
                              />
                              <div className="flex gap-2">
                                <Button type="submit" size="sm" className="bg-navy-900 hover:bg-navy-600">Post Reply</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => { setReplyingTo(null); setReplyText(""); }}>Cancel</Button>
                              </div>
                            </form>
                          )}
                          {/* Show replies if toggled */}
                          {showReplies[comment.createdAt] && (
                            <div className="ml-8 mt-2 space-y-4">
                              {Array.isArray(comment.replies) && comment.replies.length > 0 ? (
                                comment.replies.map((reply: any, rIdx: number) => {
                                  const replyAuthor = reply.authorName || 'Anonymous';
                                  const replyInitials = replyAuthor.split(' ').map((n: string) => n[0]).join('').toUpperCase();
                                  const replyCreatedAt = reply.createdAt ? new Date(reply.createdAt).toLocaleString() : '';
                                  return (
                                    <div key={reply.createdAt || rIdx} className="flex space-x-3">
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={''} alt={replyAuthor} />
                                        <AvatarFallback className="bg-navy-500 text-white text-xs">{replyInitials}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <div className="flex items-center space-x-2">
                                          <span className="font-semibold text-xs">{replyAuthor}</span>
                                          <span className="text-xs text-muted-foreground">•</span>
                                          <span className="text-xs text-muted-foreground">{replyCreatedAt}</span>
                                        </div>
                                        <p className="text-xs leading-relaxed text-muted-foreground">{reply.content}</p>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <p className="text-xs text-muted-foreground">No replies yet.</p>
                              )}
                              {/* Reply button to open reply form */}
                              {replyingTo !== comment.createdAt && (
                                <Button size="sm" variant="outline" className="mt-2" onClick={() => setReplyingTo(comment.createdAt)}>
                                  Reply to this comment
                          </Button>
                              )}
                        </div>
                          )}
                      </div>
                    </div>

                    {index < comments.length - 1 && <Separator className="ml-14" />}
                  </motion.div>
                  );
                })}
              </div>

              {/* Load More Comments */}
              <div className="text-center pt-6">
                <Button variant="outline" className="border-coral-500 text-coral-600 hover:bg-coral-50">
                  Load More Comments
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}