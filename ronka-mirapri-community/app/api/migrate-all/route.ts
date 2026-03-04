// 전체 이미지 마이그레이션을 위한 코드
// 현재 적용되어있는 마이그레이션 내용은 350*700으로 이미지 리사이징
// localhost:3000의 콘솔에 이 스크립트를 실행하면 작동됩니다.

// async function startResizing() {
//   let start = 0;
//   let hasNext = true;

//   while (hasNext) {
//     console.log(`🚀 ${start}번부터 리사이징 시도 중...`);
//     const res = await fetch(`/api/migrate-all?start=${start}`);
//     const data = await res.json();

//     if (data.success) {
//       console.log(`✅ 결과: ${data.message} (리사이즈: ${data.resized}, 스킵: ${data.skipped})`);
//       if (data.nextStart) {
//         start = data.nextStart;
//       } else {
//         hasNext = false;
//         console.log("🎊 모든 이미지 리사이징 마이그레이션 완료!");
//       }
//     } else {
//       console.error("❌ 에러 발생:", data.error);
//       hasNext = false;
//     }
//   }
// }

// startResizing();

import { Storage } from "@google-cloud/storage";
import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";

const TARGET_WIDTH = 350;
const TARGET_HEIGHT = 700;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = parseInt(searchParams.get("start") || "0");
  const limit = 100;

  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS!, "base64").toString("utf8")
  );
  const storage = new Storage({ credentials });
  const bucket = storage.bucket("ronka_closet_community");

  try {
    const [allFiles] = await bucket.getFiles();
    const targetFiles = allFiles.slice(start, start + limit);
    
    const results = {
      processed: 0,
      resized: 0,
      skipped: 0,
      errors: [] as string[],
      nextStart: (start + limit < allFiles.length) ? (start + limit) : null,
      totalFiles: allFiles.length
    };

    for (const file of targetFiles) {
      results.processed++;

      // webp 파일만 대상으로 처리
      if (!/\.webp$/i.test(file.name)) {
        results.skipped++;
        continue;
      }

      try {
        const [content] = await file.download();
        const metadata = await sharp(content).metadata();

        // 이미 목표 사이즈보다 작거나 같으면 변환 건너뜀 (중복 작업 방지)
        if (metadata.width === TARGET_WIDTH && metadata.height === TARGET_HEIGHT) {
          results.skipped++;
          continue;
        }

        // 리사이징 수행
        const resizedBuffer = await sharp(content)
          .resize(TARGET_WIDTH, TARGET_HEIGHT, {
            fit: "fill", 
          })
          .webp({ quality: 90 }) 
          .toBuffer();

        await file.save(resizedBuffer, {
          contentType: "image/webp",
          resumable: false,
          metadata: {
            cacheControl: "public, max-age=31536000",
          }
        });

        results.resized++;
      } catch (err: any) {
        results.errors.push(`${file.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: `${start}부터 ${start + results.processed}까지 처리 완료 (전체: ${allFiles.length})`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}