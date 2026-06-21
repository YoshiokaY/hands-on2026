import { get } from "@vercel/edge-config";

interface Announcement {
  message: string;
  enabled?: boolean;
}

/**
 * Vercel Edge Config の `announcement` キーを読み、お知らせバナーを表示する。
 * Edge Config 上で値を変えると、再デプロイなしで即時反映される（学習ポイント）。
 * 未設定 / 取得失敗 / enabled:false の場合は何も表示しない。
 */
export async function AnnouncementBanner() {
  let value: Announcement | string | undefined;
  try {
    value = await get<Announcement | string>("announcement");
  } catch {
    // Edge Config 未連携の環境（ローカル / CI など）では何も出さない
    return null;
  }

  if (!value) return null;

  const message =
    typeof value === "string" ? value : value.enabled === false ? null : value.message;

  if (!message) return null;

  return (
    <div
      role="status"
      className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900"
    >
      {message}
    </div>
  );
}
