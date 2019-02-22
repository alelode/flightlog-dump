import { Pilot } from "../types";

const sqlite3 = require("sqlite3").verbose();

export function insertClubs(clubs: string[]) {
  var filename = "flightlog";

  var db = new sqlite3.Database(
    "./" + filename + ".sqlite3",
    sqlite3.OPEN_READWRITE,
    function(err) {
      if (err) console.log(err.message);
    }
  );

  db.serialize(function() {
    var stmt = db.prepare("INSERT INTO clubs VALUES (?)");
    for (var club of clubs) {
      stmt.run(club);
    }
    stmt.finalize();
  });
  db.close();
}

export function insertPilots(pilots: Pilot[]) {
  var filename = "flightlog";

  var db = new sqlite3.Database(
    "./" + filename + ".sqlite3",
    sqlite3.OPEN_READWRITE,
    function(err) {
      if (err) console.log(err.message);
    }
  );

  db.serialize(function() {
    var stmt = db.prepare(
      "INSERT INTO pilots (name, club, country, license, wings) VALUES (?,?,?,?,?)"
    );
    for (let pilot of pilots) {
      stmt.run(
        pilot.name,
        pilot.club,
        pilot.country,
        pilot.license,
        pilot.wings
      );
    }
    stmt.finalize();
    console.log("done");
  });
  db.close();
  console.log("closed");
}

export function initDb() {
  var filename = "flightlog";

  var db = new sqlite3.Database(
    "./" + filename + ".sqlite3",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    function(err) {
      if (err) console.log(err.message);
    }
  );

  db.serialize(function() {
    db.run(
      "CREATE TABLE flights (date TEXT, country TEXT, takeoff TEXT, glider TEXT, duration TEXT, distance TEXT, maxaltitude TEXT, description TEXT, opendistance TEXT)"
    );
    db.run(
      "CREATE TABLE pilots (name TEXT, country NUMBER, club TEXT, license TEXT, wings TEXT)"
    );
    db.run("CREATE TABLE clubs (name TEXT)");

    // var stmt = db.prepare("INSERT INTO clubs VALUES (?)");
    // stmt.run("test");
    // stmt.finalize();

    // db.each("SELECT * FROM clubs", function(err, row) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(row);
    //   }
    // });

    // var stmt = db.prepare("INSERT INTO flights VALUES (?,?,?,?,?,?,?,?,?)");
    // for (var i = 0; i < 10; i++) {
    //   stmt.run("a", "b", "c", "d", "e", "f", "g", "h", "i");
    // }
    // stmt.finalize();

    // db.each("SELECT * FROM flights", function(err, row) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(row);
    //   }
    // });
  });

  db.close();
}
