// 전체 이미지 마이그레이션을 위한 코드
// 현재 적용되어있는 마이그레이션 내용은 255*510으로 이미지 리사이징 버전 생성(_resized)
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

const TARGET_WIDTH = 255;
const TARGET_HEIGHT = 510;

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
    const originalFiles = allFiles.filter(file => 
      /\.webp$/i.test(file.name) && !file.name.includes("_resized")
    );
    
    const targetFiles = originalFiles.slice(start, start + limit);
    
    const results = {
      processed: 0,
      created: 0,
      skipped: 0,
      errors: [] as string[],
      nextStart: (start + limit < originalFiles.length) ? (start + limit) : null,
      totalOriginalFiles: originalFiles.length
    };

    for (const file of targetFiles) {
      results.processed++;

      // 새로 만들 파일명 정의 (예: image.webp -> image_resized.webp)
      const newFileName = file.name.replace(".webp", "_resized.webp");

      try {
        // 이미 해당 리사이즈 파일이 존재하는지 체크 (선택 사항, 중복 실행 방지)
        const newFile = bucket.file(newFileName);
        const [exists] = await newFile.exists();
        if (exists) {
          results.skipped++;
          continue;
        }

        const [content] = await file.download();

        // 리사이징 수행 
        const resizedBuffer = await sharp(content)
          .resize(TARGET_WIDTH, TARGET_HEIGHT, {
            fit: "fill", 
          })
          .webp({ quality: 90 }) 
          .toBuffer();

        // 새로운 이름으로 저장
        await newFile.save(resizedBuffer, {
          contentType: "image/webp",
          resumable: false,
          metadata: {
            cacheControl: "public, max-age=31536000",
          }
        });

        results.created++;
      } catch (err: any) {
        results.errors.push(`${file.name}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
      message: `${start}부터 ${start + results.processed}까지 처리 완료 (대상: ${originalFiles.length})`
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}