/**
 * 問題：
 * 以下の値をシートを完成させてください。
 * name   | price
 * Orange | 120
 * Banana | 50
 * Apple  | 100
 * 合計    | 270
 */

import { GoogleSpreadsheet } from "google-spreadsheet";
import env from "dotenv";
env.config();
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const secrets = require("./google_secrets.json");

(async () => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

  await doc.useServiceAccountAuth({
    client_email: secrets.client_email,
    private_key: secrets.private_key,
  });

  await doc.loadInfo();

  let fruitSheet;
  try {
    // 既存のシートを取得
    fruitSheet = doc.sheetsByTitle["fruits"];
    // シートが存在する場合はクリア
    await fruitSheet.clear();
    // ヘッダーを設定
    await fruitSheet.setHeaderRow(["name", "price"]);
  } catch (error) {
    // シートが存在しない場合は新規作成
    fruitSheet = await doc.addSheet({
      title: "fruits",
      headerValues: ["name", "price"],
    });
  }

  const row = await fruitSheet.addRows([
    {
      name: "Orange",
      price: "250",
    },
    {
      name: "Banana",
      price: "150",
    },
    {
      name: "Apple",
      price: "300",
    },
    {
      name: "合計",
      price: "=sum(B2:B4)",
    },
  ]);
})();
