"use client";

import { useState } from "react";
import { JapanMap } from "@/components/japan-map";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { JmaForecastResponse } from "@/types";

/** ハンズオン用の固定トークン（Route Handler 側の API_SECRET_TOKEN と一致させる） */
const API_SECRET_TOKEN = "HANDSON_SECRET_TOKEN_2026";

export default function Home() {
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<JmaForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelectRegion = async (code: string, name: string) => {
    setSelectedName(name);
    setIsOpen(true);
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(`/api/weather?code=${code}`, {
        headers: {
          "X-API-Secret-Token": API_SECRET_TOKEN,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "認証エラー（401 Unauthorized）が発生しました。Vercelの環境変数に『API_SECRET_TOKEN』が正しく設定されているか確認し、再デプロイしてください。",
          );
        }
        throw new Error(`エラーが発生しました (Status: ${response.status})`);
      }

      const data: JmaForecastResponse = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "データの取得に失敗しました。",
      );
    } finally {
      setLoading(false);
    }
  };

  // 短期予報（先頭要素）の最初のエリアから、日付ごとの天気概況を取り出す
  const forecast = weatherData?.[0];
  const timeSeries = forecast?.timeSeries?.[0];
  const area = timeSeries?.areas?.[0];

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      {/* 編集体験用: ここのテキストや色を参加者に書き換えてもらう */}
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
          簡易日本地図・気象予報アプリ
        </h1>
        <p className="text-muted-foreground">
          Next.js + shadcn/ui + Vercel デプロイ・CI/CD ハンズオン教材
        </p>
      </header>

      <JapanMap onSelectRegion={handleSelectRegion} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>{selectedName} の気象予報</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            {loading && (
              <p className="animate-pulse text-center text-slate-500">
                気象データを読み込み中...
              </p>
            )}

            {error && (
              <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}

            {!loading && !error && forecast && area && (
              <div className="space-y-4 text-sm text-slate-700">
                <p className="rounded bg-slate-100 p-2 text-center font-semibold">
                  報告日時:{" "}
                  {new Date(forecast.reportDatetime).toLocaleString("ja-JP")}
                </p>

                <dl className="space-y-2">
                  {timeSeries?.timeDefines.slice(0, 3).map((date, i) => (
                    <div
                      key={date}
                      className="rounded-lg border bg-slate-50 p-3"
                    >
                      <dt className="text-primary mb-1 font-bold">
                        {new Date(date).toLocaleDateString("ja-JP", {
                          month: "long",
                          day: "numeric",
                          weekday: "short",
                        })}
                      </dt>
                      <dd className="whitespace-pre-wrap">
                        {area.weathers?.[i] ?? "データがありません"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
