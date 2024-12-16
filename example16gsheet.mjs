// スクレイピングしたデータをGoogle spreadsheetへ記載。スクレイピングはコンポーネント化

import { GoogleSpreadsheet } from "google-spreadsheet";
import env from "dotenv";
env.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const secrets = require("./google_secrets.json");
import { getEmployeesByScraping } from "./example16scraping.mjs";

async function addPeopleToGS() {
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

  const peoples = await getEmployeesByScraping();

  // 代わりに直接fetchedCardsをスプレッドシートに書き込む
  await peopleSheet.addRows(peoples);
}

export { addPeopleToGS };
