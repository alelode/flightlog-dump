const sqlite3 = require("sqlite3").verbose();

export function initDb() {
  var filename = Date.now();
  var db = new sqlite3.Database(
    "./" + filename + ".sqlite3",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    function(err) {
      if (err) console.log(err.message);
    }
  );

  db.serialize(function() {
    db.run(
      "CREATE TABLE flights (id NUMBER, date TEXT, country TEXT, takeoff TEXT, glider TEXT, duration TEXT, distance TEXT, maxaltitude TEXT, description TEXT, opendistance TEXT)"
    );
    db.run(
      "CREATE TABLE pilots (id NUMBER, name TEXT, country TEXT, club TEXT, license TEXT)"
    );
    db.run("CREATE TABLE clubs (id NUMBER, name TEXT)");

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
