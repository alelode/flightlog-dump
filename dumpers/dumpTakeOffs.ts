import { getHtml } from "../helpers/getHtml";
import { extractTakeOff } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import * as readline from "readline";

const baseUrl = "https://flightlog.org/";
let insertCount = 0;
var failedStreak = 0;

export async function dumpTakeOffs(
  db: Database,
  takeOffId: number,
  done: Function
) {
  const page = "fl.html?l=1&country_id=160&a=22&start_id=" + takeOffId;
  let html = await getHtml(baseUrl + page);
  var takeOff = extractTakeOff(html, takeOffId);

  if (takeOff && takeOff.description.length > 0) {
    db.insertTakeOff(takeOff);
    insertCount++;
    takeOffId++;
    dumpTakeOffs(db, takeOffId, done);
    writeProgress(insertCount);
  } else if (failedStreak > 30) {
    console.log("Done dumping takeOffs");
    done();
  } else {
    takeOffId++;
    failedStreak++;
    dumpTakeOffs(db, takeOffId, done);
  }
}

function writeProgress(count: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Dumped ${count} takeoffs`;
  process.stdout.write(text);
}
