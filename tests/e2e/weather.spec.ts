import { test, expect } from "@playwright/test";

/** 気象庁APIのモックレスポンス（/api/weather をブラウザ側で差し替えて決定的にする） */
const mockForecast = [
  {
    publishingOffice: "気象庁",
    reportDatetime: "2026-06-16T11:00:00+09:00",
    timeSeries: [
      {
        timeDefines: [
          "2026-06-16T11:00:00+09:00",
          "2026-06-17T00:00:00+09:00",
          "2026-06-18T00:00:00+09:00",
        ],
        areas: [
          {
            area: { name: "東京地方", code: "130010" },
            weatherCodes: ["100", "200", "300"],
            weathers: ["晴れ", "くもり", "雨"],
          },
        ],
      },
    ],
  },
];

const KANTO = "関東（東京都）の気象予報を表示";

test("地図と9地方が表示される", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "気象予報アプリ" })).toBeVisible();

  for (const label of ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州", "沖縄"]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
});

test("地方をクリックすると天気予報モーダルが開く", async ({ page }) => {
  await page.route("**/api/weather**", (route) => route.fulfill({ json: mockForecast }));

  await page.goto("/");
  await page.getByRole("button", { name: KANTO }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("関東（東京都） の気象予報");
  await expect(dialog).toContainText("晴れ");
  await expect(dialog).toContainText("くもり");
  await expect(dialog).toContainText("雨");
});

test("認証エラー時は401の案内メッセージを表示する", async ({ page }) => {
  await page.route("**/api/weather**", (route) =>
    route.fulfill({ status: 401, json: { error: "Unauthorized" } })
  );

  await page.goto("/");
  await page.getByRole("button", { name: KANTO }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("401");
});

test("キーボード操作でモーダルを開閉できる", async ({ page }) => {
  await page.route("**/api/weather**", (route) => route.fulfill({ json: mockForecast }));

  await page.goto("/");

  const region = page.getByRole("button", { name: KANTO });
  await region.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
});
