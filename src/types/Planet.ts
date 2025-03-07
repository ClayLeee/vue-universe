export interface PlanetDetail {
  title: string;
  content: string;
}

export interface Planet {
  name: string;
  textureUrl: string; // 行星紋理URL
  size: number;
  distance: number;
  rotationSpeed: number;
  description: string;
  details: PlanetDetail[];
  color?: number; // 可選顏色，用於備選
  cloudsUrl?: string; // 可選，用於地球
  ringUrl?: string; // 可選，用於土星
}
