"use client";

import React, { useState } from "react";
import { Settings, Shield, Key, Bell, Database, RefreshCw, CheckCircle2, Server, Eye } from "lucide-react";

interface SettingsPanelProps {
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
}

export function SettingsPanel({ isDemoMode, onToggleDemoMode }: SettingsPanelProps) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [criticalNotifications, setCriticalNotifications] = useState(true);
  const [selectedModel, setSelectedModel] = useState("Local Teachable Machine Edge Model");
  const [cacheStatus, setCacheStatus] = useState("Upstash Redis Active (TTL 20m)");

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Settings className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-white uppercase">
              System Settings & Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Telemetry poll intervals, caching policies, hardware edge acceleration, and presentation simulation flags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Presentation & Demo Mode */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Hackathon Presentation Mode
            </h3>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Deterministic Demo Mode</p>
              <p className="text-[11px] text-slate-400">
                Load calibrated Silaiman-Keeladi fire and wind scenarios without depending on live NASA satellite latency.
              </p>
            </div>
            <button
              onClick={onToggleDemoMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                isDemoMode
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {isDemoMode ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Automatic 15-Minute Sensor Refresh</p>
              <p className="text-[11px] text-slate-400">
                Continuously poll Open-Meteo & recalculate drift cones in the background.
              </p>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                autoRefresh
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
            >
              {autoRefresh ? "ACTIVE" : "PAUSED"}
            </button>
          </div>
        </div>

        {/* Backend & Security Parameters */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Telemetry & Engine Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Database Engine</span>
                <p className="font-bold text-slate-200 mt-0.5">Turso libSQL Distributed Cluster</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Connected
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Rate Limiter & Cache</span>
                <p className="font-bold text-slate-200 mt-0.5">{cacheStatus}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">AI Vision Engine</span>
                <p className="font-bold text-slate-200 mt-0.5">{selectedModel}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Offline Edge
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
