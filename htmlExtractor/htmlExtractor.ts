import { JSDOM } from "jsdom";
import { Flight, Pilot, Club, TakeOff } from "../types";

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

export function extractClub(html: string, clubId: number): Club {
  const dom = new JSDOM(html);

  let arr: Element[] = Array.prototype.slice
    .call(dom.window.document.getElementsByTagName("span"))
    .filter((row: HTMLElement) => {
      return row.style.fontStyle === "italic";
    });

  if (arr.length === 4) {
    return {
      id: clubId,
      name: arr[3].textContent
    };
  } else {
    return null;
  }
}

export function extractPilot(html: string, id: number): Pilot {
  const dom = new JSDOM(html);

  let pilot: Pilot = {
    id: id,
    name: "",
    club: "",
    country: 0,
    license: "",
    wings: ""
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

    if (pilot.name.length === 0) {
      return null;
    }

    let countryId =
      pilotInfo.filter(p => p.indexOf("country_id=") > 0).length > 0
        ? pilotInfo
            .filter(p => p.indexOf("country_id=") > 0)[0]
            .split("country_id=")[1]
            .split('"')[0]
        : "0";

    pilot.country = parseInt(countryId);

    pilot.club =
      pilotInfo.filter(p => p.indexOf("club_id") > 0).length > 0
        ? pilotInfo
            .filter(p => p.indexOf("club_id") > 0)[0]
            .split(">")[1]
            .split("<")[0]
        : "";

    let license =
      pilotInfo.filter(p => p.indexOf("IPPI") > -1).length > 0
        ? pilotInfo.filter(p => p.indexOf("IPPI") > -1)[0]
        : null;

    pilot.license = license ? license : "";

    if (license) {
      pilot.wings = pilotInfo
        .slice(pilotInfo.indexOf(license) + 1, pilotInfo.length)
        .join(",");
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

export function extractTakeOff(html: string, id: number): TakeOff {
  try {
    const dom = new JSDOM(html);

    let spans = Array.prototype.slice
      .call(dom.window.document.getElementsByTagName("span"))
      .filter(el => {
        return el.style.backgroundColor === "rgb(211, 211, 211)";
      });

    var name = spans[3].textContent.replace("[", "").replace("]", "");

    if (name.length > 0) {
      let table = Array.prototype.slice
        .call(dom.window.document.getElementsByTagName("table"))
        .find(
          (table: Element) =>
            table.hasAttribute("cellpadding") &&
            table.getAttribute("cellpadding") === "3"
        );

      if (!table) {
        return null;
      }

      let arr: Element[] = Array.prototype.slice
        .call(table.children[0].children)
        .filter((row: Element) => {
          return row.children && row.children.length === 2;
        });

      return {
        id: id,
        name: name,
        region: getRowData(arr[0]),
        asl: getRowData(arr[1])
          ? parseInt(getRowData(arr[1]).split(" meters")[0])
          : 0,
        toptobottom:
          getRowData(arr[1]).indexOf("bottom ") > -1
            ? parseInt(
                getRowData(arr[1])
                  .split("bottom ")[1]
                  .split(" meters")[0]
              )
            : 0,
        description: getRowData(arr[3])
      };
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
}

export function extractFlight(html: string, id: number): Flight {
  try {
    const dom = new JSDOM(html);

    let table = Array.prototype.slice
      .call(dom.window.document.getElementsByTagName("table"))
      .find(
        (table: Element) =>
          table.hasAttribute("cellpadding") &&
          table.getAttribute("cellpadding") === "5"
      );

    if (!table) {
      return null;
    }

    let arr: Element[] = Array.prototype.slice
      .call(table.children[0].children)
      .filter((row: Element) => {
        return row.children && row.children.length === 2;
      });

    var pilotIdString =
      html.indexOf("user_id=") > 0
        ? html.split("user_id=")[1].split("'")[0]
        : "0";

    var trackloglink = "";
    if (html.indexOf("'>Tracklog in Google Earth") > -1) {
      var current = html.split("'>Tracklog in Google Earth")[0];
      current = current.split("rqtid=19&trip_id=" + id + "&")[1];
      trackloglink =
        "https://flightlog.org/fl.html?rqtid=19&trip_id=" + id + "&" + current;
    }

    return {
      id: id,
      pilotid: parseInt(pilotIdString),
      date: getRowData(arr[0]),
      country: getRowData(arr[1]),
      takeoff: getRowData(arr[2]),
      glider: getRowData(arr[3]),
      duration: getRowData(arr[4]),
      distance: getRowData(arr[5]),
      maxaltitude: parseInt(getRowData(arr[6]).split(" m")[0]),
      description: getRowData(arr[7]),
      opendistance: getRowData(arr[9]).split("Distance: ")[1],
      trackloglink: trackloglink
    };
  } catch (e) {
    console.log(e);
  }
}
