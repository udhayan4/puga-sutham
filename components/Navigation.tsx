"use client";

import React from "react";
import {
  LayoutDashboard,
  Map as MapIcon,
  Wind,
  Camera,
  Bell,
  BarChart3,
  Shield,
  History,
  Sparkles,
  Settings,
  Flame,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";

export type NavTab =
  | "overview"
  | "map"
  | "prediction"
  | "reports"
  | "alerts"
  | "analytics"
  | "protected"
  | "history"
  | "insights"
  | "settings";

interface NavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  alertCount: number;
  criticalAlertActive: boolean;
  onOpenEmergencyModal?: () => void;
}

export function Navigation({
  activeTab,
  onTabChange,
  isDemoMode,
  onToggleDemoMode,
  alertCount,
  criticalAlertActive,
  onOpenEmergencyModal,
}: NavigationProps) {
  const navItems: Array<{ id: NavTab; label: string; icon: React.ElementType; badge?: number }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "map", label: "Live Map", icon: MapIcon },
    { id: "prediction", label: "Smoke Prediction", icon: Wind },
    { id: "reports", label: "Citizen Reports", icon: Camera },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "protected", label: "Protected Areas", icon: Shield },
    { id: "history", label: "Incident History", icon: History },
    { id: "insights", label: "AI Insights", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Top Professional Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950 text-slate-100 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-lg shadow-emerald-500/20 font-black tracking-wider text-base">
              PS
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">PUGA SUTHAM</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Early Warning Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Predict smoke before arrival • Verify ground truth • Protect critical heritage
              </p>
            </div>
          </div>

          {/* Quick Actions & Live Indicator */}
          <div className="flex items-center gap-3">
            {/* Critical Alert Button if active */}
            {criticalAlertActive && onOpenEmergencyModal && (
              <button
                onClick={onOpenEmergencyModal}
                className="animate-pulse flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all ring-2 ring-red-400/50"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden md:inline">EMERGENCY ACTIVE</span>
              </button>
            )}

            {/* Demo Mode Toggle */}
            <div className="flex items-center">
              <button
                onClick={onToggleDemoMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all border ${
                  isDemoMode
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600 hover:text-white"
                }`}
                title="Toggle deterministic hackathon demo simulation"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isDemoMode ? "DEMO MODE ON" : "Demo Mode"}</span>
              </button>
            </div>

            {/* Live GPS / Monitoring Badge */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE MONITORING</span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 overflow-x-auto py-1 scrollbar-none" aria-label="Tabs">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Compact Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1 shadow-2xl">
        <div className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all relative ${
                  isActive ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="truncate max-w-[60px]">{item.label}</span>
              </button>
            );
          })}
          {/* Menu for rest on mobile */}
          <button
            onClick={() => onTabChange(activeTab === "protected" ? "analytics" : "protected")}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-semibold transition-all ${
              ["protected", "analytics", "history", "insights", "settings"].includes(activeTab)
                ? "text-emerald-400"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
