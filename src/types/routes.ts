export interface Route {
  id: string;
  type: number;
  color: string;
  description: string;
  direction_destinations: string[];
  direction_names: string[];
  fare_class: string;
  long_name: string;
  short_name: string;
  sort_order: number;
  text_color: string;
  line: Line;
}

interface Line {
  id: string;
  type: string;
}
