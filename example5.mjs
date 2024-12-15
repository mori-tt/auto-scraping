// ファイルへの書き込み処理 一番最初に表示されている10件の名前と会社名を書き込む
import { chromium } from "@playwright/test";
import * as fs from "fs";
import { Parser } from "json2csv";

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

  const parser = new Parser();

  const csv = parser.parse(fetchedCards);
  fs.writeFileSync("./text-data.csv", csv);

  await browser.close();
})();
