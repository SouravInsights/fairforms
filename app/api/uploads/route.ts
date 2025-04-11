import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { parseFormData } from "@/lib/parse-form";

// Initialize S3 client with R2 credentials
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { files } = await parseFormData(req);

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files received" }, { status: 400 });
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        // Generate a unique file name to prevent collisions
        const fileName = `${uuidv4()}-${file.name}`;

        const buffer = Buffer.from(await file.arrayBuffer());
        const command = new PutObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        });

        const result = await s3.send(command);

        const fileUrl = `${process.env.R2_PUBLIC_URL}/${process.env.R2_BUCKET_NAME}/${fileName}`;

        return {
          fileName,
          originalName: file.name,
          fileUrl,
          size: file.size,
          type: file.type,
          etag: result.ETag,
        };
      })
    );

    return NextResponse.json({
      success: true,
      files: uploadResults,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
