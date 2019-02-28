export interface Flight {
  id: number;
  pilotid: number;
  date: string;
  country: string;
  takeoff: string;
  glider: string;
  duration: string;
  distance: string;
  maxaltitude: number;
  description: string;
  opendistance: string;
  trackloglink: string;
}

export interface TakeOff {
  id: number;
  name: string;
  region: string;
  toptobottom: number;
  asl: number;
  description: string;
}

export interface Club {
  name: string;
  id: number;
}

export interface Pilot {
  id: number;
  name: string;
  country: number;
  club: string;
  license: string;
  wings: string;
}

// export interface Wing {
//   Manufacturer: string;
//   Model: string;
// }

// export interface Manufacturer {
//   Name: string;
//   Wings: string[];
// }
