import { getHtml } from "../helpers/getHtml";
import { extractClub } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import { Club } from "../types";
import * as readline from "readline";

let insertCount = 0;
var failedStreak = 0;
const BASEURL = "https://flightlog.org/";

let allClubs: Club[] = [];

export async function dumpClubs(db: Database, clubId: number, done: Function) {
  const page = "fl.html?l=1&a=26&club_id=" + clubId;
  let html = await getHtml(BASEURL + page);
  var club = extractClub(html, clubId);

  if (club && club.name.length > 0) {
    db.insertClub(club);
    insertCount++;
    clubId++;
    dumpClubs(db, clubId, done);
    writeProgress(insertCount);
  } else if (failedStreak > 30) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    console.log("Done dumping clubs");
    done();
  } else {
    clubId++;
    failedStreak++;
    dumpClubs(db, clubId, done);
  }
}

function writeProgress(p: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Club dumping progress: ${p}`;
  process.stdout.write(text);
}
