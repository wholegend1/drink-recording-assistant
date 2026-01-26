import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gasUrl = process.env.GAS_API_URL;

  if (!gasUrl) {
    return NextResponse.json(
      { status: "error", message: "GAS_API_URL 環境變數未設定" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();

    // Debug: 印出收到的資料，確認前端有沒有傳過來
    console.log("API收到備份請求:", {
      hasCode: !!body.code,
      hasData: !!body.data,
    });

    if (!body.code || !body.data) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing parameters: 前端未傳送 code 或 data",
        },
        { status: 400 },
      );
    }

    // 轉發給 Google Apps Script
    // 注意：Google 腳本的 doPost(e) 會解析 postData.contents
    const response = await fetch(gasUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8", // 使用 text/plain 避免 CORS 預檢問題
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Backup API Error:", error);
    return NextResponse.json(
      { status: "error", message: "伺服器連線錯誤: " + String(error) },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const gasUrl = process.env.GAS_API_URL;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!gasUrl)
    return NextResponse.json(
      { status: "error", message: "GAS_API_URL 未設定" },
      { status: 500 },
    );

  if (!code) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing parameters: 請在網址帶入 ?code=金鑰",
      },
      { status: 400 },
    );
  }

  try {
    // 轉發 GET 請求
    const response = await fetch(`${gasUrl}?action=read&code=${code}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "還原失敗" },
      { status: 500 },
    );
  }
}
