// "佐藤"検索して、一番最後に出てくる人物の名前を取得する。[81 佐藤 雄太]

import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  const inputLocator = page.locator('//*[@id="__next"]/div/div[1]/label/input');
  await page.waitForTimeout(2000);

  await inputLocator.type("藤");

  //   検索した文字に関するページが1ページ以上の場合、最後のページまで遷移する
  const pagerLocator = page.locator(".page-link.page-number");
  if ((await pagerLocator.count()) > 1) {
    const lastpagerLocator = pagerLocator.locator("nth=-1");
    await lastpagerLocator.click();
  }

  const lastCardLocator = page.locator(".cards.list-group-item > a >> nth=-1");
  const lastCardName = await lastCardLocator.textContent();
  console.log(lastCardName);

  await browser.close();
})();
