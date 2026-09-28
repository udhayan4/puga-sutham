export type IncidentStatus = "IDLE" | "DETECTED" | "ANALYZING" | "ADVISORY" | "CRITICAL" | "VERIFIED" | "RESOLVED";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface IncidentSignalBreakdown {
  satelliteConfidence: number; // e.g. 0.82
  windConfidence: number;      // e.g. 0.91
  trajectoryConfidence: number;// e.g. 0.86
  citizenVerification: "PENDING" | "VERIFIED" | "REJECTED";
  overallConfidence: number;   // e.g. 0.87
  hasFireDetected: boolean;
  hasWindAligned: boolean;
  hasDriftIntersection: boolean;
  hasWarningDistance: boolean;
  hasCitizenReports: boolean;
}

export interface IncidentAlert {
  id: string;
  severity: RiskLevel;
  title: string;
  location: string;
  etaMinutes: number | null;
  createdTime: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  distanceKm: number;
  windSpeedKmh: number;
  windDirectionLabel: string;
}

export interface IncidentTimelineEvent {
  time: string;
  title: string;
  description: string;
  type: "detection" | "analysis" | "prediction" | "alert" | "citizen" | "verification" | "resolution";
}

export interface ProtectedAreaRisk {
  id: string;
  name: string;
  category: "Heritage / Excavation" | "School / College" | "Hospital" | "Wildlife Sanctuary";
  latitude: number;
  longitude: number;
  sensitivity: "CRITICAL" | "HIGH" | "MODERATE";
  contactUnit?: string;
  distanceKm: number | null;
  isWithinDriftCone: boolean;
  etaMinutes: number | null;
  riskLevel: RiskLevel;
  visitors: string;
  monitoringStatus: "ACTIVE" | "STANDBY";
  lastScan: string;
}

export interface IncidentState {
  id: string;
  status: IncidentStatus;
  riskLevel: RiskLevel;
  title: string;
  summary: string;
  detectedAt: string;
  fireSource: {
    id: string;
    latitude: number;
    longitude: number;
    locationName: string;
    confidence: number;
    type: "thermal_satellite_detection" | "citizen_ground_observation" | "none";
  } | null;
  targetZone: {
    name: string;
    latitude: number;
    longitude: number;
  };
  wind: {
    speedKmh: number;
    directionDeg: number;
    compassHeading: string;
    recordedAt: string;
  };
  smoke: {
    headingDeg: number;
    spreadDegrees: number;
    projectedTravelKm: number;
  };
  distanceKm: number | null;
  etaMinutes: number | null;
  activeAlerts: IncidentAlert[];
  signals: IncidentSignalBreakdown;
  timeline: IncidentTimelineEvent[];
  affectedZones: string[];
  citizenReportsCount: number;
  verifiedReportsCount: number;
  isDemoActive: boolean;
}

// 1. Nominal / Idle State when there is no active threat
export const IDLE_INCIDENT_STATE: IncidentState = {
  id: "INC-NOMINAL",
  status: "IDLE",
  riskLevel: "LOW",
  title: "Perimeter Monitoring Active — Air Corridor Nominal",
  summary: "Continuous satellite passes and weather radar scan the 50km protected perimeter. No thermal anomalies or downwind smoke trajectories detected.",
  detectedAt: "Just now",
  fireSource: null,
  targetZone: {
    name: "Keeladi Excavation Site & Museum Buffer",
    latitude: 9.855924,
    longitude: 78.193178
  },
  wind: {
    speedKmh: 12,
    directionDeg: 180,
    compassHeading: "S",
    recordedAt: "Live Feed"
  },
  smoke: {
    headingDeg: 0,
    spreadDegrees: 30,
    projectedTravelKm: 0
  },
  distanceKm: null,
  etaMinutes: null,
  activeAlerts: [],
  signals: {
    satelliteConfidence: 0.15,
    windConfidence: 0.92,
    trajectoryConfidence: 0.1,
    citizenVerification: "PENDING",
    overallConfidence: 0.15,
    hasFireDetected: false,
    hasWindAligned: false,
    hasDriftIntersection: false,
    hasWarningDistance: false,
    hasCitizenReports: false
  },
  timeline: [
    {
      time: "06:00",
      title: "System Initialized",
      description: "NASA VIIRS and Open-Meteo telemetry channels operational",
      type: "detection"
    },
    {
      time: "Now",
      title: "Clean Atmospheric Perimeter",
      description: "Air particulate dispersals within healthy baseline parameters",
      type: "analysis"
    }
  ],
  affectedZones: [],
  citizenReportsCount: 0,
  verifiedReportsCount: 0,
  isDemoActive: false
};

// 2. Active High-Risk Incident State (Used in active advisory / demo scenario)
export const ACTIVE_DEMO_INCIDENT_STATE: IncidentState = {
  id: "INC-2026-089",
  status: "CRITICAL",
  riskLevel: "HIGH",
  title: "Agricultural Smoke Drift Corridor Identified",
  summary: "High-intensity agricultural burning hotspot detected 8.4 km Southwest of Keeladi. Sustained 18 km/h Southwesterly winds are propelling dense smoke directly toward heritage excavation trenches and surrounding school clusters.",
  detectedAt: "12 mins ago",
  fireSource: {
    id: "fire_viirs_sw_01",
    latitude: 9.8120,
    longitude: 78.1410,
    locationName: "Silaiman West Agricultural Sector",
    confidence: 0.94,
    type: "thermal_satellite_detection"
  },
  targetZone: {
    name: "Keeladi Heritage Site & Museum",
    latitude: 9.855924,
    longitude: 78.193178
  },
  wind: {
    speedKmh: 18,
    directionDeg: 225, // SW
    compassHeading: "SW (225°)",
    recordedAt: "Real-time Telemetry"
  },
  smoke: {
    headingDeg: 45, // NE
    spreadDegrees: 30,
    projectedTravelKm: 18.0
  },
  distanceKm: 8.4,
  etaMinutes: 34,
  activeAlerts: [
    {
      id: "ALT-2026-001",
      severity: "CRITICAL",
      title: "Smoke Drift Approaching Heritage Excavation",
      location: "Keeladi Excavation Site & Museum",
      etaMinutes: 34,
      createdTime: "10 mins ago",
      status: "ACTIVE",
      distanceKm: 8.4,
      windSpeedKmh: 18,
      windDirectionLabel: "NE"
    },
    {
      id: "ALT-2026-002",
      severity: "HIGH",
      title: "Secondary Plume Exposure Warning",
      location: "Silaiman Govt Higher Secondary School",
      etaMinutes: 22,
      createdTime: "8 mins ago",
      status: "ACTIVE",
      distanceKm: 6.2,
      windSpeedKmh: 18,
      windDirectionLabel: "NE"
    }
  ],
  signals: {
    satelliteConfidence: 0.94,
    windConfidence: 0.91,
    trajectoryConfidence: 0.88,
    citizenVerification: "VERIFIED",
    overallConfidence: 0.89,
    hasFireDetected: true,
    hasWindAligned: true,
    hasDriftIntersection: true,
    hasWarningDistance: true,
    hasCitizenReports: true
  },
  timeline: [
    {
      time: "10:31",
      title: "NASA Thermal Anomaly Sensed",
      description: "VIIRS SNPP instrument flagged high-confidence hotspot at (9.8120, 78.1410)",
      type: "detection"
    },
    {
      time: "10:32",
      title: "Open-Meteo Wind Vector Intersected",
      description: "Surface wind registered at 18 km/h heading 45° Northeast",
      type: "analysis"
    },
    {
      time: "10:33",
      title: "Trigonometric Cone Projected",
      description: "Plume ±30° expansion boundary overlaps Keeladi buffer perimeter",
      type: "prediction"
    },
    {
      time: "10:34",
      title: "Critical Smoke Alert Dispatched",
      description: "Automated alert issued to ASI conservators and District Education Officer",
      type: "alert"
    },
    {
      time: "10:47",
      title: "Ground Photo Observation Submitted",
      description: "Citizen ranger uploaded plume image; validated by on-device edge neural net",
      type: "citizen"
    },
    {
      time: "11:02",
      title: "Multi-Source Ground Truth Verified",
      description: "High-risk incident confirmed by field liaison team",
      type: "verification"
    }
  ],
  affectedZones: [
    "Keeladi Excavation Site & Museum",
    "Silaiman Govt Higher Secondary School",
    "Tirupuvanam Educational Buffer"
  ],
  citizenReportsCount: 3,
  verifiedReportsCount: 2,
  isDemoActive: true
};
