// ファイルへの書き込み処理 3ページ目の役職が係長の人物名と会社名を全て、test-data.csvに出力
// 会社名や役職名が取れない場合も処理が止まらないように例外処理をする

import { chromium } from "@playwright/test";
import * as fs from "fs";
import { Parser } from "json2csv";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });

  try {
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");

    const cardLocators = page.locator(".cards.list-group-item .name");

    const pageLink3 = await page.locator(".page-link.page-number >> nth=2");
    await pageLink3.click();

    const cardCount = await cardLocators.count();

    const fetchedCards = [];
    for (let i = 0; i < cardCount; i++) {
      try {
        const cardLocator = cardLocators.locator(`nth=${i}`);
        await cardLocator.click();

        // 役職の取得を試みる
        let isDivisionChief = false;
        try {
          const divisionLocator = await page.locator(".division");
          const divisionText = (await divisionLocator.textContent()) || "";
          isDivisionChief = divisionText.includes("係長");
        } catch (error) {
          console.error(`役職の取得に失敗: ${error.message}`);
        }

        if (isDivisionChief) {
          let cardData = {};

          // 名前の取得を試みる
          try {
            const nameLocator = await page.locator(".card-text.name");
            cardData.name = (await nameLocator.textContent()) || "";
          } catch (error) {
            console.error(`名前の取得に失敗: ${error.message}`);
            cardData.name = "";
          }

          // 会社名の取得を試みる
          try {
            const companyLocator = await page.locator(".card-title.company");
            cardData.company = (await companyLocator.textContent()) || "";
          } catch (error) {
            console.error(`会社名の取得に失敗: ${error.message}`);
            cardData.company = "";
          }

          fetchedCards.push(cardData);
        }

        const backLocator = page.locator("text=戻る");
        await backLocator.click();
      } catch (error) {
        console.error(
          `カード ${i + 1} の処理中にエラーが発生しました: ${error.message}`
        );
        continue;
      }
    }

    const parser = new Parser();
    const csv = parser.parse(fetchedCards);
    fs.writeFileSync("./text-data.csv", csv);
  } catch (error) {
    console.error(`スクレイピング処理でエラーが発生しました: ${error.message}`);
  } finally {
    await browser.close();
  }
})();
