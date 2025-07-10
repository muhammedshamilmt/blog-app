"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Heart, Eye, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Image as IKImage } from "@imagekit/next";

interface RelatedArticlesProps {
  id: string
}

export function RelatedArticles({ id }: RelatedArticlesProps) {
  // Fetch two related articles from uploads DB, excluding the current article
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/uploads?status=published&limit=5`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message || 'Failed to fetch articles');
        // Filter out the current article and take 2 others
        const filtered = (data.data || []).filter((a: any) => a._id !== id).slice(0, 2);
        setRelatedArticles(filtered);
      } catch (err: any) {
        setError(err.message || 'Failed to load related articles');
      } finally {
        setLoading(false);
      }
    };
    fetchRelated();
  }, [id]);

  if (loading) return null;
  if (error) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-gradient">Related</span> Articles
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Continue your learning journey with these carefully selected articles
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {relatedArticles.map((article, index) => (
            <motion.div
              key={article._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer card-hover border-2 border-transparent hover:border-coral-500/20 h-full">
                {/* Article Image */}
                <div className="h-48 bg-gradient-to-br from-navy-500 to-coral-500 relative overflow-hidden">
                  {article.featuredImage && (
                    article.featuredImage.startsWith("https://ik.imagekit.io/1tgcghv") ? (
                      <IKImage
                        urlEndpoint="https://ik.imagekit.io/1tgcghv"
                        src={article.featuredImage.replace("https://ik.imagekit.io/1tgcghv", "")}
                        width={400}
                        height={192}
                        alt={article.titles?.[0]?.value || 'Article image'}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                    ) : (
                      <img
                        src={article.featuredImage}
                        alt={article.titles?.[0]?.value || 'Article image'}
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                    )
                  )}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {article.category || 'Uncategorized'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-xl mb-3 leading-tight group-hover:text-coral-600 transition-colors">
                    <a href={article.id ? `/articles/${article.id}` : '#'}>
                      {article.seoTitle || article.titles?.[0]?.value || 'Untitled'}
                    </a>
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {article.seoDescription || article.excerpts?.[0]?.value || ''}
                  </p>

                  {/* Article Meta */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={article.author?.avatar || ''} alt={article.author?.name || ''} />
                        <AvatarFallback className="bg-navy-500 text-white text-xs">
                          {article.author?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{article.author?.name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {/* Optionally, you can calculate read time here if available */}
                          {article.readTime || '5 min read'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-5 w-5 text-coral-500" />
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {article.likes || 0}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {article.views || 0}
                      </div>
                    </div>
                    <div className="text-coral-600 font-medium group-hover:text-coral-500">
                      Read More
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View More Articles CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="/articles"
            className="inline-flex items-center px-6 py-3 bg-navy-900 hover:bg-navy-600 text-white rounded-lg font-medium transition-colors group"
          >
            Explore All Articles
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}