"use client";

import { useState } from "react";
import { JapanMap } from "@/components/japan-map";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { JmaForecastResponse } from "@/types";
import { getWeatherIcon } from "@/lib/weather";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            "認証エラー（401 Unauthorized）が発生しました。Vercelの環境変数に『API_SECRET_TOKEN』が正しく設定されているか確認し、再デプロイしてください。"
          );
        }
        throw new Error(`エラーが発生しました (Status: ${response.status})`);
      }

      const data: JmaForecastResponse = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "データの取得に失敗しました。");
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
      <SpeedInsights />
      {/* 編集体験用: ここのテキストや色を参加者に書き換えてもらう */}
      <header className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
          気象予報アプリ
        </h1>
      </header>

      <JapanMap onSelectRegion={handleSelectRegion} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-120">
          <DialogHeader>
            <DialogTitle>{selectedName} の気象予報</DialogTitle>
          </DialogHeader>

          <div className="py-2">
            {loading && (
              <p className="animate-pulse text-center text-slate-500">気象データを読み込み中...</p>
            )}

            {error && (
              <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-4 text-sm whitespace-pre-wrap">
                {error}
              </div>
            )}

            {!loading && !error && forecast && area && (
              <div className="space-y-4 text-sm text-slate-700">
                <ul className="space-y-2">
                  {timeSeries?.timeDefines.slice(0, 3).map((date, i) => {
                    const { Icon, colorClass, label } = getWeatherIcon(
                      Number(area.weatherCodes?.[i])
                    );
                    return (
                      <li
                        key={date}
                        className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3"
                      >
                        <Icon className={`size-9 shrink-0 ${colorClass}`} aria-label={label} />
                        <div className="min-w-0">
                          <p className="text-primary font-bold">
                            {new Date(date).toLocaleDateString("ja-JP", {
                              month: "long",
                              day: "numeric",
                              weekday: "short",
                            })}
                          </p>
                          <p className="whitespace-pre-wrap">
                            {area.weathers?.[i] ?? "データがありません"}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
