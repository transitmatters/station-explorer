export type FacilityType =
  | 'PARKING_AREA'
  | 'FULLY_ELEVATED_PLATFORM'
  | 'ELEVATOR'
  | 'ESCALATOR'
  | 'FARE_VENDING_MACHINE'
  | 'FARE_VENDING_RETAILER'
  | 'FARE_MEDIA_ASSISTANT'
  | 'FARE_MEDIA_ASSISTANCE_FACILITY'
  | 'ELEVATED_SUBPLATFORM'
  | 'BIKE_STORAGE'
  | 'BRIDGE_PLATE'
  | 'ELECTRIC_CAR_CHARGERS'
  | 'PICK_DROP'
  | 'PORTABLE_BOARDING_LIFT'
  | 'RAMP'
  | 'TAXI_STAND'
  | 'TICKET_WINDOW'
  | 'OTHER';

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
