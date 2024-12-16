// スクレイピングの定期実行

import { addPeopleToGS } from "./example16gsheet.mjs";
import cron from "node-cron";

cron.schedule("43 0 * * *", () => {
  addPeopleToGS();
});
