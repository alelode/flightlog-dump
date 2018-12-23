import { dumpFlights } from './dumpFlights'
import { dumpClubsAndPilots } from "./dumpClubsPilots"
var stdin = process.stdin;

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

console.log("What do you want to dump?");
console.log("(1) Clubs and Pilots");
console.log("(2) Flights");
stdin.on('data', function (key) {
    if (key === '\u0003') {
        process.exit();
    }

    switch (key) {
        case "1":
            console.log("Starting clubs and pilots dump");
            dumpClubsAndPilots();
            break;
        case "2":
            console.log("Starting flights dump....");
            dumpFlights();
            break;
        default:
            break;
    }
});