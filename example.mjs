import { chromium } from "@playwright/test";

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });

  const page = await browser.newPage();
  await page.goto("http://localhost:3000");

  // CSSセレクターでの要素の取得
  const pageTitleLocator = page.locator(".navbar-brand");
  const pageTitle = await pageTitleLocator.innerText();
  // console.log(pageTitle);

  // 文字列で要素を取得
  const textLocator = page.locator("text=名刺管理アプリ");
  const pageText = await textLocator.innerText();
  // console.log(pageText);

  // xpathで要素を取得
  const xpathLocator = page.locator('xpath=//*[@id="__next"]/nav/div/a');
  const pageXpath = await xpathLocator.innerText();
  // console.log(pageXpath);

  //  CSSセレクターでの要素の取得の応用1
  const pageTitleLocator2 = page.locator(".cards.list-group-item > a >> nth=2");
  const pageTitle2 = await pageTitleLocator2.innerText();
  // console.log(pageTitle2);

  //  CSSセレクターでの要素の取得の応用2
  const pageTitleLocator3 = page.locator(
    ".cards.list-group-item:nth-child(3)>a"
  );
  const pageTitle3 = await pageTitleLocator3.innerHTML();
  // console.log(pageTitle3);

  //  CSSセレクターでの要素の取得の応用3 親要素を取得
  // const pageTitleLocator4 = page.locator(".cards.list-group-item >> ..");
  const pageTitleLocator4 = page.locator(".cards.list-group-item");
  const parentLocator = pageTitleLocator4.locator("..");
  const pageTitle4 = await parentLocator.innerHTML();
  // console.log(pageTitle4);

  // UIイベントをスクリプトで記述
  const inputLocator = page.locator('//*[@id="__next"]/div/div[1]/label/input');
  await page.waitForTimeout(2000);
  await inputLocator.type("美");

  const pager3Locator = page.locator(".page-link.page-number >> nth=-1");
  await pager3Locator.click();

  const cardLocator = page.locator(".cards.list-group-item");
  const cardCount = await cardLocator.count();
  console.log(cardCount);

  await browser.close();
})();
