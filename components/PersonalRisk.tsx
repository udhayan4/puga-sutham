"use client";

import React, { useState } from "react";
import { ShieldAlert, MapPin, Wind, Flame, Clock, HeartPulse, Home, Compass, ShieldCheck } from "lucide-react";
import { LocateMeButton } from "./LocateMeButton";

interface PersonalRiskProps {
  currentLat: number;
  currentLon: number;
  isCustomLocation: boolean;
  riskScore: number;
  riskState: string;
  nearestFireDist: number | null;
  etaMinutes: number | null;
  windSpeedKmh: number;
  windDirectionDeg: number;
}

export function PersonalRisk({
  currentLat,
  currentLon,
  isCustomLocation,
  riskScore,
  riskState,
  nearestFireDist,
  etaMinutes,
  windSpeedKmh,
  windDirectionDeg,
}: PersonalRiskProps) {
  const getRiskDetails = () => {
    if (riskScore >= 70) {
      return {
        level: "CRITICAL RISK",
        color: "text-red-600",
        badge: "bg-red-100 text-red-800 border-red-200",
        prediction: "Dense agricultural smoke plume is moving directly toward your sector.",
        actions: [
          "Close all doors and windows to minimize particulate infiltration.",
          "Postpone outdoor sports, training, and open-air activities.",
          "Use N95 or multi-layered masks if required to step outdoors.",
          "Keep sensitive individuals (asthma, elderly) in well-sealed rooms."
        ]
      };
    }
    if (riskScore >= 40) {
      return {
        level: "MODERATE RISK",
        color: "text-amber-600",
        badge: "bg-amber-100 text-amber-800 border-amber-200",
        prediction: "Smoke dispersion cone is in proximity. Changing wind vectors may affect you.",
        actions: [
          "Monitor live map updates for wind direction shifts.",
          "Ensure ventilation filters are clean and sealed.",
          "Limit prolonged outdoor exposure for children."
        ]
      };
    }
    return {
      level: "LOW RISK / NOMINAL",
      color: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      prediction: "No active smoke drift cones are aligned with your geographical coordinates.",
      actions: [
        "Normal outdoor activities and excavation tours permitted.",
        "Sensory monitors and perimeter radars remain on standard active standby."
      ]
    };
  };

  const risk = getRiskDetails();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Local Sector Environmental Vulnerability
            </h3>
            <p className="text-[11px] text-slate-500">
              Personalized receptor assessment based on GPS proximity & drift models
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocateMeButton />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Current Threat Level
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${risk.badge}`}>
                {risk.level}
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium mb-4">
              {risk.prediction}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/80 text-[11px]">
            <div>
              <span className="text-slate-500 block">Distance to Anomaly:</span>
              <span className="font-bold text-slate-900 font-mono">
                {nearestFireDist ? `${nearestFireDist.toFixed(1)} km` : "Clean"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Projected ETA:</span>
              <span className="font-bold text-slate-900 font-mono">
                {etaMinutes ? `~${etaMinutes} mins` : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <HeartPulse className="w-4 h-4 text-red-500" />
            Standard Safety & Mitigation Measures
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {risk.actions.map((act, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-snug">{act}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
