// import { dumpFlights } from "./dumpers/dumpFlights";
// import { dumpClubsAndPilots } from "./dumpers/dumpClubsPilots";
// import { initDb } from "./db/db";
import Database from "./db/database";
import { dumpClubs } from "./dumpers/dumpClubs";
import { dumpPilots } from "./dumpers/dumpPilots";
import { dumpFlights } from "./dumpers/dumpFlights2";
import { debug } from "util";

var busy = false;

start();
async function start() {
  var db = new Database();

  console.log("Setting up database");
  await db.initDb();
  printInstructions();
  getKeyCommand(db);
}

async function getKeyCommand(db: Database) {
  var stdin = process.stdin;

  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  stdin.on("data", function(key) {
    if (!busy) {
      busy = true;
      doCommand(db, key);
    }
    if (key === "4") {
      db.closeDb();
      process.exit(0);
    }
  });
}

function printInstructions() {
  console.log("What do you want to dump?");
  console.log("(1) Clubs");
  console.log("(2) Pilots");
  console.log("(3) Flights");
  console.log("(4) Exit");
}

async function doCommand(db: Database, command: string): Promise<void> {
  switch (command) {
    case "1":
      console.log("Starting clubs dump...");
      db.emptyTable("clubs");
      dumpClubs(db, () => {
        busy = false;
        printInstructions();
        return;
      });
      break;
    case "2":
      console.log("Starting pilots dump...");
      dumpPilots(db, () => {
        busy = false;
        printInstructions();
        return;
      });
      break;
    case "3":
      console.log("Starting flights dump....");
      dumpFlights(db, () => {
        busy = false;
        printInstructions();
        return;
      });
      break;
    case "4":
      db.closeDb();
      process.exit(0);
      break;
    case "5":
      console.log("Gonna do shit");
      dddd(() => {
        busy = false;
        printInstructions();
        return;
      });
      break;
    default:
      db.closeDb();
      process.exit(0);
      return;
      break;
  }
}

async function dddd(done: Function) {
  setTimeout(() => {
    console.log("Done doing shit");
    done();
  }, 2000);
}
