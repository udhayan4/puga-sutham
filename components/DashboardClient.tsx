"use client";

import React, { useState } from "react";
import {
  Flame,
  Wind,
  Bell,
  MapPin,
  Clock,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Info,
  Radio
} from "lucide-react";
import { MapWrapper } from "./MapWrapper";
import { WhyThisAlert } from "./WhyThisAlert";
import { PredictionPanel } from "./PredictionPanel";
import { PhotoUpload } from "./PhotoUpload";
import { AlertCenter } from "./AlertCenter";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { ProtectedAreas } from "./ProtectedAreas";
import { IncidentHistory } from "./IncidentHistory";
import { AIInsights } from "./AIInsights";
import { PersonalRisk } from "./PersonalRisk";
import { EmergencyModal } from "./EmergencyModal";
import { TopNavbar, NavTab } from "./TopNavbar";
import {
  IncidentState,
  IDLE_INCIDENT_STATE,
  ACTIVE_DEMO_INCIDENT_STATE,
} from "../lib/incident-engine";
import { DEMO_DATASET } from "../lib/demo-data";

interface DashboardClientProps {
  initialData: {
    fires: any[];
    smokeReports: any[];
    clearReports: any[];
    currentWind: { windSpeedKmh: number; windDirectionDeg: number; recordedAt?: string };
    siteLat: number;
    siteLon: number;
    isCustomLocation: boolean;
    riskResult: any;
  };
}

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<NavTab>("overview");
  const [predictionWindow, setPredictionWindow] = useState<number>(60);
  const [simResult, setSimResult] = useState<any>(null);
  const [selectedFire, setSelectedFire] = useState<any>(null);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isScenarioRunning, setIsScenarioRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // Single Centralized Source of Truth for Incident & Threat Status
  const [incident, setIncident] = useState<IncidentState>(ACTIVE_DEMO_INCIDENT_STATE);

  // 10-Step Automated Demo Scenario Sequence
  const runDemoScenario = () => {
    setIsScenarioRunning(true);
    setDemoStep(1);

    // Step 1: Detect source
    setIncident({
      ...IDLE_INCIDENT_STATE,
      id: "INC-2026-DEMO",
      status: "DETECTED",
      riskLevel: "MODERATE",
      title: "Step 1/10: Thermal Hotspot Sensed via Satellite",
      summary: "NASA VIIRS flagged high-confidence agricultural stubble combustion hotspot southwest of Keeladi.",
      fireSource: {
        id: "demo_fire_1",
        latitude: 9.8120,
        longitude: 78.1410,
        locationName: "Silaiman West Agricultural Sector",
        confidence: 0.94,
        type: "thermal_satellite_detection",
      },
      distanceKm: 8.4,
      isDemoActive: true,
    });

    // Step 2-4: Wind vector & Trajectory prediction
    setTimeout(() => {
      setDemoStep(3);
      setIncident((prev) => ({
        ...prev,
        status: "ANALYZING",
        riskLevel: "HIGH",
        title: "Step 3/10: Atmospheric Wind Alignment & Trajectory Calculated",
        summary: "18 km/h Southwesterly wind vector aligns ±30° smoke drift cone directly toward Keeladi excavation trenches.",
        wind: {
          speedKmh: 18,
          directionDeg: 225,
          compassHeading: "SW (225°)",
          recordedAt: "Live Telemetry",
        },
        smoke: {
          headingDeg: 45,
          spreadDegrees: 30,
          projectedTravelKm: 18.0,
        },
        etaMinutes: 34,
      }));
    }, 2500);

    // Step 5-7: Risk calculation & Alert Generation
    setTimeout(() => {
      setDemoStep(6);
      setIncident((prev) => ({
        ...prev,
        status: "ADVISORY",
        riskLevel: "HIGH",
        title: "Step 6/10: Protected Area Intersection — Advisory Dispatched",
        summary: "Smoke drift plume projected to reach Keeladi Heritage Zone in 34 minutes. Notification dispatched.",
        activeAlerts: [
          {
            id: "ALT-2026-001",
            severity: "CRITICAL",
            title: "Smoke Drift Approaching Heritage Excavation",
            location: "Keeladi Excavation Site & Museum",
            etaMinutes: 34,
            createdTime: "Just now",
            status: "ACTIVE",
            distanceKm: 8.4,
            windSpeedKmh: 18,
            windDirectionLabel: "NE",
          },
          {
            id: "ALT-2026-002",
            severity: "HIGH",
            title: "Secondary Plume Exposure Warning",
            location: "Silaiman Govt Higher Secondary School",
            etaMinutes: 22,
            createdTime: "Just now",
            status: "ACTIVE",
            distanceKm: 6.2,
            windSpeedKmh: 18,
            windDirectionLabel: "NE",
          },
        ],
        signals: {
          satelliteConfidence: 0.94,
          windConfidence: 0.91,
          trajectoryConfidence: 0.88,
          citizenVerification: "PENDING",
          overallConfidence: 0.89,
          hasFireDetected: true,
          hasWindAligned: true,
          hasDriftIntersection: true,
          hasWarningDistance: true,
          hasCitizenReports: false,
        },
      }));
    }, 5500);

    // Step 8-9: Citizen ground report & Ground Truth Verification
    setTimeout(() => {
      setDemoStep(8);
      setIncident((prev) => ({
        ...prev,
        status: "VERIFIED",
        title: "Step 8/10: Ground Photographic Sighting Verified via Edge AI",
        summary: "Village field observer uploaded photographic observation; MobileNet neural model verified smoke signature.",
        citizenReportsCount: 2,
        verifiedReportsCount: 2,
        signals: {
          ...prev.signals,
          citizenVerification: "VERIFIED",
          hasCitizenReports: true,
          overallConfidence: 0.94,
        },
      }));
    }, 8500);

    // Step 10: Complete demonstration
    setTimeout(() => {
      setDemoStep(10);
      setIsScenarioRunning(false);
      setIncident(ACTIVE_DEMO_INCIDENT_STATE);
    }, 11500);
  };

  const resetToNominal = () => {
    setIsScenarioRunning(false);
    setDemoStep(0);
    setIncident(IDLE_INCIDENT_STATE);
  };

  const markIncidentResolved = () => {
    setIncident({
      ...IDLE_INCIDENT_STATE,
      title: "Incident INC-2026-089 Resolved & Cleared",
      summary: "Combustion contained and smoke plume completely dispersed. Atmospheric parameters restored to nominal baseline.",
    });
  };

  // Synchronized dataset based on single centralized state
  const isThreatActive = incident.status !== "IDLE";
  const fires = isThreatActive && incident.fireSource ? [incident.fireSource] : [];
  const smokeReports = isThreatActive ? DEMO_DATASET.smokeReports : [];
  const clearReports = DEMO_DATASET.clearReports;
  const wind = {
    windSpeedKmh: incident.wind.speedKmh,
    windDirectionDeg: incident.wind.directionDeg,
  };

  const evidence = {
    hasFireDetected: incident.signals.hasFireDetected,
    hasWindAligned: incident.signals.hasWindAligned,
    hasDriftIntersection: incident.signals.hasDriftIntersection,
    hasWarningDistance: incident.signals.hasWarningDistance,
    hasCitizenReports: incident.signals.hasCitizenReports,
    evidenceConfidence: Math.round(incident.signals.overallConfidence * 100),
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] font-sans">
      {/* Top Navbar */}
      <TopNavbar
        activeTab={activeTab}
        onTabChange={(tab: NavTab) => setActiveTab(tab)}
        incident={incident}
        onRunDemoScenario={runDemoScenario}
        onResetIncident={resetToNominal}
        isScenarioRunning={isScenarioRunning}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-white">
        {/* Emergency Mode Modal */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          etaMinutes={incident.etaMinutes}
          fireDistanceKm={incident.distanceKm}
          windSpeedKmh={incident.wind.speedKmh}
          affectedSitesCount={incident.affectedZones.length || 1}
        />

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Clean Minimal Hero Section */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-10 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>AI Heritage & Environmental Safety Platform</span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-tight">
                  Protecting Heritage Before Smoke Arrives.
                </h1>

                <p className="text-sm sm:text-base text-[#475569] leading-relaxed max-w-2xl font-normal">
                  AI-powered smoke detection, trajectory prediction and community verification for protected areas.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={runDemoScenario}
                    disabled={isScenarioRunning}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isScenarioRunning ? `Running Step ${demoStep}...` : "Run Demo"}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("map")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#0F172A] font-semibold text-xs border border-[#E2E8F0] transition-all shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>View Live Monitor</span>
                    <ArrowRight className="w-4 h-4 text-[#64748B]" />
                  </button>

                  <button
                    onClick={() => setIsEmergencyModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0] font-semibold text-xs transition-all shadow-xs"
                  >
                    <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                    <span>Emergency SOP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Dashboard Metric Cards (Simple white cards with subtle hover) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-xs font-semibold">Active Incidents</span>
                  <Flame className="w-4 h-4 text-[#DC2626]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {isThreatActive ? "01" : "00"}
                </p>
                <span className="text-[11px] text-[#94A3B8]">Within 50km radius</span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-xs font-semibold">Protected Areas</span>
                  <Shield className="w-4 h-4 text-[#2563EB]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">12</p>
                <span className="text-[11px] text-[#94A3B8]">Monitored zones</span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-xs font-semibold">Active Alerts</span>
                  <Bell className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">
                  {String(incident.activeAlerts.length).padStart(2, "0")}
                </p>
                <span className="text-[11px] text-[#94A3B8]">Dispatched notices</span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-xs font-semibold">Warning Time</span>
                  <Clock className="w-4 h-4 text-[#16A34A]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A] font-mono">
                  {incident.etaMinutes ? `~${incident.etaMinutes}m` : "N/A"}
                </p>
                <span className="text-[11px] text-[#94A3B8]">Lead time to impact</span>
              </div>

              <div className="p-5 rounded-xl bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 transition-all">
                <div className="flex items-center justify-between text-[#64748B] mb-2">
                  <span className="text-xs font-semibold">Confidence</span>
                  <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A] font-mono">
                  {Math.round(incident.signals.overallConfidence * 100)}%
                </p>
                <span className="text-[11px] text-[#94A3B8]">Multi-signal AI model</span>
              </div>
            </div>

            {/* Clean White Active Alert Card (when active) */}
            {isThreatActive && (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase tracking-wider">
                      {incident.riskLevel} RISK ADVISORY
                    </span>
                    <span className="font-mono text-xs text-[#64748B] font-semibold">
                      {incident.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab("reports")}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-semibold transition-all shadow-xs"
                    >
                      Verify Report
                    </button>
                    <button
                      onClick={markIncidentResolved}
                      className="px-3 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-semibold transition-all shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{incident.title}</h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">{incident.summary}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] rounded-xl p-3.5 text-xs border border-[#E2E8F0]">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Estimated Arrival:</span>
                    <span className="font-mono font-bold text-[#0F172A] text-sm">~{incident.etaMinutes} MIN</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Surface Wind:</span>
                    <span className="font-semibold text-[#0F172A] font-mono text-sm">{incident.wind.speedKmh} km/h {incident.wind.compassHeading}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Projected Spread:</span>
                    <span className="font-semibold text-[#0F172A] font-mono text-sm">{incident.smoke.projectedTravelKm} km</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Confidence:</span>
                    <span className="font-semibold text-[#0F172A] font-mono text-sm">{Math.round(incident.signals.overallConfidence * 100)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Live Monitoring Map & Trajectory Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#0F172A]">Live Monitoring</h2>
                      <p className="text-xs text-[#64748B]">12 protected zones monitored in buffer perimeter</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#64748B]">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A] status-pulse"></span>
                      <span>System Online</span>
                    </div>
                  </div>

                  <MapWrapper
                    siteLat={initialData.siteLat}
                    siteLon={initialData.siteLon}
                    fires={fires}
                    smokeReports={smokeReports}
                    clearReports={clearReports}
                    windSpeedKmh={wind.windSpeedKmh}
                    windDirectionDeg={wind.windDirectionDeg}
                    predictionMinutes={predictionWindow}
                    customSimulationResult={simResult}
                    onFireSelect={(f: any) => setSelectedFire(f)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <PredictionPanel
                  initialFireLat={selectedFire ? selectedFire.latitude : 9.8120}
                  initialFireLon={selectedFire ? selectedFire.longitude : 78.1410}
                  initialWindSpeed={wind.windSpeedKmh}
                  initialWindDir={wind.windDirectionDeg}
                  predictionWindowMinutes={predictionWindow}
                  onPredictionWindowChange={(mins) => setPredictionWindow(mins)}
                  onSimulationRun={(res) => setSimResult(res)}
                />
              </div>
            </div>

            {/* Evidence Attribution & Citizen Photo Verification */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WhyThisAlert
                evidence={evidence}
                fireDistanceKm={incident.distanceKm}
                windSpeedKmh={wind.windSpeedKmh}
                windHeadingDeg={wind.windDirectionDeg}
                etaMinutes={incident.etaMinutes}
              />

              <PhotoUpload isDemoMode={true} />
            </div>

            {/* Receptor Proximity & Guidance */}
            <PersonalRisk
              currentLat={initialData.siteLat}
              currentLon={initialData.siteLon}
              isCustomLocation={initialData.isCustomLocation}
              riskScore={isThreatActive ? 85 : 15}
              riskState={incident.riskLevel}
              nearestFireDist={incident.distanceKm}
              etaMinutes={incident.etaMinutes}
              windSpeedKmh={wind.windSpeedKmh}
              windDirectionDeg={wind.windDirectionDeg}
            />
          </div>
        )}

        {/* TAB 2: LIVE MAP */}
        {activeTab === "map" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <h2 className="text-base font-bold text-[#0F172A]">
                Live Monitoring Map
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Thermal hotspots, ±30° expansion cones, downwind vectors, and sensitive receptors.
              </p>
            </div>

            <MapWrapper
              siteLat={initialData.siteLat}
              siteLon={initialData.siteLon}
              fires={fires}
              smokeReports={smokeReports}
              clearReports={clearReports}
              windSpeedKmh={wind.windSpeedKmh}
              windDirectionDeg={wind.windDirectionDeg}
              predictionMinutes={predictionWindow}
              customSimulationResult={simResult}
              showProtectedAreas={true}
            />

            <WhyThisAlert
              evidence={evidence}
              fireDistanceKm={incident.distanceKm}
              windSpeedKmh={wind.windSpeedKmh}
              windHeadingDeg={wind.windDirectionDeg}
              etaMinutes={incident.etaMinutes}
            />
          </div>
        )}

        {/* TAB 3: PREDICTION */}
        {activeTab === "prediction" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <h2 className="text-base font-bold text-[#0F172A]">
                Smoke Trajectory Prediction
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Estimate how smoke may travel based on detection and wind conditions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictionPanel
                initialFireLat={selectedFire ? selectedFire.latitude : 9.8120}
                initialFireLon={selectedFire ? selectedFire.longitude : 78.1410}
                initialWindSpeed={wind.windSpeedKmh}
                initialWindDir={wind.windDirectionDeg}
                predictionWindowMinutes={predictionWindow}
                onPredictionWindowChange={(mins) => setPredictionWindow(mins)}
                onSimulationRun={(res) => setSimResult(res)}
              />

              <MapWrapper
                siteLat={initialData.siteLat}
                siteLon={initialData.siteLon}
                fires={fires}
                smokeReports={smokeReports}
                clearReports={clearReports}
                windSpeedKmh={wind.windSpeedKmh}
                windDirectionDeg={wind.windDirectionDeg}
                predictionMinutes={predictionWindow}
                customSimulationResult={simResult}
              />
            </div>
          </div>
        )}

        {/* TAB 4: CITIZEN REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PhotoUpload isDemoMode={true} />

              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
                <h3 className="text-sm font-bold text-[#0F172A]">
                  Verified Ground Sighting Map
                </h3>
                <p className="text-xs text-[#64748B]">
                  Photographic sightings submitted by rangers & villagers, classified via on-device MobileNet.
                </p>
                <MapWrapper
                  siteLat={initialData.siteLat}
                  siteLon={initialData.siteLon}
                  fires={fires}
                  smokeReports={smokeReports}
                  clearReports={clearReports}
                  windSpeedKmh={wind.windSpeedKmh}
                  windDirectionDeg={wind.windDirectionDeg}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ALERTS */}
        {activeTab === "alerts" && (
          <div className="animate-in fade-in duration-300">
            <AlertCenter alerts={incident.activeAlerts as any} onViewOnMap={() => setActiveTab("map")} />
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="animate-in fade-in duration-300">
            <AnalyticsDashboard isDemoMode={true} />
          </div>
        )}

        {/* TAB 7: PROTECTED AREAS */}
        {activeTab === "protected" && (
          <div className="animate-in fade-in duration-300">
            <ProtectedAreas
              windSpeedKmh={wind.windSpeedKmh}
              windDirectionDeg={wind.windDirectionDeg}
              fires={fires}
              onSelectAreaOnMap={() => setActiveTab("map")}
            />
          </div>
        )}

        {/* TAB 8: INCIDENT HISTORY */}
        {activeTab === "history" && (
          <div className="animate-in fade-in duration-300">
            <IncidentHistory isDemoMode={true} />
          </div>
        )}
      </main>

      {/* Clean Minimal White Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div>
            <span className="font-bold text-[#0F172A] text-sm block mb-0.5">PUGA SUTHAM</span>
            <p className="text-xs text-[#94A3B8]">
              AI-powered heritage safety platform.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">About</span>
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">How It Works</span>
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Contact</span>
            <span className="hover:text-[#0F172A] cursor-pointer transition-colors">Privacy</span>
          </div>

          <div className="text-[#94A3B8]">
            © 2026 Puga Sutham. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
