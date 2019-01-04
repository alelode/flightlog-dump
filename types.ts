export interface Flight {
  date: string;
  country: string;
  takeoff: string;
  glider: string;
  duration: string;
  distance: string;
  maxaltitude: string;
  description: string;
  opendistance: string;
}

export interface Club {
  name: string;
}

export interface Pilot {
  name: string;
  country: number;
  club: string;
  license: string;
  wings: string[];
}

// export interface Wing {
//   Manufacturer: string;
//   Model: string;
// }

// export interface Manufacturer {
//   Name: string;
//   Wings: string[];
// }
