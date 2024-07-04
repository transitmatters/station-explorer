export type FacilityType =
  | 'PARKING_AREA'
  | 'FULLY_ELEVATED_PLATFORM'
  | 'ELEVATOR'
  | 'ESCALATOR'
  | 'FARE_VENDING_MACHINE'
  | 'FARE_MEDIA_ASSISTANT'
  | 'ELEVATED_SUBPLATFORM'
  | 'BIKE_STORAGE';

export interface Facility {
  id: string;
  type: FacilityType;
  latitude: null;
  long_name: string;
  longitude: null;
  properties: Property[];
  short_name: string;
  stop: Stop;
}

export interface Elevator extends Facility {
  type: 'ELEVATOR';
}

export interface Escalator extends Facility {
  type: 'ESCALATOR';
}

export interface Property {
  name: string;
  value: string;
}

export interface Stop {
  id: string;
  type: string;
}
