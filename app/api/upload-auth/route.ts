import { NextResponse } from 'next/server'
import ImageKit from 'imagekit'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
  }
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json({ success: false, message: 'ImageKit environment variables not set' }, { status: 500 });
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  try {
    const uploadResponse = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: '/blogapp/profile/',
      useUniqueFileName: true,
    });
    return NextResponse.json({ success: true, url: uploadResponse.url });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to upload to ImageKit', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function GET() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  if (!publicKey || !privateKey || !urlEndpoint) {
    return NextResponse.json({ error: 'ImageKit environment variables not set' }, { status: 500 });
  }

  const imagekit = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  const authenticationParameters = imagekit.getAuthenticationParameters();
  return NextResponse.json({
    ...authenticationParameters,
    publicKey,
    urlEndpoint,
  });
} 