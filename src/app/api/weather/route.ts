import { NextResponse, type NextRequest } from "next/server";
import { bumpRegion } from "@/lib/redis";

/** クライアントとサーバーで照合する認証ヘッダー名 */
const API_SECRET_HEADER = "X-API-Secret-Token";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const areaCode = searchParams.get("code");

  // クライアントからのカスタム認証ヘッダーを取得
  const clientToken = request.headers.get(API_SECRET_HEADER);
  // サーバー側の環境変数を取得
  const serverToken = process.env.API_SECRET_TOKEN;

  // 1. 環境変数が未設定、またはクライアントからのトークンと一致しない場合は 401
  //    （ハンズオン: 環境変数未設定時のエラー挙動を体験させる重要な仕様）
  if (!serverToken || clientToken !== serverToken) {
    return NextResponse.json(
      { error: "Unauthorized: APIシークレットが未設定、または不一致です。" },
      { status: 401 }
    );
  }

  // 2. エリアコードの簡易バリデーション（6桁の数字かチェック）
  if (!areaCode || !/^\d{6}$/.test(areaCode)) {
    return NextResponse.json({ error: "Bad Request: 不正なエリアコードです。" }, { status: 400 });
  }

  // 認証済みの有効なリクエストとして、地方のアクセス数を集計（Redis 未設定なら no-op）
  await bumpRegion(areaCode);

  try {
    // 3. 気象庁APIへリクエストをプロキシ
    const jmaUrl = `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`;
    const response = await fetch(jmaUrl, {
      next: { revalidate: 300 }, // 5分間キャッシュ
    });

    if (!response.ok) {
      throw new Error("JMA APIへのフェッチに失敗しました。");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
