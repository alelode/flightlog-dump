import { getHtml } from "../helpers/getHtml";
import { extractClub, extractPilot } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import { Pilot } from "../types";
import * as readline from "readline";

let pilotId = 1;
const baseUrl = "https://flightlog.org/";

const MAX = 15000;

export async function dumpPilots(db: Database, done: Function) {
  const page = "fl.html?l=1&a=28&user_id=" + pilotId;
  let html = await getHtml(baseUrl + page);
  var pilot = extractPilot(html, pilotId);

  if (pilot && pilot.name.length > 0) {
    db.insertPilot(pilot);
  }

  if (pilotId < MAX) {
    pilotId++;
    dumpPilots(db, done);
    writeProgress(pilotId, MAX);
  } else {
    console.log("Done dumping pilots");
    done();
  }
}

function writeProgress(p: number, total: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Pilot dumping progress: ${p}/${total}`;
  process.stdout.write(text);
}
