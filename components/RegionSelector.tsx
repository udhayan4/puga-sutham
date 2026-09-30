"use client";

import React, { useState } from "react";
import { Globe, MapPin, Search, Navigation, Compass, Check } from "lucide-react";

export interface GeoRegion {
  id: string;
  name: string;
  scope: "INDIA" | "GLOBAL" | "REGIONAL";
  lat: number;
  lon: number;
  zoom: number;
  description: string;
  badge: string;
}

export const MONITORED_REGIONS: GeoRegion[] = [
  {
    id: "india-national",
    name: "All India National Grid",
    scope: "INDIA",
    lat: 20.5937,
    lon: 78.9629,
    zoom: 5,
    description: "National atmospheric corridor & agricultural fire tracking",
    badge: "India Wide",
  },
  {
    id: "madurai-keeladi",
    name: "Tamil Nadu / Madurai-Keeladi",
    scope: "REGIONAL",
    lat: 9.8559,
    lon: 78.1932,
    zoom: 11,
    description: "Heritage excavation perimeter & Vaigai river basin",
    badge: "Regional",
  },
  {
    id: "delhi-ncr",
    name: "Delhi NCR & Northern Plains",
    scope: "INDIA",
    lat: 28.6139,
    lon: 77.2090,
    zoom: 9,
    description: "Capital region stubble drift corridor & industrial buffer",
    badge: "India High Alert",
  },
  {
    id: "punjab-stubble",
    name: "Punjab / Haryana Stubble Zone",
    scope: "INDIA",
    lat: 30.9010,
    lon: 75.8573,
    zoom: 8,
    description: "Active seasonal residue combustion & downwind drift",
    badge: "India Agro",
  },
  {
    id: "world-global",
    name: "World Global Biosphere",
    scope: "GLOBAL",
    lat: 20.0,
    lon: 0.0,
    zoom: 2,
    description: "Global NASA FIRMS satellite fire hotspots & atmospheric monitoring",
    badge: "World",
  },
  {
    id: "amazon-basin",
    name: "Amazon Conservation Reserve",
    scope: "GLOBAL",
    lat: -3.4653,
    lon: -62.2159,
    zoom: 6,
    description: "Equatorial rainforest wildfire & smoke containment",
    badge: "Global Rainforest",
  },
  {
    id: "southeast-asia",
    name: "Southeast Asia / Angkor",
    scope: "GLOBAL",
    lat: 13.4125,
    lon: 103.8670,
    zoom: 7,
    description: "Cultural heritage sites & transboundary haze monitoring",
    badge: "Global Heritage",
  },
];

interface RegionSelectorProps {
  currentRegionId?: string;
  currentLat: number;
  currentLon: number;
  onSelectRegion: (region: GeoRegion) => void;
  onCustomGps: (lat: number, lon: number, name?: string) => void;
}

export function RegionSelector({
  currentRegionId,
  currentLat,
  currentLon,
  onSelectRegion,
  onCustomGps,
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "INDIA" | "GLOBAL" | "REGIONAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const filteredRegions = MONITORED_REGIONS.filter((r) => {
    const matchesFilter = activeFilter === "ALL" || r.scope === activeFilter;
    const matchesQuery =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleUseGps = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocating(false);
          setIsOpen(false);
          onCustomGps(pos.coords.latitude, pos.coords.longitude, "My Current GPS Location");
        },
        (err) => {
          setIsLocating(false);
          alert("Could not access browser location. Please allow GPS permission.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Find currently matched region label
  const activeRegion = MONITORED_REGIONS.find((r) => r.id === currentRegionId) || {
    name: Math.abs(currentLat - 9.8559) < 0.05 ? "Tamil Nadu / Madurai-Keeladi" : `Active Area (${currentLat.toFixed(2)}, ${currentLon.toFixed(2)})`,
    badge: "Active",
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold shadow-xs transition-all hover:border-[#CBD5E1]"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#2563EB]" />
        <span className="max-w-[140px] sm:max-w-[180px] truncate">{activeRegion.name}</span>
        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EFF6FF] text-[#2563EB] font-bold">
          {activeRegion.badge}
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 sm:left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E2E8F0] shadow-xl z-50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">
                  Select Monitoring Sector
                </h4>
                <p className="text-[11px] text-[#64748B]">
                  Switch between India, World, or local protected zones
                </p>
              </div>
              <button
                onClick={handleUseGps}
                disabled={isLocating}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2563EB] text-white text-[11px] font-semibold hover:bg-[#1D4ED8] transition-all disabled:opacity-50"
                title="Detect exact coordinates via device GPS"
              >
                <Navigation className="w-3 h-3" />
                <span>{isLocating ? "Locating..." : "My GPS"}</span>
              </button>
            </div>

            {/* Scope filter pills */}
            <div className="flex items-center gap-1">
              {(["ALL", "INDIA", "GLOBAL", "REGIONAL"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                    activeFilter === filter
                      ? "bg-[#0F172A] text-white"
                      : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Quick search input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search region, state, or country..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Regions list */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
              {filteredRegions.map((region) => {
                const isSelected =
                  currentRegionId === region.id ||
                  (Math.abs(currentLat - region.lat) < 0.05 && Math.abs(currentLon - region.lon) < 0.05);

                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      onSelectRegion(region);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-[#EFF6FF] border-[#BFDBFE]"
                        : "bg-white hover:bg-[#F8FAFC] border-[#E2E8F0]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                        <span className="text-xs font-bold text-[#0F172A]">{region.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#F1F5F9] text-[#475569] font-semibold">
                          {region.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] line-clamp-1">{region.description}</p>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
