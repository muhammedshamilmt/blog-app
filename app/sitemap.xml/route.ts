import { NextResponse } from 'next/server'

export async function GET() {
  // Define your static routes
  const staticRoutes = [
    '', // home
    'about',
    'articles',
    'categories',
    'contact',
    'newsletter',
    'writers',
    'write',
    'upload',
    'profile',
  ]

  // Optionally, fetch dynamic blog/article slugs from your DB here
  // For now, just an example array
  // const blogSlugs = await fetchBlogSlugsFromDB();
  const blogSlugs: string[] = []

  // Build the XML
  const baseUrl = 'https://your-domain.com/' // <-- CHANGE THIS to your real domain
  let urls = staticRoutes.map(
    (route) => `<url><loc>${baseUrl}${route ? route + '/' : ''}</loc></url>`
  )
  urls = urls.concat(
    blogSlugs.map(
      (slug) => `<url><loc>${baseUrl}articles/${slug}/</loc></url>`
    )
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  })
} 