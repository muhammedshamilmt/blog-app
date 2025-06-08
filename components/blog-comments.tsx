"use client"

import { useState } from "react"
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

  // Mock comments data
  const comments = [
    {
      id: "1",
      author: {
        name: "Alex Rivera",
        avatar: "",
        initials: "AR",
        verified: true
      },
      content: "This is exactly what I've been thinking about lately. The collaboration between AI and human creativity is fascinating. I've been experimenting with AI tools in my design work and the results are incredible when you know how to guide them properly.",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 3,
      liked: false
    },
    {
      id: "2", 
      author: {
        name: "Jordan Kim",
        avatar: "",
        initials: "JK",
        verified: false
      },
      content: "Great article! I'm curious about the long-term implications for creative professionals. Do you think AI will eventually make certain creative roles obsolete, or will it create new opportunities?",
      timestamp: "4 hours ago",
      likes: 8,
      replies: 1,
      liked: true
    },
    {
      id: "3",
      author: {
        name: "Sam Chen",
        avatar: "",
        initials: "SC",
        verified: false
      },
      content: "I've been using AI writing tools for content creation and while they're helpful, nothing beats the human touch for emotional resonance and cultural nuance. The future is definitely in collaboration, not replacement.",
      timestamp: "6 hours ago",
      likes: 15,
      replies: 0,
      liked: false
    }
  ]

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      toast.error("Please write a comment before submitting")
      return
    }

    setIsSubmitting(true)
    console.log("Submitting comment for article:", id, newComment)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setNewComment("")
      toast.success("Comment posted successfully!")
    }, 1500)
  }

  const handleLikeComment = (commentId: string) => {
    console.log("Liking comment:", commentId)
    toast.success("Comment liked!")
  }

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
                {comments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="flex space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                        <AvatarFallback className="bg-navy-500 text-white text-sm">
                          {comment.author.initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-semibold text-sm">{comment.author.name}</h5>
                          {comment.author.verified && (
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              Verified
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>

                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {comment.content}
                        </p>

                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-8 px-2 ${comment.liked ? 'text-red-500' : 'text-muted-foreground'}`}
                            onClick={() => handleLikeComment(comment.id)}
                          >
                            <Heart className={`h-4 w-4 mr-1 ${comment.liked ? 'fill-current' : ''}`} />
                            {comment.likes}
                          </Button>

                          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground">
                            <Reply className="h-4 w-4 mr-1" />
                            Reply
                          </Button>

                          {comment.replies > 0 && (
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-coral-600">
                              View {comment.replies} {comment.replies === 1 ? 'reply' : 'replies'}
                            </Button>
                          )}

                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground ml-auto">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {index < comments.length - 1 && <Separator className="ml-14" />}
                  </motion.div>
                ))}
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