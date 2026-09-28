"use client";

import React, { useState } from "react";
import { Wind, Play, Sliders, Clock, AlertTriangle, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";

interface SimulationResult {
  origin: { latitude: number; longitude: number };
  target: { latitude: number; longitude: number; distanceKm: number; bearing: number };
  wind: { speedKmh: number; directionDeg: number; smokeHeadingDeg: number };
  predictionMinutes: number;
  travelDistanceKm: number;
  targetRisk: {
    bearingToSite: number;
    isWithinDriftCone: boolean;
    estimatedArrivalMinutes: number | null;
  };
  milestones: Array<{
    minutes: number;
    label: string;
    distanceKm: number;
    severity: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
    summary: string;
  }>;
  affectedProtectedAreas: Array<{
    id: string;
    name: string;
    category: string;
    distanceKm: number;
    isWithinDriftCone: boolean;
    estimatedArrivalMinutes: number | null;
  }>;
}

interface PredictionPanelProps {
  initialFireLat?: number;
  initialFireLon?: number;
  initialWindSpeed?: number;
  initialWindDir?: number;
  onSimulationRun?: (result: SimulationResult | null) => void;
  predictionWindowMinutes: number;
  onPredictionWindowChange: (minutes: number) => void;
}

export function PredictionPanel({
  initialFireLat = 9.8120,
  initialFireLon = 78.1410,
  initialWindSpeed = 18,
  initialWindDir = 225,
  onSimulationRun,
  predictionWindowMinutes,
  onPredictionWindowChange,
}: PredictionPanelProps) {
  const [windSpeed, setWindSpeed] = useState(initialWindSpeed);
  const [windDir, setWindDir] = useState(initialWindDir);
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);

  const runSimulation = async () => {
    setSimLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fireLat: initialFireLat,
          fireLon: initialFireLon,
          windSpeedKmh: windSpeed,
          windDirectionDeg: windDir,
          predictionMinutes: predictionWindowMinutes,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSimResult(data.data);
        setIsSimulatedMode(true);
        if (onSimulationRun) onSimulationRun(data.data);
      }
    } catch (e) {
      console.error("Simulation error:", e);
    } finally {
      setSimLoading(false);
    }
  };

  const resetSimulation = () => {
    setWindSpeed(initialWindSpeed);
    setWindDir(initialWindDir);
    setSimResult(null);
    setIsSimulatedMode(false);
    if (onSimulationRun) onSimulationRun(null);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Trajectory & Drift Prediction
            </h3>
            <p className="text-[11px] text-slate-500">
              Trigonometric expansion & wind vector model
            </p>
          </div>
        </div>

        {isSimulatedMode && (
          <button
            onClick={resetSimulation}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Control Sliders */}
      <div className="space-y-4 text-xs">
        <div>
          <div className="flex items-center justify-between mb-1.5 text-slate-700">
            <span className="font-semibold">Simulated Wind Velocity:</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {windSpeed} km/h
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={windSpeed}
            onChange={(e) => setWindSpeed(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-slate-700">
            <span className="font-semibold">Wind Direction (Blowing Toward):</span>
            <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              {windDir}° (Heading {(windDir + 180) % 360}°)
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="359"
            step="5"
            value={windDir}
            onChange={(e) => setWindDir(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5 text-slate-700">
            <span className="font-semibold">Prediction Timeframe:</span>
            <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
              {predictionWindowMinutes} mins
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[30, 60, 90, 120].map((mins) => (
              <button
                key={mins}
                onClick={() => onPredictionWindowChange(mins)}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  predictionWindowMinutes === mins
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={simLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 mt-2"
        >
          {simLoading ? (
            <span className="flex items-center gap-2">Calculating vectors...</span>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Trajectory</span>
            </>
          )}
        </button>
      </div>

      {/* Trajectory Visual Model */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Trajectory Vector Diagram
        </span>
        <div className="flex items-center justify-between text-xs py-2 px-3 bg-white rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-red-600">
            <span>🔥</span>
            <span>SOURCE</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <span>───</span>
            <span className="text-blue-500 font-bold">💨 {windSpeed}km/h</span>
            <span>───►</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span>🏛️</span>
            <span>HERITAGE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Projected Travel:</span>
            <span className="font-bold text-slate-900 font-mono">
              {((windSpeed * predictionWindowMinutes) / 60).toFixed(1)} km
            </span>
          </div>
          <div className="p-2.5 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-500 block">Expansion Cone:</span>
            <span className="font-bold text-slate-900 font-mono">±30° Envelope</span>
          </div>
        </div>
      </div>
    </div>
  );
}
