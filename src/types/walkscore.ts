export interface WalkScore {
  bike: BikeScore;
  description: string;
  help_link: string;
  logo_url: string;
  more_info_icon: string;
  more_info_link: string;
  snapped_lat: number;
  snapped_lon: number;
  status: number;
  updated: string;
  walkscore: number;
  ws_link: string;
}

export interface BikeScore {
  description: string;
  score: number;
}
