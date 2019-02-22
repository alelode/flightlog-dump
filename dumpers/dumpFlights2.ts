import { getHtml } from "../helpers/getHtml";
import { extractFlight } from "../htmlExtractor/htmlExtractor";
import Database from "../db/database";
import * as readline from "readline";
import * as moment from "moment";

let flightId = 1;
const baseUrl = "https://flightlog.org/";
let insertCount = 0;
let lastSuccessfulFlightDumpDate = moment("1900-01-01");

export async function dumpFlights(db: Database, done: Function) {
  const page = "fl.html?l=1&a=34&&trip_id=" + flightId;
  let html = await getHtml(baseUrl + page);
  var flight = extractFlight(html, flightId);

  if (flight && flight.pilotid > 0) {
    db.insertFlight(flight);
    insertCount++;
    flightId++;
    dumpFlights(db, done);

    writeProgress(
      insertCount,
      flight.date,
      moment()
        .format("YYYY-MM-DD")
        .toString()
    );
    if (flight.date.indexOf("-00") === 0) {
      lastSuccessfulFlightDumpDate = moment(flight.date);
    }
  } else if (lastSuccessfulFlightDumpDate.isBefore(moment())) {
    flightId++;
    dumpFlights(db, done);
  } else {
    console.log("Done dumping pilots");
    done();
  }
}

function writeProgress(count: number, first: string, last: string) {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, null);
  let text = `Flight dumping progress: ${count} Currently at ${first} of ${last}`;
  process.stdout.write(text);
}
