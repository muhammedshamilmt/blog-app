import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
  const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(uploadPath, buffer)
  const url = `/uploads/${filename}`
  return NextResponse.json({ success: true, url })
} 