// Deterministic Protected Areas Catalog for Tamil Nadu / Keeladi Region
export interface ProtectedArea {
  id: string;
  name: string;
  category: "Heritage / Excavation" | "School / College" | "Hospital" | "Wildlife Sanctuary";
  latitude: number;
  longitude: number;
  sensitivity: "CRITICAL" | "HIGH" | "MODERATE";
  contactUnit?: string;
}

export const PROTECTED_AREAS: ProtectedArea[] = [
  {
    id: "site_keeladi",
    name: "Keeladi Excavation Site & Museum",
    category: "Heritage / Excavation",
    latitude: 9.855924,
    longitude: 78.193178,
    sensitivity: "CRITICAL",
    contactUnit: "Archaeological Survey of India / TN State Unit"
  },
  {
    id: "site_madurai_hospital",
    name: "Madurai Government Rajaji Hospital",
    category: "Hospital",
    latitude: 9.9252,
    longitude: 78.1198,
    sensitivity: "CRITICAL",
    contactUnit: "District Health Administration"
  },
  {
    id: "site_thiagarajar_eng",
    name: "Thiagarajar College of Engineering Campus",
    category: "School / College",
    latitude: 9.8828,
    longitude: 78.0818,
    sensitivity: "HIGH",
    contactUnit: "Campus Safety & Environmental Cell"
  },
  {
    id: "site_vaigai_reserve",
    name: "Upper Vaigai Basin & Bird Sanctuary",
    category: "Wildlife Sanctuary",
    latitude: 9.8140,
    longitude: 78.2710,
    sensitivity: "HIGH",
    contactUnit: "Forest & Wildlife Department"
  },
  {
    id: "site_silaiman_school",
    name: "Silaiman Government Higher Secondary School",
    category: "School / College",
    latitude: 9.8710,
    longitude: 78.1750,
    sensitivity: "HIGH",
    contactUnit: "District Education Officer"
  }
];
