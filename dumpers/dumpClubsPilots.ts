import { getHtml } from "../helpers/getHtml";
import {
  extractPilotUrls,
  extractClub,
  extractPilot
} from "../htmlExtractor/htmlExtractor";
import { Pilot, Club } from "../types";

let clubId = 1;
const baseUrl = "https://flightlog.org/";

let allClubs: Club[] = [];
let allPilots: Pilot[] = [];

export async function dumpClubsAndPilots() {
  const page = "fl.html?l=1&a=26&club_id=" + clubId;

  console.log("Fetching club " + clubId);
  let html = await getHtml(baseUrl + page);
  let club = extractClub(html);
  let pilotUrls: string[] = extractPilotUrls(html);

  console.log("Fetched " + pilotUrls.length + " pilot urls from " + club);
  if (pilotUrls.length > 0) {
    //Limit to loading 20 pilots at one time
    while (pilotUrls.length > 0) {
      console.log("We have " + pilotUrls.length + " urls left");
      let pilotUrlsToLoad = pilotUrls.splice(
        0,
        pilotUrls.length > 20 ? 20 : pilotUrls.length
      );
      let pilots = await loadPilots(pilotUrlsToLoad);
      allPilots = allPilots.concat(pilots);
    }

    clubId++;
    dumpClubsAndPilots();
  } else {
    console.log(
      "Done dumping " +
        allPilots.length +
        " pilots and " +
        allClubs.length +
        " clubs"
    );
  }
}

async function loadPilots(pilotUrls: string[]): Promise<Pilot[]> {
  let pilotsHtml = await Promise.all(
    pilotUrls.map((link: string) => {
      return getHtml(link);
    })
  );

  let pilots = await Promise.all(
    pilotsHtml.map(fh => {
      return extractPilot(fh);
    })
  );

  console.log(pilots.length, pilots[0]);

  return pilots;
}
