import { getHtml } from "../helpers/getHtml";
import { extractClub, extractPilot } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import { Pilot } from "../types";
import * as readline from "readline";

const baseUrl = "https://flightlog.org/";
var insertCount = 0;
var failedStreak = 0;

export async function dumpPilots(
  db: Database,
  pilotId: number,
  done: Function
) {
  const page = "fl.html?l=1&a=28&user_id=" + pilotId;
  let html = await getHtml(baseUrl + page);
  var pilot = extractPilot(html, pilotId);

  if (pilot && pilot.name.length > 0) {
    db.insertPilot(pilot);
    pilotId++;
    insertCount++;
    dumpPilots(db, pilotId, done);
    writeProgress(insertCount);
  } else if (failedStreak > 30) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    console.log("Done dumping pilots");
    done();
  } else {
    failedStreak++;
    pilotId++;
    dumpPilots(db, pilotId, done);
  }
}

function writeProgress(p: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Pilot dumping progress: ${p}`;
  process.stdout.write(text);
}
