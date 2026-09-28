"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, XCircle, Info, ShieldCheck } from "lucide-react";

interface EvidenceSignals {
  hasFireDetected: boolean;
  hasWindAligned: boolean;
  hasDriftIntersection: boolean;
  hasWarningDistance: boolean;
  hasCitizenReports: boolean;
  evidenceConfidence: number;
}

interface WhyThisAlertProps {
  evidence: EvidenceSignals;
  fireDistanceKm?: number | null;
  windSpeedKmh?: number;
  windHeadingDeg?: number;
  etaMinutes?: number | null;
}

export function WhyThisAlert({
  evidence,
  fireDistanceKm,
  windSpeedKmh,
  windHeadingDeg,
  etaMinutes,
}: WhyThisAlertProps) {
  const [isOpen, setIsOpen] = useState(true);

  const signals = [
    {
      title: "Active Thermal Hotspot Detected",
      description: "NASA VIIRS Thermal Instrument identified high-temperature anomaly.",
      status: evidence.hasFireDetected,
      activeNote: fireDistanceKm ? `${fireDistanceKm.toFixed(1)} km from heritage zone` : "Active anomaly in 50km radius",
    },
    {
      title: "Wind Vector Toward Protected Zone",
      description: "Surface atmospheric vectors show velocity oriented toward sensitive receptors.",
      status: evidence.hasWindAligned,
      activeNote: windSpeedKmh ? `${Math.round(windSpeedKmh)} km/h velocity vector` : "Corridor aligned",
    },
    {
      title: "Trigonometric Plume Cone Intersection",
      description: "Mathematical dispersion model (±30° cone) directly encloses the protected perimeter.",
      status: evidence.hasDriftIntersection,
      activeNote: etaMinutes ? `Projected arrival in ~${etaMinutes} min` : "Plume envelope intersects target",
    },
    {
      title: "Distance Within Critical Dispersion Range",
      description: "Combustion origin is inside the high-impact environmental threshold (<30 km).",
      status: evidence.hasWarningDistance,
      activeNote: "Within direct exposure boundary",
    },
    {
      title: "Ground Citizen / Ranger Verification",
      description: "Edge neural network & field observation photo corroborated smoke sighting.",
      status: evidence.hasCitizenReports,
      activeNote: evidence.hasCitizenReports ? "Verified by ground field sighting" : "Awaiting ground verification",
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between hover:bg-slate-100/70 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Why is this area at risk?
            </h3>
            <p className="text-[11px] text-slate-500">
              Deterministic environmental multi-signal attribution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-sm">
            <span>Overall Confidence:</span>
            <span className="text-emerald-600 font-bold">{evidence.evidenceConfidence}%</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-5 space-y-3 bg-white">
          <div className="grid grid-cols-1 gap-2.5">
            {signals.map((sig, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                  sig.status
                    ? "bg-amber-50/40 border-amber-200/80 text-slate-900"
                    : "bg-slate-50 border-slate-200/60 text-slate-500 opacity-75"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {sig.status ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900">{sig.title}</h4>
                    {sig.status && (
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100/80 text-amber-800 self-start">
                        {sig.activeNote}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{sig.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Multi-source sensor fusion validated
            </span>
            <span className="text-[10px] text-slate-400">NASA VIIRS + Open-Meteo + Edge AI</span>
          </div>
        </div>
      )}
    </div>
  );
}
