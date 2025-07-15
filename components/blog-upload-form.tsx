"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BlogPreview } from "@/components/blog-preview"
import { 
  Upload, 
  PenTool, 
  Tag, 
  Calendar, 
  Eye,
  Save,
  Send,
  X,
  Plus,
  Hash,
  FileText,
  Globe,
  ArrowLeft
} from "lucide-react"
import { Image } from "@imagekit/next";
import { toast } from "sonner"
import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload as imagekitUpload,
} from "@imagekit/next";
import { useUser } from '@/contexts/user-context'

interface ContentBlock {
  id: string
  type: 'title' | 'excerpt' | 'content'
  value: string
}

export function BlogUploadForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    titles: [] as ContentBlock[],
    excerpts: [] as ContentBlock[],
    contents: [] as ContentBlock[],
    category: "",
    tags: [] as string[],
    featuredImage: null as string | null, // Now stores the ImageKit URL string
    publishDate: "",
    seoTitle: "",
    seoDescription: "",
    isDraft: true,
    allowComments: true,
    language: "English" // Default language
  })
  
  const [currentTag, setCurrentTag] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addContentBlock = (type: 'title' | 'excerpt' | 'content') => {
    const newBlock: ContentBlock = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      value: ""
    }
    
    setFormData(prev => ({
      ...prev,
      [`${type}s`]: [...prev[`${type}s` as keyof typeof prev] as ContentBlock[], newBlock]
    }))
    
    console.log(`Added new ${type} block:`, newBlock.id)
  }

  const removeContentBlock = (type: 'title' | 'excerpt' | 'content', blockId: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}s`]: (prev[`${type}s` as keyof typeof prev] as ContentBlock[]).filter(block => block.id !== blockId)
    }))
    
    console.log(`Removed ${type} block:`, blockId)
  }

  const updateContentBlock = (type: 'title' | 'excerpt' | 'content', blockId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}s`]: (prev[`${type}s` as keyof typeof prev] as ContentBlock[]).map(block => 
        block.id === blockId ? { ...block, value } : block
      )
    }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const IMAGEKIT_URL_ENDPOINT = "https://ik.imagekit.io/1tgcghv";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error("Image must be smaller than 3MB");
        return;
      }
      setUploadProgress(0);
      try {
        // Get ImageKit upload auth params
        const res = await fetch("/api/upload-auth");
        if (!res.ok) {
          throw new Error("Failed to get upload credentials");
        }
        const { token, expire, signature, publicKey } = await res.json();
        // Upload to ImageKit
        const uploadResponse = await imagekitUpload({
          file,
          fileName: file.name,
          expire,
          token,
          signature,
          publicKey,
          folder: "/blogapp/blogimages",
          onProgress: (event) => {
            setUploadProgress((event.loaded / event.total) * 100);
          },
        });
        // Store the uploaded image URL in formData (string)
        if (typeof uploadResponse.url === "string") {
          handleChange("featuredImage", uploadResponse.url);
        } else {
          toast.error("ImageKit did not return a valid image URL");
        }
        toast.success("Image uploaded successfully!");
      } catch (error) {
        if (error instanceof ImageKitAbortError) {
          toast.error("Image upload aborted");
        } else if (error instanceof ImageKitInvalidRequestError) {
          toast.error("Invalid image upload request");
        } else if (error instanceof ImageKitUploadNetworkError) {
          toast.error("Network error during image upload");
        } else if (error instanceof ImageKitServerError) {
          toast.error("Server error during image upload");
        } else {
          toast.error("Image upload failed");
        }
        setUploadProgress(null);
        return;
      }
      setUploadProgress(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent, action: 'save' | 'publish') => {
    e.preventDefault()
    console.log("Blog submission:", { ...formData, action })
    
    if (formData.titles.length === 0 || formData.contents.length === 0) {
      toast.error("At least one title and one content block are required")
      return
    }

    if (action === 'publish' && (formData.excerpts.length === 0 || !formData.category)) {
      toast.error("At least one excerpt and category are required for publishing")
      return
    }

    setIsLoading(true)
    
    try {
      // Get author info from localStorage
      const authorName = typeof window !== 'undefined' ? localStorage.getItem('userName') || '' : '';
      const authorEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') || '' : '';
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isDraft: action === 'save',
          authorName,
          authorEmail
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save blog post')
      }

      toast.success(data.message)
      
      // Reset form after successful submission
      setFormData({
        titles: [],
        excerpts: [],
        contents: [],
        category: "",
        tags: [],
        featuredImage: null, // Reset to null (string | null)
        publishDate: "",
        seoTitle: "",
        seoDescription: "",
        isDraft: true,
        allowComments: true,
        language: "English" // Reset language
      })
      setCurrentTag("")
      
      // Reset file input if it exists
      if (fileInputRef.current && typeof fileInputRef.current.value === "string") {
        fileInputRef.current.value = "";
      }
      
      // Optionally redirect to the blog post page
      // if (data.data?.id) {
      //   router.push(`/blog/${data.data.id}`)
      // }
      
    } catch (error) {
      console.error('Error submitting blog:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to save blog post')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    "Islamic Essentials", 
    "Lifestyle",
    "Innovation",
    "Literature",
    "Scientific Reflections",
  ]


  // Toggle between form and preview mode
  if (previewMode) {
    return (
      <div className="min-h-screen">
        {/* Preview Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setPreviewMode(false)}
                className="text-coral-600 hover:text-coral-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              
              <div className="flex items-center space-x-4">
                <Badge variant="secondary" className="bg-coral-100 text-coral-700">
                  Live Preview Mode
                </Badge>
                <Button
                  onClick={(e) => handleSubmit(e, 'save')}
                  disabled={isLoading}
                  variant="outline"
                  className="border-navy-500 text-navy-600 hover:bg-navy-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-navy-600/30 border-t-navy-600 rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Draft
                </Button>
                <Button
                  onClick={(e) => handleSubmit(e, 'publish')}
                  disabled={isLoading}
                  className="bg-coral-500 hover:bg-coral-600 text-white"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Publish
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Full Blog Preview */}
        <BlogPreview
          titles={formData.titles}
          excerpts={formData.excerpts}
          contents={formData.contents}
          category={formData.category}
          tags={formData.tags}
          featuredImage={undefined}
        />
      </div>
    )
  }

  return (
    <section className="py-12 min-h-screen bg-gradient-to-br from-editorial-bg via-background to-muted/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Create <span className="text-gradient">New Article</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Share your story with the world through our editorial platform
            </p>
          </div>

          {/* Form */}
          <Card className="border-2 border-border/50 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-navy-50/50 to-coral-50/50 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center">
                  <FileText className="h-6 w-6 mr-2 text-coral-500" />
                  Article Details
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="border-coral-500 text-coral-600 hover:bg-coral-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Full Preview
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <form className="space-y-8">
                {/* Dynamic Content Blocks */}
                <div className="space-y-8">
                  {/* Article Titles */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Article Titles *</Label>
                      <Button 
                        type="button" 
                        onClick={() => addContentBlock('title')}
                        className="bg-coral-500 hover:bg-coral-600 text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Title
                      </Button>
                    </div>
                    
                    {formData.titles.length === 0 ? (
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No titles added yet. Click "Add Title" to create your first title.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.titles.map((title, index) => (
                          <motion.div
                            key={title.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border-2 border-coral-200 rounded-lg p-4 bg-coral-50/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-coral-700">Title {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContentBlock('title', title.id)}
                                className="h-6 w-6 p-0 text-coral-500 hover:text-coral-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="relative">
                              <PenTool className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Enter a compelling title..."
                                value={title.value}
                                onChange={(e) => updateContentBlock('title', title.id, e.target.value)}
                                className="pl-10 border-2 focus:border-coral-500"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Article Excerpts */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Article Excerpts *</Label>
                      <Button 
                        type="button" 
                        onClick={() => addContentBlock('excerpt')}
                        className="bg-navy-500 hover:bg-navy-600 text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Excerpt
                      </Button>
                    </div>
                    
                    {formData.excerpts.length === 0 ? (
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No excerpts added yet. Click "Add Excerpt" to create your first excerpt.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {formData.excerpts.map((excerpt, index) => (
                          <motion.div
                            key={excerpt.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border-2 border-navy-200 rounded-lg p-4 bg-navy-50/30"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-navy-700">Excerpt {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContentBlock('excerpt', excerpt.id)}
                                className="h-6 w-6 p-0 text-navy-500 hover:text-navy-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Write a brief summary that will appear in article previews..."
                              value={excerpt.value}
                              onChange={(e) => updateContentBlock('excerpt', excerpt.id, e.target.value)}
                              className="min-h-[80px] border-2 focus:border-navy-500"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              {excerpt.value.length}/160 characters recommended for SEO
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Article Content Blocks */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">Article Content *</Label>
                      <Button 
                        type="button" 
                        onClick={() => addContentBlock('content')}
                        className="bg-gradient-to-r from-coral-500 to-navy-500 hover:from-coral-600 hover:to-navy-600 text-white"
                        size="sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Content Block
                      </Button>
                    </div>
                    
                    {formData.contents.length === 0 ? (
                      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No content blocks added yet. Click "Add Content Block" to start writing.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.contents.map((content, index) => (
                          <motion.div
                            key={content.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="border-2 border-muted-foreground/20 rounded-lg p-4 bg-gradient-to-br from-coral-50/20 to-navy-50/20"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-foreground">Content Block {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeContentBlock('content', content.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              placeholder="Write your content here... You can use Markdown for formatting.

# Headings
## Subheadings
**Bold text**
*Italic text*
[Links](https://example.com)
- Bullet points
1. Numbered lists

Share your knowledge, insights, and stories!"
                              value={content.value}
                              onChange={(e) => updateContentBlock('content', content.id, e.target.value)}
                              className="min-h-[200px] border-2 focus:border-coral-500 font-mono text-sm leading-relaxed"
                            />
                            <p className="text-xs text-muted-foreground mt-2">
                              {content.value.length} characters | Supports Markdown formatting
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mini Preview Section */}
                  {(formData.titles.length > 0 || formData.excerpts.length > 0 || formData.contents.length > 0) && (
                    <div className="border-2 border-dashed border-coral-500/50 rounded-lg p-6 bg-gradient-to-br from-coral-50/50 to-navy-50/50">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-coral-600">Quick Preview</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewMode(true)}
                          className="text-coral-600 hover:text-coral-700 hover:bg-coral-50"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Full Preview
                        </Button>
                      </div>
                      <div className="prose prose-lg max-w-none space-y-4">
                        {formData.titles.length > 0 && (
                          <h4 className="text-xl font-bold text-navy-900">
                            {formData.titles[0].value || "Untitled"}
                          </h4>
                        )}
                        {formData.excerpts.length > 0 && (
                          <p className="text-muted-foreground italic">
                            {formData.excerpts[0].value || "No excerpt provided..."}
                          </p>
                        )}
                        {formData.contents.length > 0 && (
                          <div className="text-sm text-muted-foreground border-l-2 border-muted-foreground/20 pl-4">
                            {formData.contents[0].value.substring(0, 150) || "No content provided..."}
                            {formData.contents[0].value.length > 150 && "..."}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          {formData.titles.length} title(s), {formData.excerpts.length} excerpt(s), {formData.contents.length} content block(s)
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-8" />

                {/* Media & Categorization */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Featured Image */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Featured Image</Label>
                    <div 
                      className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-coral-500 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      {typeof formData.featuredImage === "string" && formData.featuredImage ? (
                        <div className="space-y-2">
                          {formData.featuredImage.startsWith(IMAGEKIT_URL_ENDPOINT) ? (
                            <Image
                              urlEndpoint={IMAGEKIT_URL_ENDPOINT}
                              src={formData.featuredImage.replace(IMAGEKIT_URL_ENDPOINT, "")}
                              width={300}
                              height={200}
                              alt="Featured"
                              className="mx-auto rounded-lg"
                            />
                          ) : (
                            <img
                              src={formData.featuredImage}
                              width={300}
                              height={200}
                              alt="Featured"
                              className="mx-auto rounded-lg"
                            />
                          )}
                          <p className="text-sm font-medium">
                            {formData.featuredImage.split("/").pop()}
                          </p>
                          {uploadProgress !== null && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                              <div className="bg-coral-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category & Tags */}
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="category" className="text-lg font-semibold">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                        <SelectTrigger className="mt-2 border-2 focus:border-coral-500">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-lg font-semibold">Tags</Label>
                      <div className="mt-2 space-y-3">
                        <div className="flex space-x-2">
                          <div className="relative flex-1">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Add a tag"
                              value={currentTag}
                              onChange={(e) => setCurrentTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              className="pl-10 border-2 focus:border-coral-500"
                            />
                          </div>
                          <Button 
                            type="button" 
                            onClick={addTag}
                            className="bg-coral-500 hover:bg-coral-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="bg-coral-100 text-coral-700 border-coral-200">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="ml-2 hover:text-coral-900"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* SEO & Settings */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-navy-500" />
                    SEO & Publishing Settings
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="seoTitle">SEO Title</Label>
                      <Input
                        id="seoTitle"
                        placeholder="Optimized title for search engines"
                        value={formData.seoTitle}
                        onChange={(e) => handleChange("seoTitle", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="datetime-local"
                        value={formData.publishDate}
                        onChange={(e) => handleChange("publishDate", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="seoDescription">SEO Description</Label>
                    <Textarea
                      id="seoDescription"
                      placeholder="Meta description for search engines (155 characters recommended)"
                      value={formData.seoDescription}
                      onChange={(e) => handleChange("seoDescription", e.target.value)}
                      className="mt-2 min-h-[80px]"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allowComments"
                        checked={formData.allowComments}
                        onCheckedChange={(checked) => handleChange("allowComments", checked)}
                      />
                      <Label htmlFor="allowComments">Allow Comments</Label>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Language Selection */}
                <div>
                  <Label htmlFor="language" className="text-lg font-semibold">Language *</Label>
                  <Select value={formData.language} onValueChange={(value) => handleChange("language", value)}>
                    <SelectTrigger className="mt-2 border-2 focus:border-coral-500">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Arabic">Arabic</SelectItem>
                      <SelectItem value="Urdu">Urdu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={(e) => handleSubmit(e, 'save')}
                    disabled={isLoading}
                    className="border-navy-500 text-navy-600 hover:bg-navy-50"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-navy-600/30 border-t-navy-600 rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save as Draft
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={(e) => handleSubmit(e, 'publish')}
                    disabled={isLoading}
                    className="bg-coral-500 hover:bg-coral-600 text-white"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Publish Article
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}