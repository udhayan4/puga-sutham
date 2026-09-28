// Deterministic Hackathon Demo Dataset (Zero fake data in production; only used when demoMode=true)
import { KEELADI_LAT, KEELADI_LON } from "./weather";

export interface DemoDataset {
  fires: Array<{
    id: string;
    latitude: number;
    longitude: number;
    confidence: number;
    detectedAt: number;
    source: string;
    label?: string;
  }>;
  wind: {
    windSpeedKmh: number;
    windDirectionDeg: number;
    recordedAt: string;
  };
  smokeReports: Array<{
    id: string;
    latitude: number;
    longitude: number;
    classification: string;
    confidenceScore: number;
    submittedAt: number;
    description?: string;
    status: "VERIFIED" | "NEEDS_REVIEW" | "REJECTED";
  }>;
  clearReports: Array<{
    id: string;
    latitude: number;
    longitude: number;
    classification: string;
    confidenceScore: number;
    submittedAt: number;
    status: "VERIFIED" | "NEEDS_REVIEW" | "REJECTED";
  }>;
}

export const DEMO_DATASET: DemoDataset = {
  // Fire located South-West of Keeladi, burning agricultural stubble
  fires: [
    {
      id: "demo_fire_sw_keeladi",
      latitude: 9.8120, // ~8.4 km South-West of Keeladi
      longitude: 78.1410,
      confidence: 1.0,
      detectedAt: Date.now() - 28 * 60 * 1000, // 28 minutes ago
      source: "NASA VIIRS_SNPP_NRT (Demo Simulation)",
      label: "Crop Residue Burning (Silaiman West Border)"
    },
    {
      id: "demo_fire_isolated_north",
      latitude: 9.9400,
      longitude: 78.2200,
      confidence: 0.92,
      detectedAt: Date.now() - 75 * 60 * 1000,
      source: "NASA VIIRS_SNPP_NRT (Demo Simulation)",
      label: "Controlled Wasteland Clearing"
    }
  ],
  // Wind blowing towards North-East (from SW @ 225 degrees) at 18 km/h directly carrying smoke to Keeladi
  wind: {
    windSpeedKmh: 18,
    windDirectionDeg: 225, // Blowing from SW (225°), pushing smoke to NE (45°)
    recordedAt: new Date().toISOString()
  },
  // Ground observations by community rangers
  smokeReports: [
    {
      id: "demo_rep_01",
      latitude: 9.8350,
      longitude: 78.1680,
      classification: "smoke",
      confidenceScore: 0.94,
      submittedAt: Date.now() - 14 * 60 * 1000,
      description: "Dense white-grey smoke plume observed ascending from farmland toward highway.",
      status: "VERIFIED"
    },
    {
      id: "demo_rep_02",
      latitude: 9.8450,
      longitude: 78.1810,
      classification: "smoke",
      confidenceScore: 0.88,
      submittedAt: Date.now() - 6 * 60 * 1000,
      description: "Acrid burning smell detected near Silaiman bypass.",
      status: "VERIFIED"
    }
  ],
  clearReports: [
    {
      id: "demo_rep_clear_01",
      latitude: 9.8900,
      longitude: 78.1200,
      classification: "clear",
      confidenceScore: 0.96,
      submittedAt: Date.now() - 35 * 60 * 1000,
      status: "VERIFIED"
    }
  ]
};
