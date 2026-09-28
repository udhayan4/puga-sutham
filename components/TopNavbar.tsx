"use client";

import React, { useState } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  Shield,
  RotateCcw,
  Play,
  FileCheck,
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
  | "history";

interface TopNavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  incident: IncidentState;
  onRunDemoScenario: () => void;
  onResetIncident: () => void;
  isScenarioRunning: boolean;
}

export function TopNavbar({
  activeTab,
  onTabChange,
  incident,
  onRunDemoScenario,
  onResetIncident,
  isScenarioRunning,
}: TopNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks: Array<{ id: NavTab; label: string; badge?: number }> = [
    { id: "overview", label: "Overview" },
    { id: "map", label: "Live Monitor" },
    { id: "prediction", label: "Prediction" },
    { id: "reports", label: "Reports", badge: incident.citizenReportsCount },
    { id: "protected", label: "Protected Areas", badge: 5 },
    { id: "alerts", label: "Alerts", badge: incident.activeAlerts.length },
    { id: "analytics", label: "Analytics" },
    { id: "history", label: "Incident History" },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#E2E8F0] h-16 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Brand: PUGA SUTHAM alone without AI Heritage subtitle */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleSelectTab("overview")}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 text-[#2563EB] flex items-center justify-center font-black text-xs shadow-xs">
              PS
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-[#0F172A] block leading-tight">
                PUGA SUTHAM
              </span>
            </div>
          </button>

          {/* Desktop Horizontal Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative px-3 py-2 text-xs font-semibold rounded-md transition-all duration-150 ${
                    isActive
                      ? "text-[#0F172A] font-bold"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-[#F1F5F9] text-[#475569] font-bold">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#2563EB] rounded-full transition-all" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Live Pulse Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-medium text-[#475569]">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] status-pulse"></span>
            <span className="text-[11px]">System Online</span>
          </div>

          {/* Demo Report Shortcut */}
          <button
            onClick={() => handleSelectTab("reports")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-all shadow-xs"
            title="Open Citizen Reports & AI Classifier"
          >
            <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Demo Report</span>
          </button>

          {/* Run Demo Trigger */}
          <button
            onClick={onRunDemoScenario}
            disabled={isScenarioRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
            title="Run simulated incident flow"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isScenarioRunning ? "Running Demo..." : "Run Demo"}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={onResetIncident}
            className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] transition-all shadow-xs"
            title="Reset incident state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E2E8F0] px-4 py-3 space-y-1 shadow-sm transition-all animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#F8FAFC] text-[#0F172A] font-bold border-l-2 border-[#2563EB]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#F1F5F9] text-[#475569] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
