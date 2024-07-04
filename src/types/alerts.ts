export interface Alert {
  id: string;
  type: string;
  active_period: ActivePeriod[];
  banner: unknown;
  cause: string;
  created_at: string;
  description: string;
  effect: string;
  header: string;
  image?: string;
  image_alternative_text?: string;
  informed_entity: InformedEntity[];
  lifecycle: string;
  service_effect: string;
  severity: number;
  short_header: string;
  timeframe?: string;
  updated_at: string;
  url?: string;
}

export interface ActivePeriod {
  end?: string;
  start: string;
}

export interface InformedEntity {
  activities: string[];
  direction_id?: number;
  route: string;
  route_type: number;
  trip?: string;
  stop?: string;
}
