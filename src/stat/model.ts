export interface SpotDetail {
  [milestone: string]: string;
}

export interface Spot {
  [timestamp: string]: SpotDetail;
}
