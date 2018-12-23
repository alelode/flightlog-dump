import { getHtml } from "./getHtml";
import { extractPilotUrls, extractClub, extractPilot } from "./htmlExtractor";
import { Pilot, Club } from "./types";



let clubId = 1;
const baseUrl = "https://flightlog.org/";

let allClubs: Club[] = [];
let allPilots: Pilot[] = [];


export async function dumpClubsAndPilots() {
    const page = "fl.html?l=1&a=26&club_id=" + clubId;

    console.log("Fetching club " + clubId);
    let html = await getHtml(baseUrl + page);
    let club = extractClub(html);
    let pilotUrls = extractPilotUrls(html);

    console.log("Fetched " + pilotUrls.length + " pilot urls from " + club);
    if (pilotUrls.length > 0) {
        // let pilots = await loadPilots(pilotUrls);
        // allPilots = allPilots.concat(pilots);
        clubId++;
        dumpClubsAndPilots();
    } else {
        console.log("Done dumping " + allPilots.length + " pilots and " + allClubs.length + " clubs");
    }
}


// async function loadPilots(pilotUrls: string[]): Promise<Pilot[]> {
//     let pilotsHtml = await Promise.all(pilotUrls.map((link: string) => getHtml(baseUrl + link)));
//     let pilots = await Promise.all(pilotsHtml.map(fh => extractPilot(fh)));
//     return pilots;
// }