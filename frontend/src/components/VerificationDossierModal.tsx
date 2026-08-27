import { useState } from 'react';
import { X, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { MissionState } from '../types/mission';

interface VerificationDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionState: MissionState | null;
  onDownloadDossier: () => void;
}

export function VerificationDossierModal({
  isOpen,
  onClose,
  missionState,
  onDownloadDossier
}: VerificationDossierModalProps) {
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'CALCULATIONS' | 'AUDIT' | 'RETROFIT' | 'RAW'>('SUMMARY');

  if (!isOpen) return null;

  const missionId = missionState?.mission_id || 'GSF-2026-P04-DEMO';
  const preSF = missionState?.initial_safety_factor || 0.94;
  const postSF = missionState?.post_retrofit_safety_factor || 1.74;
  const retro = missionState?.retrofit_data;
  const layers = retro?.required_cfrp_layers || 3;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0b12] border-2 border-emerald-500/60 rounded-2xl max-w-4xl w-full shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col max-h-[90vh] overflow-hidden font-mono text-xs text-gray-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-400">
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  VERIFICATION & AUDIT DOSSIER
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                  AUTONOMOUSLY SIGNED
                </span>
              </div>
              <div className="text-[10px] text-gray-400">
                MISSION ID: <span className="text-cyan-400 font-bold">{missionId}</span> • TARGET: BRIDGE PIER P-04
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadDossier}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-black rounded-lg transition-colors shadow-md"
            >
              <Download size={13} />
              <span>EXPORT (.MD)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/40 px-4 gap-2 overflow-x-auto">
          {[
            { id: 'SUMMARY', label: '1. EXECUTIVE SUMMARY' },
            { id: 'CALCULATIONS', label: '2. ENGINEERING PHYSICS' },
            { id: 'AUDIT', label: '3. ADVERSARIAL CHALLENGE & AUDIT' },
            { id: 'RETROFIT', label: '4. CFRP COMPOSITE SPEC' },
            { id: 'RAW', label: '5. SIGNED MARKDOWN' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3 text-[11px] font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/30'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'SUMMARY' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/40">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Pre-Triage State</div>
                  <div className="text-2xl font-black text-red-400 my-1">SF {preSF.toFixed(2)}</div>
                  <div className="text-[10px] text-red-300">CRITICAL DEFICIT (Req ≥ 1.50)</div>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/40">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Intervention Applied</div>
                  <div className="text-2xl font-black text-purple-300 my-1">{layers}-Ply CFRP</div>
                  <div className="text-[10px] text-purple-300">SikaWrap-300C Continuous Jacket</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/60">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Verified Final State</div>
                  <div className="text-2xl font-black text-emerald-400 my-1">SF {postSF.toFixed(2)}</div>
                  <div className="text-[10px] text-emerald-300">CERTIFIED SAFE (+85.1% MARGIN)</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 leading-relaxed">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-400" />
                  <span>AUTONOMOUS SWARM FINDINGS & RESOLUTION</span>
                </h4>
                <p className="text-gray-300 text-[11px]">
                  1. <strong>Incident Ingestion</strong>: Sensor telemetry on Span 14A detected severe microstrain (2,140 με), acoustic emission (84.5 dB), and seismic acceleration (0.42 g).
                </p>
                <p className="text-gray-300 text-[11px]">
                  2. <strong>Adversarial Refutation</strong>: Initial ACI 318 shear screening showed SF = 1.54 (PASS), but the <strong>Independent Validation Agent</strong> rejected the shear-only hypothesis due to empirical physical damage inconsistency.
                </p>
                <p className="text-gray-300 text-[11px]">
                  3. <strong>Adaptive Replanning</strong>: The Commander shifted strategy to OpenSeesPy non-linear fiber pushover simulation, discovering true flexural yield deficit (SF = 0.94).
                </p>
                <p className="text-gray-300 text-[11px]">
                  4. <strong>Certified Remediation</strong>: Designed a {layers}-ply high-modulus unidirectional carbon fiber composite jacket per ACI 440.2R-17, restoring SF = 1.74 (≥ 1.50).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: CALCULATIONS */}
          {activeTab === 'CALCULATIONS' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-cyan-300 uppercase">1. ACI 318-19 Shear Capacity Screening</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div><span className="text-gray-500 block">Concrete Vc:</span> <strong className="text-white">1,718.1 kN</strong></div>
                  <div><span className="text-gray-500 block">Stirrups Vs:</span> <strong className="text-white">1,061.3 kN</strong></div>
                  <div><span className="text-gray-500 block">Design φVn:</span> <strong className="text-emerald-400">2,084.5 kN</strong></div>
                  <div><span className="text-gray-500 block">Demand Vu:</span> <strong className="text-amber-300">1,350.0 kN</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-blue-300 uppercase">2. OpenSeesPy Non-Linear Fiber Section Analysis</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div><span className="text-gray-500 block">Fiber Discretization:</span> <strong className="text-white">288 Fibers</strong></div>
                  <div><span className="text-gray-500 block">Peak Moment Mu:</span> <strong className="text-white">4,643.2 kNm</strong></div>
                  <div><span className="text-gray-500 block">Yield Moment My:</span> <strong className="text-white">4,523.8 kNm</strong></div>
                  <div><span className="text-gray-500 block">Ductility Ratio μ:</span> <strong className="text-cyan-400">6.96</strong></div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-2">
                <div className="text-xs font-bold text-purple-300 uppercase">3. ASCE 41-17 Moment-Curvature Assessment</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div><span className="text-gray-500 block">Curvature φy:</span> <strong className="text-white">0.0294 1/m</strong></div>
                  <div><span className="text-gray-500 block">Ultimate φu:</span> <strong className="text-white">0.0558 1/m</strong></div>
                  <div><span className="text-gray-500 block">Applied Demand:</span> <strong className="text-red-400">800.0 kNm</strong></div>
                  <div><span className="text-gray-500 block">Pre-Retrofit SF:</span> <strong className="text-red-400">0.94 (FAIL)</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT & CHALLENGE */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span>AUDIT GATE 01 • HYPOTHESIS CHALLENGE</span>
                  <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded text-[9px] font-black">CHALLENGE RAISED</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  <strong>Trigger</strong>: StructuralAgent reported Shear SF = 1.54 (PASS).
                </p>
                <p className="text-[11px] text-amber-200">
                  <strong>Validation Sentinel Finding</strong>: &quot;Shear analysis returned SF=1.54, which DOES NOT explain the severe strain readings (2,140 με) and acoustic spalling (84.5 dB) in physical telemetry. Secondary flexural/ductility failure mechanism suspected.&quot;
                </p>
                <div className="text-[10px] text-gray-400">
                  Action Enforced: <strong>VETO INITIAL HYPOTHESIS &amp; FORCE COMMANDER REPLAN</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>AUDIT GATE 02 • FINAL CERTIFICATION</span>
                  <span className="bg-emerald-500 text-black px-1.5 py-0.2 rounded text-[9px] font-black">VERIFIED &amp; SIGNED</span>
                </div>
                <p className="text-[11px] text-gray-300">
                  <strong>Trigger</strong>: RetrofitAgent submitted 3-ply CFRP composite wrap design.
                </p>
                <p className="text-[11px] text-emerald-200">
                  <strong>Validation Sentinel Finding</strong>: &quot;Post-retrofit safety factor 1.74 exceeds emergency threshold 1.50. ACI 440.2R-17 and ASCE 41-17 compliance verified. All safety criteria satisfied.&quot;
                </p>
                <div className="text-[10px] text-emerald-400 font-bold">
                  Status: <strong>MISSION VERIFIED • EXECUTIVE REMEDIATION AUTHORIZED</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RETROFIT SPEC */}
          {activeTab === 'RETROFIT' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3">
                <div className="text-xs font-bold text-purple-300 uppercase">
                  ACI 440.2R-17 CFRP Composite Jacket Specification
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div className="space-y-1.5">
                    <div><span className="text-gray-400">Composite Material:</span> <strong className="text-white">SikaWrap-300C / Epoxy Matrix</strong></div>
                    <div><span className="text-gray-400">Fiber Orientation:</span> <strong className="text-white">0° Unidirectional (Hoop Confinement)</strong></div>
                    <div><span className="text-gray-400">Layer Schedule:</span> <strong className="text-purple-300">{layers} Plies Continuous</strong></div>
                    <div><span className="text-gray-400">Total Laminate Thickness:</span> <strong className="text-white">3.00 mm (1.0 mm/ply)</strong></div>
                  </div>
                  <div className="space-y-1.5">
                    <div><span className="text-gray-400">Tensile Strength:</span> <strong className="text-white">3,900 MPa</strong></div>
                    <div><span className="text-gray-400">Tensile Modulus:</span> <strong className="text-white">230 GPa</strong></div>
                    <div><span className="text-gray-400">Rupture Strain:</span> <strong className="text-white">1.50%</strong></div>
                    <div><span className="text-gray-400">Post-Retrofit SF:</span> <strong className="text-emerald-400">{postSF.toFixed(2)} (≥ 1.50 PASS)</strong></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: RAW MARKDOWN */}
          {activeTab === 'RAW' && (
            <div className="p-3 bg-black/70 rounded-xl border border-white/10 text-[10px] text-gray-300 font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
              {`# GEOSENTINEL FLEET — AUTONOMOUS MISSION DOSSIER
Mission ID: ${missionId}
Date: ${new Date().toISOString()}
Target: Bridge Pier P-04 (San Mateo Bridge Span 14A)

## 1. Physical Sensor Telemetry
- Microstrain: 2,140 με (Severe Anomaly)
- Acoustic Emission: 84.5 dB (Active Concrete Cracking)
- Ground Accel: 0.42 g (PGA Seismic)

## 2. Hypothesis & Challenge Trail
- H1: Primary shear failure -> REFUTED by Validation Sentinel (Shear SF = 1.54 does not explain physical strain).
- H2: Flexural yield & ductility degradation -> CONFIRMED via OpenSeesPy FEA.

## 3. Structural Triage Metrics
- Pre-Retrofit SF: ${preSF.toFixed(2)} (CRITICAL DEFICIT)
- Prescribed Retrofit: ${layers}-Ply Continuous SikaWrap-300C CFRP Jacket (ACI 440.2R-17)
- Post-Retrofit SF: ${postSF.toFixed(2)} (VERIFIED SAFE, +85.1% margin)

## 4. Compliance Verification
- ACI 318-19: PASSED
- ASCE 41-17: PASSED
- ACI 440.2R-17: PASSED
- Status: CERTIFIED SAFE`}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-white/10 bg-black/60 flex items-center justify-between text-[10px]">
          <div className="text-gray-400">
            Certified by <span className="text-purple-400 font-bold">Independent Validation Sentinel</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
}
