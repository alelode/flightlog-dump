import { JSDOM } from "jsdom";
import { Flight, Pilot } from "../types";

export function extractFlightUrls(html: string): string[] {
  const dom = new JSDOM(html);

  let arr: Element[] = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("tr"))
    .filter((row: Element) => {
      return row.children.length === 6;
    });

  return arr.map((row: Element) => {
    let anchorElement: HTMLAnchorElement = <HTMLAnchorElement>(
      row.children[1].children[0]
    );
    return anchorElement.href;
  });
}

export function extractPilotUrls(html: string) {
  const dom = new JSDOM(html);

  let links = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("a"))
    .filter((a: HTMLAnchorElement) => {
      return a.href.indexOf("user_id") > -1 && a.href.indexOf("xc") === -1;
    })
    .map((a: HTMLAnchorElement) => {
      return a.href;
    });
  return links;
}

export function extractPilots(html: string): string[] {
  const dom = new JSDOM(html);

  let links = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("a"))
    .filter((a: HTMLAnchorElement) => {
      return a.href.indexOf("user_id") > -1 && a.href.indexOf("xc") === -1;
    })
    .map((a: HTMLAnchorElement) => {
      return a.textContent;
    });
  return links;
}

export function extractClub(html: string) {
  const dom = new JSDOM(html);

  let arr: Element[] = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("span"))
    .filter((row: HTMLElement) => {
      return row.style.fontStyle === "italic";
    });

  if (arr.length === 4) {
    return arr[3].textContent;
  } else {
    throw "Could not fetch club name";
  }
}

export function extractPilot(html: string) {
  const dom = new JSDOM(html);

  let pilot: Pilot = {
    name: "",
    club: "",
    country: 0,
    license: "",
    wings: []
  };

  let rawInfo: Element = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("td"))
    .find((element: Element) => {
      return (
        element.hasAttribute("width") && element.getAttribute("width") == "s180"
      );
    });

  if (rawInfo) {
    let pilotInfo: string[] = rawInfo.innerHTML.split("<br>");
    pilot.name = pilotInfo[0];

    let countryId = pilotInfo.filter(p => p.indexOf("country_id") > 0)
      ? pilotInfo
          .filter(p => p.indexOf("country_id") > 0)[0]
          .split("country_id=")[1]
          .split('"')[0]
      : "0";

    pilot.country = parseInt(countryId);

    pilot.club = pilotInfo.filter(p => p.indexOf("club_id") > 0)
      ? pilotInfo
          .filter(p => p.indexOf("club_id") > 0)[0]
          .split(">")[1]
          .split("<")[0]
      : "";

    let license = pilotInfo.filter(p => p.indexOf("IPPI") > -1)
      ? pilotInfo.filter(p => p.indexOf("IPPI") > -1)[0]
      : null;

    pilot.license = license ? license : "";

    if (license) {
      pilot.wings = pilotInfo.slice(
        pilotInfo.indexOf(license) + 1,
        pilotInfo.length
      );
    }
  } else {
    console.log("Error: Could not find pilot info");
    process.exit(1);
  }
  return pilot;
}

function getRowData(row: Element) {
  if (!row) {
    return "";
  }

  return row.children[1].textContent.trim();
}

export function extractFlight(html: string) {
  try {
    const dom = new JSDOM(html);

    let table = Array.prototype.slice
      .call(dom.window.document.getElementsByTagName("table"))
      .find(
        (table: Element) =>
          table.hasAttribute("cellpadding") &&
          table.getAttribute("cellpadding") === "5"
      );
    let arr: Element[] = Array.prototype.slice
      .call(table.children[0].children)
      .filter((row: Element) => {
        return row.children && row.children.length === 2;
      });

    return {
      Date: getRowData(arr[0]),
      Country: getRowData(arr[1]),
      Takeoff: getRowData(arr[2]),
      Glider: getRowData(arr[3]),
      Duration: getRowData(arr[4]),
      Distance: getRowData(arr[5]),
      MaxAltitude: getRowData(arr[6]),
      Description: getRowData(arr[7]),
      OpenDistance: getRowData(arr[9]).split("Distance: ")[1]
    };
  } catch (e) {
    console.log(e);
  }
}
