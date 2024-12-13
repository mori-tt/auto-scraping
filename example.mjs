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
  const pageTitleLocator4 = page.locator(".cards.list-group-item >> ..");
  const pageTitle4 = await pageTitleLocator4.innerHTML();
  console.log(pageTitle4);

  await browser.close();
})();
