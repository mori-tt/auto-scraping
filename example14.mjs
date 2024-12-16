// スクレイピングしたデータをGoogle spreadsheetへ記載

import { GoogleSpreadsheet } from "google-spreadsheet";
import env from "dotenv";
env.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const secrets = require("./google_secrets.json");
import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  const cardLocators = page.locator(".cards.list-group-item .name");

  const cardCount = await cardLocators.count();

  const fetchedCards = [];
  for (let i = 0; i < cardCount; i++) {
    const cardLocator = cardLocators.locator(`nth=${i}`);

    await cardLocator.click();

    const companyLocator = await page.locator(".card-title.company");
    const companyText = await companyLocator.textContent();

    const nameLocator = await page.locator(".card-text.name");
    const nameText = await nameLocator.textContent();
    fetchedCards.push({ company: companyText, name: nameText });

    const backLocator = page.locator("text=戻る");
    await backLocator.click();
  }

  //   Google spreadsheetの操作
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: secrets.client_email,
    private_key: secrets.private_key,
  });

  await doc.loadInfo();

  let peopleSheet;
  try {
    // 既存のシートを取得
    peopleSheet = doc.sheetsByTitle["peoples"];
    // シートが存在する場合はクリア
    await peopleSheet.clear();
    // ヘッダーを設定
    await peopleSheet.setHeaderRow(["name", "company"]);
  } catch (error) {
    // シートが存在しない場合は新規作成
    peopleSheet = await doc.addSheet({
      title: "peoples",
      headerValues: ["name", "company"],
    });
  }

  // 代わりに直接fetchedCardsをスプレッドシートに書き込む
  await peopleSheet.addRows(fetchedCards);

  await browser.close();
})();
