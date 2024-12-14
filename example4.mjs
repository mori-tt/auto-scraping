// ファイルへの書き込み処理 一番最初に表示されている10件を書き込む
import { chromium } from "@playwright/test";
import * as fs from "fs";
import { Parser } from "json2csv";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  const cardLocators = page.locator(".cards.list-group-item .name");
  // const cardText = await cardLocators.allTextContents();

  // const first10Cards = cardText.slice(0, 10);

  // await browser.close();

  // fs.writeFileSync("./test-data.csv", first10Cards.join(","));

  const cardCount = await cardLocators.count();

  const fetchedCards = [];
  for (let i = 0; i < cardCount; i++) {
    const cardLocator = cardLocators.locator(`nth=${i}`);
    const cardText = await cardLocator.textContent();
    fetchedCards.push({ name: cardText });
  }

  const parser = new Parser();
  // const parser = new Parser({ header: false });
  const csv = parser.parse(fetchedCards);
  fs.writeFileSync("./text-data.csv", csv);

  await browser.close();
})();
