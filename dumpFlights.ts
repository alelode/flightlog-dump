import { getHtml } from "./getHtml";
import { extractFlightUrls, extractFlight } from "./htmlExtractor";
import { Flight } from "./types";



let country = 0;
let year = 2018;
let offset = 0;
const baseUrl = "https://flightlog.org/";

let allFlights: Flight[] = [];



export async function dumpFlights() {

  const page =
    "fl.html?l=1&country_id=" +
    country +
    "&a=64&year=" +
    year +
    "&offset=" +
    offset;

  let html = await getHtml(baseUrl + page);
  let flightUrls = extractFlightUrls(html);
  console.log("Fetched " + flightUrls.length + " flight urls from country id " + country + " in " + year);
  let flights = await loadFlights(flightUrls);
  if (flights.length > 0) {
    console.log(flights.length + " flights downloaded")
    offset += 1000;
    allFlights = allFlights.concat(flights);
  } else {
    year--;
  }

  if (year === 1985) {
    year = 2018;
    country++;
  }
  if (country < 250) {
    dumpFlights();
  } else {
    console.log("We are done. Total of " + allFlights.length + " downloaded.");
  }
}


async function loadFlights(flightUrls: string[]): Promise<Flight[]> {
  let flightsHtml = await Promise.all(flightUrls.map((link: string) => getHtml(baseUrl + link)));
  let flights = await Promise.all(flightsHtml.map(fh => extractFlight(fh)));
  return flights;
}