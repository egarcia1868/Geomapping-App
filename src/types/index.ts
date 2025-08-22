export interface Location {
  latitude: number;
  longitude: number;
}

export interface Tag {
  id: string;
  location: Location;
  title: string;
  description: string;
  createdAt: Date;
  createdBy: string;
}

export interface UserLocation extends Location {
  accuracy: number;
  timestamp: number;
}