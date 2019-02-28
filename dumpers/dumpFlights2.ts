import { getHtml } from "../helpers/getHtml";
import { extractFlight } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import * as readline from "readline";
import { fail } from "assert";

const baseUrl = "https://flightlog.org/";
let insertCount = 0;
let failedStreak = 0;

export async function dumpFlights(
  db: Database,
  flightId: number,
  done: Function
) {
  const page = "fl.html?l=1&a=34&&trip_id=" + flightId;
  let html = await getHtml(baseUrl + page);
  var flight = extractFlight(html, flightId);

  if (flight && flight.pilotid > 0) {
    db.insertFlight(flight);
    insertCount++;
    flightId++;
    dumpFlights(db, flightId, done);
    writeProgress(insertCount);
  } else if (failedStreak > 30) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0, null);
    console.log("Done dumping flights");
    done();
  } else {
    flightId++;
    failedStreak++;
    dumpFlights(db, flightId, done);
  }
}

function writeProgress(count: number) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Flight dumping progress: ${count}`;
  process.stdout.write(text);
}
