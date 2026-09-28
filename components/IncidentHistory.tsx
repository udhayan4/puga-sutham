"use client";

import React, { useState } from "react";
import { History, Search, Filter, AlertTriangle, ShieldCheck, Calendar, Eye, FileText, CheckCircle2 } from "lucide-react";

export interface IncidentRecord {
  id: string;
  date: string;
  location: string;
  fireSource: string;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  etaMinutes: number | null;
  citizenReportsCount: number;
  verificationStatus: "VERIFIED" | "NEEDS_REVIEW" | "REJECTED";
  status: "ACTIVE" | "RESOLVED" | "DISSIPATED";
  details?: string;
}

interface IncidentHistoryProps {
  isDemoMode: boolean;
  onViewIncident?: (incident: IncidentRecord) => void;
}

export function IncidentHistory({ isDemoMode, onViewIncident }: IncidentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("ALL");
  const [selectedIncident, setSelectedIncident] = useState<IncidentRecord | null>(null);

  // Recorded historical incidents
  const incidents: IncidentRecord[] = [
    {
      id: "INC-2026-089",
      date: "2026-09-28 10:31",
      location: "Silaiman West Agricultural Sector",
      fireSource: "NASA VIIRS Satellite Hotspot",
      riskLevel: "CRITICAL",
      etaMinutes: 34,
      citizenReportsCount: 3,
      verificationStatus: "VERIFIED",
      status: "ACTIVE",
      details: "High-intensity stubble burning hotspot detected 8.4 km Southwest of Keeladi. Sustained 18 km/h Southwesterly winds propelled dense smoke directly toward heritage excavation trenches.",
    },
    {
      id: "INC-2026-088",
      date: "2026-09-27 15:40",
      location: "Tirupuvanam East Agricultural Zone",
      fireSource: "Citizen Photographic Sighting",
      riskLevel: "HIGH",
      etaMinutes: 48,
      citizenReportsCount: 2,
      verificationStatus: "VERIFIED",
      status: "RESOLVED",
      details: "Small agricultural waste burn reported by local ranger. Controlled containment prevented smoke entry into school perimeters.",
    },
    {
      id: "INC-2026-087",
      date: "2026-09-26 12:20",
      location: "Madurai South Rural Boundary",
      fireSource: "NASA VIIRS Satellite",
      riskLevel: "MODERATE",
      etaMinutes: 62,
      citizenReportsCount: 1,
      verificationStatus: "VERIFIED",
      status: "RESOLVED",
      details: "Moderate biomass burn with crosswind trajectory. Smoke dissipated naturally before crossing primary buffer boundary.",
    },
    {
      id: "INC-2026-086",
      date: "2026-09-24 09:15",
      location: "Keeladi North Orchard Buffer",
      fireSource: "NASA FIRMS Thermal",
      riskLevel: "LOW",
      etaMinutes: null,
      citizenReportsCount: 0,
      verificationStatus: "VERIFIED",
      status: "DISSIPATED",
      details: "Low thermal signature without downwind drift alignment. Dispersed safely within 45 minutes.",
    },
  ];

  const filteredIncidents = incidents.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fireSource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === "ALL" || item.riskLevel === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "MODERATE":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-red-50 text-red-700 border-red-200 font-bold animate-pulse";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Incident Audit Log & History
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Immutable log of detected fire anomalies, calculated trajectory models, and dispatched advisories.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 transition-colors"
            />
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MODERATE">Moderate</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Incident Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5">Incident ID</th>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Origin Location</th>
                <th className="px-5 py-3.5">Source Feed</th>
                <th className="px-5 py-3.5">Risk Level</th>
                <th className="px-5 py-3.5">ETA</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{inc.id}</td>
                  <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">{inc.date}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{inc.location}</td>
                  <td className="px-5 py-4 text-slate-500">{inc.fireSource}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getRiskBadge(inc.riskLevel)}`}>
                      {inc.riskLevel}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-slate-800">
                    {inc.etaMinutes ? `~${inc.etaMinutes}m` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(inc.status)}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedIncident(inc)}
                      className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-slate-900">{selectedIncident.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRiskBadge(selectedIncident.riskLevel)}`}>
                  {selectedIncident.riskLevel}
                </span>
              </div>
              <button
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-1 font-semibold">Incident Narrative & Atmospheric Assessment:</span>
                <p className="text-slate-800 leading-relaxed">{selectedIncident.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Origin Location:</span>
                  <span className="font-bold text-slate-900">{selectedIncident.location}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">Primary Telemetry:</span>
                  <span className="font-bold text-slate-900">{selectedIncident.fireSource}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Citizen Reports Corroborated: <strong>{selectedIncident.citizenReportsCount}</strong></span>
                <span className="flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedIncident(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
