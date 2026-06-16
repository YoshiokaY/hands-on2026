interface JapanMapProps {
  onSelectRegion: (code: string, name: string) => void;
}

/**
 * 簡易マップを構成する9つの地方区分
 * skewX(-12) による横ズレ（変形による飛び出し）を数学的に逆算し、
 * 傾けた状態でもパーツ同士が重ならず、12pxの隙間が均一に空くように再設計しました。
 */
const REGIONS = [
  { code: "016000", label: "北海道", name: "北海道（札幌）", cx: 775, cy: 106, w: 240, h: 160, color: "#0284c7" },
  { code: "040000", label: "東北", name: "東北（宮城県）", cx: 736, cy: 288, w: 200, h: 180, color: "#0d9488" },
  { code: "130000", label: "関東", name: "関東（東京都）", cx: 817, cy: 450, w: 140, h: 120, color: "#4f46e5" },
  { code: "230000", label: "中部", name: "中部（愛知県）", cx: 665, cy: 450, w: 140, h: 120, color: "#059669" },
  { code: "270000", label: "近畿", name: "近畿（大阪府）", cx: 523, cy: 450, w: 120, h: 120, color: "#d97706" },
  { code: "340000", label: "中国", name: "中国（広島県）", cx: 381, cy: 450, w: 140, h: 120, color: "#db2777" },
  { code: "380000", label: "四国", name: "四国（愛媛県）", cx: 497, cy: 572, w: 120, h: 100, color: "#7c3aed" },
  { code: "400000", label: "九州", name: "九州（福岡県）", cx: 347, cy: 612, w: 140, h: 180, color: "#dc2626" },
  { code: "471000", label: "沖縄", name: "沖縄県（那覇）", cx: 185, cy: 754, w: 100, h: 80, color: "#0891b2" },
] as const;

export function JapanMap({ onSelectRegion }: JapanMapProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-muted-foreground text-sm">
        エリアを選択してください
      </p>

      <div className="mx-auto w-full max-w-xl">
        <svg
          viewBox="0 0 1000 820"
          className="h-auto w-full"
          role="group"
          aria-label="日本地図（地方区分）"
        >
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
                {/* 角丸矩形を skewX で傾けて「平行四辺形パーツ」にする */}
                <g transform={`translate(${region.cx} ${region.cy}) skewX(-12)`}>
                  <rect
                    x={-region.w / 2}
                    y={-region.h / 2}
                    width={region.w}
                    height={region.h}
                    rx={20}
                    fill={region.color}
                    strokeWidth={4}
                    className="stroke-white transition-opacity group-hover:opacity-80 group-focus-visible:stroke-slate-900"
                  />
                </g>
                <text
                  x={region.cx}
                  y={region.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={26}
                  className="pointer-events-none fill-white font-medium"
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
