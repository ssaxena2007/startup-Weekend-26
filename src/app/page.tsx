// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { INITIAL_DATA, Machine } from "./data/machines";
import { VibrationChart } from "@/components/VibrationChart";
import { AlertTriangle, CheckCircle, Smartphone, Volume2 } from "lucide-react";

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_DATA);
  const [demoStarted, setDemoStarted] = useState(false);
  const [isCritical, setIsCritical] = useState(false);
  
  // Audio Context Ref (for the beep sound)
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Function to generate a loud "Industrial Beep" without needing an MP3 file
  const playAlarm = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "square"; // "Square" wave sounds like a harsh alarm
    osc.frequency.setValueAtTime(880, ctx.currentTime); // High pitch
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.1); // Low pitch (Siren effect)
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  };

  // THE SCRIPTED DEMO LOGIC
  useEffect(() => {
    if (!demoStarted) return;

    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;

      setMachines((current) =>
        current.map((m) => {
          // Machines 1, 2, and 5 stay normal (just random jitter)
          if (m.id !== "MP-104") {
            const noise = Math.floor(Math.random() * 5) - 2;
            const newVal = Math.max(0, Math.min(40, m.vibration + noise));
            return { ...m, vibration: newVal, history: [...m.history.slice(1), newVal] };
          }

          // MACHINE MP-104 (The "Time Bomb")
          let newVal = m.vibration;
          let newStatus = m.status;

          // Phase 1: Calm (0-4 seconds) - Keep it low
          if (seconds < 4) {
            newVal = 15 + Math.floor(Math.random() * 5);
            newStatus = "Running";
            setIsCritical(false);
          }
          // Phase 2: The Climb (4-8 seconds) - Ramping up rapidly
          else if (seconds < 8) {
            newVal = m.vibration + 15; // Add 15% every second
            newStatus = "Warning";
          }
          // Phase 3: FAILURE (8+ seconds) - Max out and Alarm
          else {
            newVal = 95 + Math.floor(Math.random() * 5); // Hover near 100%
            newStatus = "Critical";
            setIsCritical(true);
            playAlarm(); // Trigger the sound
          }

          return { 
            ...m, 
            vibration: Math.min(100, newVal), 
            status: newStatus as any,
            history: [...m.history.slice(1), newVal] 
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [demoStarted]);

  return (
    <div className={`min-h-screen transition-colors duration-100 p-6 font-sans 
      ${isCritical ? "bg-red-950" : "bg-slate-950"} text-slate-100`}>
      
      {/* Visual Alarm Overlay (Flashes Red when critical) */}
      {isCritical && (
        <div className="fixed inset-0 bg-red-500/20 z-0 animate-pulse pointer-events-none" />
      )}

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MachinePulse AI</h1>
          <p className="text-slate-400 text-sm">Factory Floor: Cincinnati Main</p>
        </div>
        
        {/* The "Start Demo" Button (Hidden as a 'Connect' button) */}
        {!demoStarted ? (
          <button 
            onClick={() => setDemoStarted(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg animate-bounce"
          >
            <Smartphone size={16} />
            Connect Live Stream
          </button>
        ) : (
          <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/20 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE FEED ACTIVE
          </div>
        )}
      </header>

      {/* Grid of Machines */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className={`
              relative overflow-hidden rounded-xl border p-5 transition-all duration-300
              ${machine.status === "Critical" 
                ? "bg-red-900/40 border-red-500 scale-105 shadow-[0_0_50px_-10px_rgba(239,68,68,0.6)]" 
                : machine.status === "Warning"
                ? "bg-amber-900/20 border-amber-500/50"
                : "bg-slate-900 border-slate-800"}
            `}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{machine.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{machine.id}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1
                ${machine.status === "Critical" ? "bg-red-500 text-white animate-pulse" : 
                  machine.status === "Warning" ? "bg-amber-500 text-black" : 
                  "bg-emerald-500/20 text-emerald-500"}`}>
                {machine.status === "Critical" ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                {machine.status.toUpperCase()}
              </div>
            </div>

            <div className="flex items-end gap-1 mb-4">
              <span className={`text-3xl font-mono font-bold tracking-tighter transition-colors
                ${machine.status === "Critical" ? "text-red-400" : "text-white"}`}>
                {machine.vibration}%
              </span>
              <span className="text-xs text-slate-400 mb-1">Vibration Load</span>
            </div>

            <VibrationChart 
              data={machine.history} 
              color={machine.status === "Critical" ? "#ef4444" : machine.status === "Warning" ? "#f59e0b" : "#10b981"} 
            />
            
            {machine.status === "Critical" && (
               <div className="absolute inset-0 border-4 border-red-500/50 rounded-xl animate-pulse pointer-events-none"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}