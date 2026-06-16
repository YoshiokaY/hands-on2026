// Global type definitions

/**
 * 気象庁 防災情報XML 天気予報API のレスポンス型（必要な範囲のみ抜粋）
 * @see https://www.jma.go.jp/bosai/forecast/data/forecast/{areaCode}.json
 */
export interface JmaForecastArea {
  area: { name: string; code: string };
  weatherCodes?: string[];
  weathers?: string[];
  winds?: string[];
  waves?: string[];
}

export interface JmaTimeSeries {
  timeDefines: string[];
  areas: JmaForecastArea[];
}

export interface JmaForecast {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: JmaTimeSeries[];
}

/** 天気予報APIのレスポンス本体（短期予報・週間予報の2要素配列） */
export type JmaForecastResponse = JmaForecast[];
