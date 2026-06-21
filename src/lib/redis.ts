import { Redis } from "@upstash/redis";

/**
 * Upstash Redis（Vercel Marketplace 連携）クライアント。
 * 環境変数が未設定の場合は null を返し、呼び出し側でスキップできるようにする。
 * （ローカル / CI / 未連携の Preview でもアプリが壊れないため）
 */
let client: Redis | null = null;

function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token });
  return client;
}

/** 地方ランキング用 Sorted Set のキー */
const RANKING_KEY = "region_ranking";

/** 地方のクリック数を +1（未設定時は何もしない） */
export async function bumpRegion(code: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.zincrby(RANKING_KEY, 1, code);
  } catch {
    // 計測の失敗はアプリ本体に影響させない
  }
}

export interface RankingEntry {
  code: string;
  count: number;
}

/** クリック数の多い順に上位を取得（未設定時は空配列） */
export async function getRanking(limit = 5): Promise<RankingEntry[]> {
  const redis = getRedis();
  if (!redis) return [];
  try {
    // [member, score, member, score, ...] の並びで返る
    const flat = await redis.zrange<(string | number)[]>(RANKING_KEY, 0, limit - 1, {
      rev: true,
      withScores: true,
    });
    const entries: RankingEntry[] = [];
    for (let i = 0; i < flat.length; i += 2) {
      entries.push({ code: String(flat[i]), count: Number(flat[i + 1]) });
    }
    return entries;
  } catch {
    return [];
  }
}
