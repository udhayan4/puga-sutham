"use client";

import React, { useState } from "react";
import { Shield, MapPin, AlertTriangle, CheckCircle2, ChevronRight, School, Building2, Trees, Clock } from "lucide-react";
import { PROTECTED_AREAS, ProtectedArea } from "../lib/protected-areas";
import { calculateDistance, calculateDriftRisk } from "../lib/drift";

interface ProtectedAreasProps {
  windSpeedKmh: number;
  windDirectionDeg: number;
  fires: Array<{ latitude: number; longitude: number }>;
  onSelectAreaOnMap?: (lat: number, lon: number) => void;
}

export function ProtectedAreas({
  windSpeedKmh,
  windDirectionDeg,
  fires,
  onSelectAreaOnMap,
}: ProtectedAreasProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const categories = ["ALL", "Heritage / Excavation", "School / College", "Hospital", "Wildlife Sanctuary"];

  const filteredAreas = selectedCategory === "ALL"
    ? PROTECTED_AREAS
    : PROTECTED_AREAS.filter(a => a.category === selectedCategory);

  // Compute live threat analysis for each area
  const evaluatedAreas = filteredAreas.map(area => {
    let nearestFireDist = Infinity;
    let minEta: number | null = null;
    let isThreatened = false;

    for (const fire of fires) {
      const dist = calculateDistance(fire.latitude, fire.longitude, area.latitude, area.longitude);
      if (dist < nearestFireDist) nearestFireDist = dist;

      const drift = calculateDriftRisk(fire.latitude, fire.longitude, area.latitude, area.longitude, windDirectionDeg, windSpeedKmh);
      if (drift.isWithinDriftCone) {
        isThreatened = true;
        if (drift.estimatedArrivalMinutes !== null) {
          if (minEta === null || drift.estimatedArrivalMinutes < minEta) {
            minEta = drift.estimatedArrivalMinutes;
          }
        }
      }
    }

    return {
      ...area,
      nearestFireDist: nearestFireDist === Infinity ? null : nearestFireDist,
      isThreatened,
      minEta,
    };
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "School / College":
        return <School className="w-4 h-4 text-amber-600" />;
      case "Hospital":
        return <Building2 className="w-4 h-4 text-red-600" />;
      case "Wildlife Sanctuary":
        return <Trees className="w-4 h-4 text-emerald-600" />;
      default:
        return <Shield className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & Category Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Monitored Protected Zones & Receptors
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time buffer monitoring across {PROTECTED_AREAS.length} designated sensitive cultural and public receptors.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {evaluatedAreas.map((area) => (
          <div
            key={area.id}
            className={`bg-white rounded-2xl border p-5 transition-all shadow-sm hover:shadow-md ${
              area.isThreatened
                ? "border-amber-300 ring-1 ring-amber-200/50"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                  {getCategoryIcon(area.category)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{area.name}</h3>
                  <span className="text-[11px] text-slate-500">{area.category}</span>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  area.isThreatened
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                }`}
              >
                {area.isThreatened ? "HIGH RISK" : "NOMINAL"}
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-4 line-clamp-2">
              Designated {area.category.toLowerCase()} buffer with real-time atmospheric sensor monitoring.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs py-3 border-t border-slate-100 mb-4 bg-slate-50/50 rounded-xl p-2.5">
              <div>
                <span className="text-[11px] text-slate-500 block">Distance to Fire:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {area.nearestFireDist ? `${area.nearestFireDist.toFixed(1)} km` : "Clean (>50km)"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Arrival ETA:</span>
                <span className={`font-bold font-mono ${area.minEta ? "text-amber-600" : "text-slate-700"}`}>
                  {area.minEta ? `~${area.minEta} mins` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Sensitivity:</span>
                <span className="font-semibold text-slate-700">{area.sensitivity}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Monitoring:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                Contact: <strong className="text-slate-700 font-medium">{area.contactUnit || "Control Room"}</strong>
              </span>

              {onSelectAreaOnMap && (
                <button
                  onClick={() => onSelectAreaOnMap(area.latitude, area.longitude)}
                  className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <span>Locate</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
