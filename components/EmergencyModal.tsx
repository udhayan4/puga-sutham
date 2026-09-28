"use client";

import React from "react";
import { AlertOctagon, PhoneCall, Radio, ShieldAlert, ArrowRight, CheckCircle2 } from "lucide-react";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  etaMinutes?: number | null;
  fireDistanceKm?: number | null;
  windSpeedKmh?: number;
  affectedSitesCount?: number;
}

export function EmergencyModal({
  isOpen,
  onClose,
  etaMinutes,
  fireDistanceKm,
  windSpeedKmh,
  affectedSitesCount = 3,
}: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white border border-[#E2E8F0] rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Urgent Header */}
        <div className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
                Emergency Standard Operating Procedure
              </h2>
              <p className="text-xs text-[#64748B] font-medium">
                Active High-Risk Smoke Drift Trajectory Advisory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] text-sm font-bold px-2.5 py-1 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC]"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 text-[#0F172A]">
          <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-900">
                Ground-Level Particulate Plume Trajectory
              </h3>
              <p className="text-xs text-red-800/80 mt-1 leading-relaxed">
                Atmospheric drift calculations project agricultural combustion smoke reaching target coordinates in{" "}
                <strong className="underline decoration-red-400">~{etaMinutes || 34} minutes</strong>. Source origin is{" "}
                <strong>{fireDistanceKm ? `${fireDistanceKm.toFixed(1)} km` : "8.4 km"}</strong> upwind at {windSpeedKmh || 18} km/h.
              </p>
            </div>
          </div>

          {/* Action Checklist */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
              Mandatory Conservator Action Checklist:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Trigger HVAC and intake vent shutoff across museum trenches.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct excavation staff and field researchers to indoor assembly zones.</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dispatch automated advisory notice to {affectedSitesCount} perimeter educational receptors.</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Action */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Contact Control Room</span>
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Acknowledge & Close</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
