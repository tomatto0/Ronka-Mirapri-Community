// 이미지 마이그레이션 테스트용 코드
// 특정 이미지를 resizedBuffer 내부의 설정대로 마이그레이션한 뒤에 _resized.webp로 저장합니다.

import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { NextResponse } from "next/server";

export async function GET() {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "base64").toString("utf8")
  );
  const storage = new Storage({ credentials });
  const bucket = storage.bucket("ronka_closet_community");
  const targetFileName = "6da067df-66c2-4dbe-92a1-844fd79a034d-09171610.webp";

  try {
    const file = bucket.file(targetFileName);
    const [content] = await file.download();
    
    const resizedBuffer = await sharp(content)
      .resize(350, 700, {
        fit: 'cover',  
        position: 'center' 
      })
      .webp({ quality: 90 }) 
      .toBuffer();

    const testFileName = targetFileName.replace(".webp", "_resized.webp");
    await bucket.file(testFileName).save(resizedBuffer, {
      contentType: "image/webp",
    });

    // 메타데이터 확인용
    const metadata = await sharp(resizedBuffer).metadata();

    return NextResponse.json({ 
      success: true, 
      message: "리사이징 성공!",
      originalSize: `${(content.length / 1024).toFixed(2)} KB`,
      newSize: `${(resizedBuffer.length / 1024).toFixed(2)} KB`,
      dimensions: `${metadata.width} x ${metadata.height}` // 결과가 350x700인지 확인
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}