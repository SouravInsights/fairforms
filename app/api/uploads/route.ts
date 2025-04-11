import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";

// R2 configuration
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize R2 client
const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
  },
});

// Bucket name from environment variable
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "";
const PUBLIC_URL_PREFIX = process.env.CLOUDFLARE_R2_PUBLIC_URL || "";

export async function POST(request: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Generate a unique filename with original extension
    const fileExtension = file.name.split(".").pop() || "";
    const uniqueFileName = `${userId}/${nanoid()}.${fileExtension}`;

    // Upload to R2
    const buffer = await file.arrayBuffer();
    await R2.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: uniqueFileName,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    );

    // Return the file URL
    const fileUrl = `${PUBLIC_URL_PREFIX}/${uniqueFileName}`;
    console.log("fileUrl:", fileUrl);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });
  } catch (error) {
    console.error("[FILE_UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
