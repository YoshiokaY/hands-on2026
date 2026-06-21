import { NextResponse } from "next/server";
import { getRanking } from "@/lib/redis";
import { REGION_LABELS } from "@/lib/regions";

/** 地方のアクセスランキングを返す（Redis 未設定時は空配列） */
export async function GET() {
  const ranking = await getRanking(5);
  const withLabels = ranking.map((entry) => ({
    ...entry,
    label: REGION_LABELS[entry.code] ?? entry.code,
  }));
  return NextResponse.json(withLabels);
}
