"use client";

import { useEffect, useState } from "react";

interface RankingRow {
  code: string;
  label: string;
  count: number;
}

/**
 * 地方のアクセスランキング（Vercel KV / Upstash Redis 集計）。
 * refreshSignal が変わるたびに再取得する（地方クリック後に最新化）。
 * データが無い（Redis 未設定など）場合は何も表示しない。
 */
export function RegionRanking({ refreshSignal }: { refreshSignal: number }) {
  const [rows, setRows] = useState<RankingRow[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/ranking")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: RankingRow[]) => {
        if (active) setRows(data);
      })
      .catch(() => {
        // ランキング取得失敗は無視（本体機能に影響させない）
      });
    return () => {
      active = false;
    };
  }, [refreshSignal]);

  if (rows.length === 0) return null;

  return (
    <section className="mx-auto mt-8 max-w-md rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-center text-sm font-semibold text-slate-700">アクセスランキング</h2>
      <ol className="space-y-1">
        {rows.map((row, i) => (
          <li
            key={row.code}
            className="flex items-center justify-between rounded px-2 py-1 text-sm odd:bg-slate-50"
          >
            <span className="text-slate-700">
              <span className="text-primary mr-2 font-bold">{i + 1}</span>
              {row.label}
            </span>
            <span className="text-muted-foreground tabular-nums">{row.count} 回</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
