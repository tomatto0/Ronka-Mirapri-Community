import { generateUUID } from "@/app/utils/uuid";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
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

  const filename =
    generateUUID() +
    "-" +
    new Intl.DateTimeFormat("ko-KR", options)
      .format(new Date())
      .replace(". ", "")
      .replace(". ", "")
      .replace(":", "") +
    ".png";

  if (file instanceof Blob) {
    const filepath = path.join(process.cwd(), "/public/uploads", filename);
    const buffer = await file.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return NextResponse.json({
      success: true,
      image_url: "/uploads/" + filename,
    });
  }
  return NextResponse.json({ success: false });
}
