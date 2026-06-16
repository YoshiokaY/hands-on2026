"use client";

interface JapanMapProps {
  onSelectRegion: (code: string, name: string) => void;
}

/**
 * 簡易マップを構成する9つの地方区分（ハンズオン用ピックアップ）。
 * code は各地方の代表都道府県の気象庁エリアコード、
 * path / lx / ly はSVGマップ（viewBox 0 0 400 560）上の図形と
 * ラベル中心座標を表す。
 */
const REGIONS = [
  {
    code: "016000",
    label: "北海道",
    name: "北海道（札幌）",
    path: "M306 44 L356 40 L380 78 L364 116 L320 120 L300 92 L300 64 Z",
    lx: 336,
    ly: 86,
  },
  {
    code: "040000",
    label: "東北",
    name: "東北（宮城県）",
    path: "M300 132 L340 138 L342 196 L320 224 L292 214 L286 168 Z",
    lx: 314,
    ly: 182,
  },
  {
    code: "130000",
    label: "関東",
    name: "関東（東京都）",
    path: "M300 230 L334 232 L336 272 L308 288 L284 274 L286 244 Z",
    lx: 310,
    ly: 262,
  },
  {
    code: "230000",
    label: "中部",
    name: "中部（愛知県）",
    path: "M236 232 L292 236 L286 288 L246 300 L214 280 L218 248 Z",
    lx: 250,
    ly: 270,
  },
  {
    code: "270000",
    label: "近畿",
    name: "近畿（大阪府）",
    path: "M186 272 L228 276 L224 314 L190 324 L166 304 L168 282 Z",
    lx: 196,
    ly: 300,
  },
  {
    code: "340000",
    label: "中国",
    name: "中国（広島県）",
    path: "M112 286 L172 290 L170 322 L130 332 L104 316 L104 296 Z",
    lx: 138,
    ly: 310,
  },
  {
    code: "380000",
    label: "四国",
    name: "四国（愛媛県）",
    path: "M156 336 L200 338 L202 366 L170 376 L146 360 Z",
    lx: 176,
    ly: 358,
  },
  {
    code: "400000",
    label: "九州",
    name: "九州（福岡県）",
    path: "M92 320 L136 324 L140 372 L114 402 L82 384 L78 344 Z",
    lx: 108,
    ly: 362,
  },
  {
    code: "471000",
    label: "沖縄",
    name: "沖縄県（那覇）",
    path: "M40 474 L78 470 L82 500 L52 520 L30 502 Z",
    lx: 54,
    ly: 498,
  },
] as const;

export function JapanMap({ onSelectRegion }: JapanMapProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-muted-foreground text-sm">
        地図上の地方を選択してください
      </p>

      <div className="mx-auto w-full max-w-md">
        <svg
          viewBox="0 0 400 560"
          className="h-auto w-full"
          role="group"
          aria-label="日本地図（地方区分）"
        >
          {/* 九州から沖縄への距離を示す破線 */}
          <path
            d="M104 400 L66 470"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="2"
            strokeDasharray="5 6"
          />

          {REGIONS.map((region) => {
            const handleSelect = () => onSelectRegion(region.code, region.name);
            return (
              <g
                key={region.code}
                role="button"
                tabIndex={0}
                aria-label={`${region.name}の気象予報を表示`}
                onClick={handleSelect}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelect();
                  }
                }}
                className="group cursor-pointer outline-none"
              >
                <path
                  d={region.path}
                  className="fill-slate-200 stroke-white transition-colors group-hover:fill-primary group-focus-visible:fill-primary group-focus-visible:stroke-slate-900"
                  strokeWidth={2}
                />
                <text
                  x={region.lx}
                  y={region.ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="pointer-events-none fill-slate-600 text-[13px] font-medium group-hover:fill-white group-focus-visible:fill-white"
                >
                  {region.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
