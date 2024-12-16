// スクレイピングしてファイルへの書き込み、emailを送信を定期実行
import cron from "node-cron";
import { addPeopleToGS } from "./example16gsheet.mjs";
import { sendEmail } from "./example18email.mjs";

cron.schedule("39 1 * * *", () => {
  main();
});

async function main() {
  const dt = new Date();
  const dtStr = dt.toDateString();
  const sheetUrl = `https://docs.google.com/spreadsheets/d${process.env.GOOGLE_SHEET_ID}`;
  try {
    await addPeopleToGS();
    sendEmail("処理が成功しました", `処理時刻: ${dtStr}\n${sheetUrl}}`);
  } catch {
    sendEmail("エラーが発生しました", `エラー発生時刻: ${dtStr}\n${e}`);
  }
}
