"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Wind, Flame, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsDashboardProps {
  isDemoMode: boolean;
}

export function AnalyticsDashboard({ isDemoMode }: AnalyticsDashboardProps) {
  const [range, setRange] = useState<"24h" | "7d" | "30d">("24h");
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}&demo=${isDemoMode ? "true" : "false"}`);
      const json = await res.json();
      if (json.success) {
        setAnalyticsData(json.data);
      }
    } catch (e) {
      console.error("Failed to load analytics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range, isDemoMode]);

  const COLORS = ["#EF4444", "#F97316", "#F59E0B", "#10B981"];

  // Fallback demo chart metrics if backend offline
  const trendData = analyticsData?.trendData || [
    { time: "00:00", fires: 0, alerts: 0 },
    { time: "04:00", fires: 1, alerts: 0 },
    { time: "08:00", fires: 2, alerts: 1 },
    { time: "12:00", fires: 4, alerts: 2 },
    { time: "16:00", fires: 3, alerts: 2 },
    { time: "20:00", fires: 1, alerts: 1 },
  ];

  const pieData = analyticsData?.pieData || [
    { name: "Critical (>70)", value: 2 },
    { name: "High (50-70)", value: 3 },
    { name: "Moderate (30-50)", value: 4 },
    { name: "Nominal (<30)", value: 9 },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header & Range Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Environmental Risk & Drift Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Temporal analysis of agricultural stubble burns, wind vectors, and model lead times.
          </p>
        </div>

        {/* Time Window Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(["24h", "7d", "30d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${
                range === r
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Hotspots</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">11</p>
          <span className="text-[11px] text-slate-500">Sensed via VIIRS</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Advisories Issued</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">5</p>
          <span className="text-[11px] text-slate-500">Downwind alignment</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Early Lead Time</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">34 min</p>
          <span className="text-[11px] text-slate-500">Before smoke entry</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Citizen Ground Truth</span>
            <CheckCircle2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">92%</p>
          <span className="text-[11px] text-slate-500">Edge AI verification rate</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
            Detection & Advisory Velocity
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Thermal anomaly spikes correlated with dispatched warning advisories.
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    borderRadius: "12px",
                    color: "#0F172A",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line type="monotone" dataKey="fires" stroke="#EF4444" strokeWidth={2} name="Hotspots" />
                <Line type="monotone" dataKey="alerts" stroke="#F59E0B" strokeWidth={2} name="Advisories" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">
              Risk Level Distribution
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Buffer zones segmented by threat score.
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E8F0",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-4 border-t border-slate-100">
            {pieData.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
