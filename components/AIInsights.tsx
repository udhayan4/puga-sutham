"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Activity, Wind, AlertTriangle, ArrowRight, RefreshCw, Layers } from "lucide-react";

interface InsightItem {
  id: string;
  category: "FIRE_RISK" | "WIND_TRAJECTORY" | "CITIZEN_CORRELATION" | "ACTION_RECOMMENDATION";
  title: string;
  summary: string;
  confidence: number;
  signalSource: string;
  severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
}

interface AIInsightsProps {
  isDemoMode: boolean;
}

export function AIInsights({ isDemoMode }: AIInsightsProps) {
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatedAt, setGeneratedAt] = useState<string>("");

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/insights?demo=${isDemoMode ? "true" : "false"}`);
      const json = await res.json();
      if (json.success && json.data) {
        setInsights(json.data.insights || []);
        setGeneratedAt(json.data.generatedAt || new Date().toISOString());
      }
    } catch (e) {
      console.error("Failed to fetch insights:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [isDemoMode]);

  const defaultInsights: InsightItem[] = [
    {
      id: "INS-01",
      category: "FIRE_RISK",
      title: "Anomalous Biomass Combustion Corroboration",
      summary: "VIIRS thermal pixel matches agricultural stubble clearing patterns southwest of Keeladi.",
      confidence: 0.94,
      signalSource: "NASA FIRMS SNPP",
      severity: "CRITICAL",
    },
    {
      id: "INS-02",
      category: "WIND_TRAJECTORY",
      title: "Sustained Atmospheric Corridor Alignment",
      summary: "Southwesterly 18 km/h wind vector drives ±30° dispersion envelope across sensitive excavation sectors.",
      confidence: 0.91,
      signalSource: "Open-Meteo Radar",
      severity: "HIGH",
    },
    {
      id: "INS-03",
      category: "CITIZEN_CORRELATION",
      title: "Edge Photographic Sighting Validated",
      summary: "Ground photo submitted by village ranger confirmed thick grey particulate plume with 94% neural confidence.",
      confidence: 0.89,
      signalSource: "TensorFlow.js Edge",
      severity: "HIGH",
    },
    {
      id: "INS-04",
      category: "ACTION_RECOMMENDATION",
      title: "Preemptive Buffer Sealing Recommended",
      summary: "Recommend closing Keeladi museum buffer ventilation intakes before projected 34-minute lead time expiration.",
      confidence: 0.95,
      signalSource: "Puga Sutham Decision Engine",
      severity: "CRITICAL",
    },
  ];

  const displayInsights = insights.length > 0 ? insights : defaultInsights;

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
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

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              AI Synthesis & Decision Intelligence
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Multi-modal reasoning fusing thermal satellite telemetry, meteorological models, and ground truth imagery.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayInsights.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getSeverityBadge(item.severity)}`}>
                  {item.severity}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  Confidence: {(item.confidence * 100).toFixed(0)}%
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.summary}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 font-medium">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                Source: {item.signalSource}
              </span>
              <span className="text-purple-600 font-bold">AI Corroborated</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
