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

  const options: Intl.DateTimeFormatOptions = {
    month: "2-digit", // 두 자리 월
    day: "2-digit", // 두 자리 일
    hour: "2-digit", // 두 자리 시간
    minute: "2-digit", // 두 자리 분
    hour12: false, // 24시간제
    timeZone: "Asia/Seoul", // 한국 시간대
  };

  if (file instanceof Blob) {
    const buffer = await file.arrayBuffer();

    try {
      const webpBuffer = await sharp(Buffer.from(buffer))
      .webp({quality: 80})
      .toBuffer();

      const filename =
      generateUUID() +
      "-" +
      new Intl.DateTimeFormat("ko-KR", options)
        .format(new Date())
        .replace(". ", "")
        .replace(". ", "")
        .replace(":", "") +
      ".webp";

      const upload = bucket.file(filename);

      await upload.save(webpBuffer, {
        contentType: "image/webp",
        metadata: {
          cacheControl: "public, max-age=31536000",
        },
      });
      
      const image_url = `${process.env.NEXT_PUBLIC_CDN_URL}/${filename}`;
      return NextResponse.json({ success: true, image_url: image_url });
    } catch (e) {
      return NextResponse.json({ success: false, error: e });
    }
  }
  return NextResponse.json({ success: false });
}
