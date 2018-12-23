export interface Flight {
    Date: string;
    Country: string;
    Takeoff: string;
    Glider: string;
    Duration: string;
    Distance: string;
    MaxAltitude: string;
    Description: string;
    OpenDistance: string;
}

export interface Club {
    name: string;
}

export interface Pilot {
    name: string;
    country: string;
    club: string;
}