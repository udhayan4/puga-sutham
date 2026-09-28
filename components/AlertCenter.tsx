"use client";

import React, { useState } from "react";
import { Bell, AlertTriangle, ShieldCheck, CheckCircle2, MapPin, Wind, Clock, Filter, Eye } from "lucide-react";

export interface AlertCardItem {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE" | "LOW";
  title: string;
  location: string;
  fireSource: string;
  distanceKm: number;
  windSpeedKmh: number;
  windDirectionLabel: string;
  etaMinutes: number | null;
  createdTime: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  signals: {
    satelliteConfirmed: boolean;
    citizenConfirmed: boolean;
    coneAligned: boolean;
  };
}

interface AlertCenterProps {
  alerts: AlertCardItem[];
  onViewOnMap?: (alert: AlertCardItem) => void;
}

export function AlertCenter({ alerts, onViewOnMap }: AlertCenterProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [alertList, setAlertList] = useState<AlertCardItem[]>(alerts);

  const filterOptions = ["ALL", "CRITICAL", "HIGH", "MODERATE", "RESOLVED"];

  const filteredAlerts = alertList.filter((a) => {
    if (filter === "ALL") return true;
    if (filter === "RESOLVED") return a.status === "RESOLVED";
    return a.severity === filter && a.status !== "RESOLVED";
  });

  const acknowledgeAlert = (id: string) => {
    setAlertList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "ACKNOWLEDGED" as const } : a))
    );
  };

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return {
          badge: "bg-red-100 text-red-800 border-red-200",
          cardBorder: "border-red-200 bg-red-50/20",
          iconColor: "text-red-600",
        };
      case "HIGH":
        return {
          badge: "bg-orange-100 text-orange-800 border-orange-200",
          cardBorder: "border-orange-200 bg-orange-50/20",
          iconColor: "text-orange-600",
        };
      case "MODERATE":
        return {
          badge: "bg-amber-100 text-amber-800 border-amber-200",
          cardBorder: "border-amber-200 bg-amber-50/20",
          iconColor: "text-amber-600",
        };
      default:
        return {
          badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
          cardBorder: "border-slate-200 bg-white",
          iconColor: "text-emerald-600",
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Alert Center Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-600">
              <Bell className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Emergency Alert Dispatch Center
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time multi-channel incident advisories dispatched to conservators, schools, and civic responders.
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex flex-wrap gap-1.5">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === opt
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Cards */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No Alerts in Selected Category</h3>
            <p className="text-xs text-slate-500 mt-1">
              All monitored buffers and perimeter zones are currently within safe atmospheric parameters.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const style = getSeverityStyle(alert.severity);
            return (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 transition-all shadow-sm ${style.cardBorder}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl bg-white border border-slate-200 ${style.iconColor} shrink-0`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${style.badge}`}>
                          {alert.severity}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          {alert.id}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          • Issued {alert.createdTime}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1">
                        {alert.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {alert.status === "ACTIVE" && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.status === "ACKNOWLEDGED" && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Acknowledged
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-xl p-3 text-xs mb-3 border border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Target Sector:</span>
                    <span className="font-bold text-slate-900 line-clamp-1">{alert.location}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Source Origin:</span>
                    <span className="font-semibold text-slate-800 line-clamp-1">{alert.fireSource}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Lead Time (ETA):</span>
                    <span className="font-mono font-bold text-red-600">
                      ~{alert.etaMinutes ? `${alert.etaMinutes} mins` : "Immediate"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Wind Vector:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {alert.windSpeedKmh} km/h {alert.windDirectionLabel}
                    </span>
                  </div>
                </div>

                {/* Evidence signal indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Satellite Thermal Match
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Atmospheric Vector Aligned
                    </span>
                  </div>

                  {onViewOnMap && (
                    <button
                      onClick={() => onViewOnMap(alert)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Incident on Map</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
