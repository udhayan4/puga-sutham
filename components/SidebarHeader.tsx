"use client";

import React from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  Wind,
  Camera,
  Shield,
  Bell,
  BarChart3,
  History,
  Sparkles,
  Play,
  RotateCcw,
  Radio,
} from "lucide-react";
import { IncidentState } from "../lib/incident-engine";

export type NavTab =
  | "overview"
  | "map"
  | "prediction"
  | "reports"
  | "protected"
  | "alerts"
  | "analytics"
  | "history"
  | "insights";

interface SidebarHeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  incident: IncidentState;
  onRunDemoScenario: () => void;
  onResetIncident: () => void;
  isScenarioRunning: boolean;
}

export function SidebarHeader({
  activeTab,
  onTabChange,
  incident,
  onRunDemoScenario,
  onResetIncident,
  isScenarioRunning,
}: SidebarHeaderProps) {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: number }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "map", label: "Live Monitoring", icon: MapIcon },
    { id: "prediction", label: "Smoke Prediction", icon: Wind },
    { id: "reports", label: "Citizen Reports", icon: Camera, badge: incident.citizenReportsCount },
    { id: "protected", label: "Protected Areas", icon: Shield, badge: 5 },
    { id: "alerts", label: "Alert Center", icon: Bell, badge: incident.activeAlerts.length },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "Incident History", icon: History },
    { id: "insights", label: "AI Insights", icon: Sparkles },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left Navigation) */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-30 shadow-xs">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 text-slate-800 flex items-center justify-center font-black text-lg shadow-xs">
              PS
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-tight text-slate-900">
                PUGA SUTHAM
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                AI Heritage Safety Platform
              </p>
            </div>
          </div>
        </div>

        {/* Demo Scenario Action Bar */}
        <div className="p-3 mx-3 mt-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-slate-700" />
              {incident.status === "IDLE" ? "MONITORING IDLE" : "SIMULATION ACTIVE"}
            </span>
            {incident.isDemoActive && (
              <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                DEMO
              </span>
            )}
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={onRunDemoScenario}
              disabled={isScenarioRunning}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-[11px] font-bold shadow-xs transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 text-slate-700" />
              <span>{isScenarioRunning ? "Running..." : "Run Demo"}</span>
            </button>
            <button
              onClick={onResetIncident}
              className="py-2 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-[11px] font-semibold transition-all shadow-xs"
              title="Reset to clean baseline state"
            >
              <RotateCcw className="w-3 h-3 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-slate-900" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? "bg-white text-slate-800 border border-slate-200" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom System Status */}
        <div className="p-4 border-t border-slate-100 space-y-2 text-xs bg-white">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-[11px] font-medium">System Status:</span>
            <span className="font-bold text-slate-800 text-[11px]">
              Operational
            </span>
          </div>
          <div className="text-[10px] text-slate-400">
            Heritage Safety Node #TN-04
          </div>
        </div>
      </aside>

      {/* Top Header Bar for Desktop & Mobile */}
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 lg:pl-64 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-800 font-black text-sm">
              PS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 capitalize">
                  {activeTab.replace("-", " ")}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                  {incident.status === "IDLE" ? "PERIMETER SECURE" : `${incident.riskLevel} RISK ADVISORY`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Protected Zone: Keeladi Excavation Site • 5 Sensitive Receptors Monitored
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 text-xs">
            {incident.status !== "IDLE" && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-[11px] shadow-xs">
                <span>ETA: ~{incident.etaMinutes}m</span>
              </div>
            )}

            <button
              onClick={onRunDemoScenario}
              className="lg:hidden px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 font-bold text-xs"
            >
              Demo
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden border-t border-slate-100 px-3 py-1.5 flex gap-1 overflow-x-auto scrollbar-none bg-white">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-semibold transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-900 border border-slate-300 font-bold shadow-xs"
                    : "text-slate-600 bg-white border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>
    </>
  );
}
