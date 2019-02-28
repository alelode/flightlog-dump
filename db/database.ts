import { Pilot, Club, Flight, TakeOff } from "../types";

const sqlite3 = require("sqlite3").verbose();

class Database {
  db;

  initDb() {
    var filename = "flightlog";
    this.db = new sqlite3.Database(
      "./" + filename + ".sqlite3",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      function(err) {
        if (err) console.log(err.message);
      }
    );

    this.db.serialize(() => {
      this.db.run(
        "CREATE TABLE IF NOT EXISTS flights (id NUMBER, pilotid NUMBER, date TEXT, country TEXT, takeoff TEXT, glider TEXT, duration TEXT, distance TEXT, maxaltitude NUMBER, description TEXT, opendistance TEXT, trackloglink TEXT)"
      );
      this.db.run(
        "CREATE TABLE IF NOT EXISTS pilots (id NUMBER, name TEXT, country NUMBER, club TEXT, license TEXT, wings TEXT)"
      );
      this.db.run("CREATE TABLE IF NOT EXISTS clubs (id NUMBER, name TEXT)");
      this.db.run(
        "CREATE TABLE IF NOT EXISTS takeoffs (id NUMBER, name TEXT, region TEXT, toptobottom NUMBER, asl NUMBER, description TEXT, directions TEXT)"
      );
    });
  }

  insertClub(club: Club) {
    this.db.serialize(() => {
      var stmt = this.db.prepare("INSERT INTO clubs VALUES (?,?)");
      stmt.run(club.id, club.name);
      stmt.finalize();
    });
  }

  insertPilot(pilot: Pilot) {
    this.db.serialize(() => {
      var stmt = this.db.prepare(
        "INSERT INTO pilots (id, name, club, country, license, wings) VALUES (?,?,?,?,?,?)"
      );
      stmt.run(
        pilot.id,
        pilot.name,
        pilot.club,
        pilot.country,
        pilot.license,
        pilot.wings
      );
      stmt.finalize();
    });
  }

  insertTakeOff(takeoff: TakeOff) {
    this.db.serialize(() => {
      var stmt = this.db.prepare(
        "INSERT INTO takeoffs (id, name, region, toptobottom, asl, description) VALUES (?,?,?,?,?,?)"
      );
      stmt.run(
        takeoff.id,
        takeoff.name,
        takeoff.region,
        takeoff.toptobottom,
        takeoff.asl,
        takeoff.description
      );
      stmt.finalize();
    });
  }

  insertFlight(flight: Flight) {
    this.db.serialize(() => {
      var stmt = this.db.prepare(
        "INSERT INTO flights (id, pilotid, date, country, takeoff, glider, duration, distance, maxaltitude, description, opendistance, trackloglink) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)"
      );
      stmt.run(
        flight.id,
        flight.pilotid,
        flight.date,
        flight.country,
        flight.takeoff,
        flight.glider,
        flight.duration,
        flight.distance,
        flight.maxaltitude,
        flight.description,
        flight.opendistance,
        flight.trackloglink
      );
      stmt.finalize();
    });
  }

  getHighestIndex(table: string, callback: (id: number) => void) {
    this.db.get("SELECT MAX(id) from " + table, (err, row) => {
      if (err) {
        console.log(err);
        return null;
      } else {
        callback(row["MAX(id)"]);
      }
    });
  }

  insertPilots(pilots: Pilot[]) {
    this.db.serialize(() => {
      var stmt = this.db.prepare(
        "INSERT INTO pilots (id,name, club, country, license, wings) VALUES (?,?,?,?,?)"
      );
      for (let pilot of pilots) {
        stmt.run(
          pilot.id,
          pilot.name,
          pilot.club,
          pilot.country,
          pilot.license,
          pilot.wings
        );
      }
      stmt.finalize();
    });
  }

  closeDb() {
    this.db.close();
  }

  emptyTable(table: string) {
    this.db.run("DELETE FROM " + table);
  }
}

export default Database;
