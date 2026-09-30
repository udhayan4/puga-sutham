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
  // Tamil Nadu & Madurai Regional Zones
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
    id: "site_madurai_meenakshi",
    name: "Madurai Meenakshi Amman Heritage Zone",
    category: "Heritage / Excavation",
    latitude: 9.9195,
    longitude: 78.1193,
    sensitivity: "CRITICAL",
    contactUnit: "HR&CE & Madurai Municipal Heritage Bureau"
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
  },

  // Major Indian Heritage & Sensitive Eco-Zones
  {
    id: "site_india_delhi_red_fort",
    name: "Red Fort & Old Delhi Heritage Complex",
    category: "Heritage / Excavation",
    latitude: 28.6562,
    longitude: 77.2410,
    sensitivity: "CRITICAL",
    contactUnit: "ASI Northern Circle / Central Pollution Control Board"
  },
  {
    id: "site_india_taj_mahal",
    name: "Taj Mahal Eco-Sensitive Trapezium Zone",
    category: "Heritage / Excavation",
    latitude: 27.1751,
    longitude: 78.0421,
    sensitivity: "CRITICAL",
    contactUnit: "Taj Trapezium Zone Authority (TTZ) / ASI"
  },
  {
    id: "site_india_punjab_stubble_buffer",
    name: "Ludhiana Agricultural Research & Eco Corridor",
    category: "School / College",
    latitude: 30.9010,
    longitude: 75.8573,
    sensitivity: "HIGH",
    contactUnit: "Punjab State Pollution Control Board"
  },
  {
    id: "site_india_kaziranga",
    name: "Kaziranga National Biosphere Park",
    category: "Wildlife Sanctuary",
    latitude: 26.5775,
    longitude: 93.1711,
    sensitivity: "CRITICAL",
    contactUnit: "Assam Forest & Wildlife Division"
  },
  {
    id: "site_india_western_ghats",
    name: "Nilgiri Biosphere & Mudumalai Reserve",
    category: "Wildlife Sanctuary",
    latitude: 11.5623,
    longitude: 76.5342,
    sensitivity: "CRITICAL",
    contactUnit: "Tamil Nadu & Kerala Inter-state Eco Taskforce"
  },
  {
    id: "site_india_hampi",
    name: "Hampi UNESCO World Heritage Excavations",
    category: "Heritage / Excavation",
    latitude: 15.3350,
    longitude: 76.4600,
    sensitivity: "CRITICAL",
    contactUnit: "Hampi World Heritage Area Management Authority"
  },

  // Global Landmark Ecological & Heritage Zones
  {
    id: "site_world_angkor_wat",
    name: "Angkor Wat Archaeological Biosphere",
    category: "Heritage / Excavation",
    latitude: 13.4125,
    longitude: 103.8670,
    sensitivity: "CRITICAL",
    contactUnit: "APSARA National Heritage Authority"
  },
  {
    id: "site_world_amazon",
    name: "Central Amazon Conservation Complex",
    category: "Wildlife Sanctuary",
    latitude: -2.3333,
    longitude: -61.5000,
    sensitivity: "CRITICAL",
    contactUnit: "ICMBio Rainforest Environmental Protection"
  },
  {
    id: "site_world_yellowstone",
    name: "Yellowstone National Wilderness",
    category: "Wildlife Sanctuary",
    latitude: 44.4280,
    longitude: -110.5885,
    sensitivity: "HIGH",
    contactUnit: "National Park Service Interagency Fire Center"
  },
  {
    id: "site_world_acropolis",
    name: "Acropolis Cultural Monument Buffer",
    category: "Heritage / Excavation",
    latitude: 37.9715,
    longitude: 23.7257,
    sensitivity: "CRITICAL",
    contactUnit: "Hellenic Ministry of Culture & Atmospheric Monitoring"
  }
];
