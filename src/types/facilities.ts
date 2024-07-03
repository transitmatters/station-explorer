export interface Elevator {
  id: string;
  type: string;
  latitude: null;
  long_name: string;
  longitude: null;
  properties: Property[];
  short_name: string;
  stop: Stop;
}

export interface Property {
  name: string;
  value: string;
}

export interface Stop {
  id: string;
  type: string;
}
