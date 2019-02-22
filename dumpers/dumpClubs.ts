import { getHtml } from "../helpers/getHtml";
import { extractClub } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import { Club } from "../types";
import * as readline from "readline";

const MAX = 90;

let clubId = 1;
const BASEURL = "https://flightlog.org/";

let allClubs: Club[] = [];

export async function dumpClubs(db: Database, done: Function) {
  const page = "fl.html?l=1&a=26&club_id=" + clubId;
  let html = await getHtml(BASEURL + page);
  allClubs.push(extractClub(html, clubId));

  if (clubId < MAX) {
    clubId++;
    writeProgress(clubId, MAX);
    dumpClubs(db, done);
  } else {
    console.log("\n");
    console.log("Done dumping clubs");
    db.insertClubs(allClubs);
    done();
  }
}

function writeProgress(p: number, total: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Club dumping progress: ${p}/${total}`;
  process.stdout.write(text);
}
