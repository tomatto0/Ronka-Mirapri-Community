import { generateUUID } from "@/app/utils/uuid";
import { Storage } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp"

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "base64").toString("utf8")
);
const storage = new Storage({credentials});
const bucketname = "ronka_closet_community";
const bucket = storage.bucket(bucketname);

export async function POST(request: NextRequest) {
  const formdata = await request.formData();
  const file = formdata.get("image");

  if (!(file instanceof Blob)) return NextResponse.json({ success: false });

  const buffer = await file.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);

    try {
      const formattedDate = new Intl.DateTimeFormat("ko-KR", {
      month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
      hour12: false, timeZone: "Asia/Seoul",
    }).format(new Date()).replace(/\D/g, "");

    const baseName = `${generateUUID()}-${formattedDate}`;
    const filename = `${baseName}.webp`;
    const resizedFilename = `${baseName}_resized.webp`;

    // 1. 원본(고화질) 생성
    const originalBuffer = await sharp(nodeBuffer)
      .resize({ width: 1080 }) // 너비 1080으로 제한 (비율 유지)
      .webp({ quality: 30 })
      .toBuffer();

    // 2. 디스플레이용(255x510) 생성
    const resizedBuffer = await sharp(nodeBuffer)
      .resize(255, 510, { fit: 'fill' })
      .webp({ quality: 90 })
      .toBuffer();

    // 3. 병렬 업로드 (Promise.all로 속도 향상)
    await Promise.all([
      bucket.file(filename).save(originalBuffer, {
        contentType: "image/webp",
        metadata: { cacheControl: "public, max-age=31536000" },
      }),
      bucket.file(resizedFilename).save(resizedBuffer, {
        contentType: "image/webp",
        metadata: { cacheControl: "public, max-age=31536000" },
      })
    ]);
      
      const image_url = `${process.env.NEXT_PUBLIC_CDN_URL}/${filename}`;
      return NextResponse.json({ success: true, image_url: image_url });
    } catch (e: any) {
      console.error("Upload Error:", e);
      return NextResponse.json({ success: false, error: e.message || "Unknown Error" });
    }
  }
 
