import {
  Cloud,
  CloudRain,
  Snowflake,
  Sun,
  type LucideIcon,
} from "lucide-react";

/**
 * 気象庁の天気コード（3桁）を晴れ／曇り／雨／雪の4分類アイコンに対応づける。
 * コードの百の位（1=晴れ, 2=曇り, 3=雨, 4=雪）で大別し、
 * 各帯のうち雪に変わる例外コードのみ個別に雪へ振り分ける。
 * @see https://www.jma.go.jp/bosai/forecast/
 */
const SNOW_CODES = new Set([160, 170, 181, 260, 270, 281, 340, 361, 371]);

export interface WeatherIcon {
  Icon: LucideIcon;
  /** アイコンの色（Tailwind クラス） */
  colorClass: string;
  /** スクリーンリーダー向けの分類ラベル */
  label: string;
}

export function getWeatherIcon(code: number): WeatherIcon {
  if (SNOW_CODES.has(code) || (code >= 400 && code < 500)) {
    return { Icon: Snowflake, colorClass: "text-sky-400", label: "雪" };
  }
  if (code >= 300) {
    return { Icon: CloudRain, colorClass: "text-blue-500", label: "雨" };
  }
  if (code >= 200) {
    return { Icon: Cloud, colorClass: "text-slate-400", label: "くもり" };
  }
  return { Icon: Sun, colorClass: "text-amber-500", label: "晴れ" };
}
