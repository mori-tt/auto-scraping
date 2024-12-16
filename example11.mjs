// google spreadsheetの行の追加
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

  await doc.addSheet({
    title: "persons",
    headerValues: ["name", "age", "gender"],
  });
  await doc.loadInfo();

  const personSheet = doc.sheetsByTitle["persons"];

  //   既存のシートに上書き場合
  //   // シートをクリアする（オプション）
  //   await personSheet.clear();
  //   // 新しいヘッダーを設定（必要な場合）
  //   await personSheet.setHeaderRow(["name", "age", "gender"]);
  const row = await personSheet.addRows([
    {
      name: "Toma",
      age: "18",
      gender: "M",
    },
    {
      name: "Hana",
      age: "27",
      gender: "F",
    },
    {
      name: "Gaku",
      age: "55",
      gender: "M",
    },
  ]);
})();
