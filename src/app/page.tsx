// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { INITIAL_DATA, Machine } from "./data/machines";
import { VibrationChart } from "@/components/VibrationChart"; // Ensure alias is set or use relative path
import { Activity, AlertTriangle, CheckCircle, Smartphone } from "lucide-react";

export default function Dashboard() {
  const [machines, setMachines] = useState<Machine[]>(INITIAL_DATA);

  // The "Live" Effect: Jitters the numbers every second to look real
  useEffect(() => {
    const interval = setInterval(() => {
      setMachines((current) =>
        current.map((m) => {
          // Add random noise: +/- 2
          const noise = Math.floor(Math.random() * 5) - 2;
          const newVal = Math.max(0, Math.min(100, m.vibration + noise));
          
          // Update history array for the chart (remove first, add new)
          const newHistory = [...m.history.slice(1), newVal];

          return { ...m, vibration: newVal, history: newHistory };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">MachinePulse AI</h1>
          <p className="text-slate-400 text-sm">Factory Floor: Cincinnati Main</p>
        </div>
        <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono border border-emerald-500/20 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* Grid of Machines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <div
            key={machine.id}
            className={`
              relative overflow-hidden rounded-xl border p-5 transition-all
              ${machine.status === "Critical" 
                ? "bg-red-950/20 border-red-500/50 shadow-[0_0_30px_-10px_rgba(239,68,68,0.3)]" 
                : "bg-slate-900 border-slate-800"}
            `}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{machine.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{machine.id} • {machine.location}</p>
              </div>
              
              {/* Status Badge */}
              <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1
                ${machine.status === "Critical" ? "bg-red-500 text-white" : 
                  machine.status === "Warning" ? "bg-amber-500/20 text-amber-500" : 
                  "bg-emerald-500/20 text-emerald-500"}`}>
                {machine.status === "Critical" ? <AlertTriangle size={12} /> : <CheckCircle size={12} />}
                {machine.status.toUpperCase()}
              </div>
            </div>

            {/* The Metrics */}
            <div className="flex items-end gap-1 mb-4">
              <span className="text-3xl font-mono font-bold tracking-tighter">
                {machine.vibration}%
              </span>
              <span className="text-xs text-slate-400 mb-1">Vibration Load</span>
            </div>

            {/* The Graph */}
            <VibrationChart 
              data={machine.history} 
              color={machine.status === "Critical" ? "#ef4444" : "#10b981"} 
            />
            
            {/* Footer Call to Action (For the "Subscription" pitch) */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-500">
              <span>Temp: {machine.temp}°C</span>
              {machine.status === "Critical" && (
                <span className="text-red-400 font-bold animate-pulse">PREDICTIVE FAILURE DETECTED</span>
              )}
            </div>
          </div>
        ))}

        {/* The "Connect New" Card (Prop) */}
        <div className="rounded-xl border border-slate-800 border-dashed bg-slate-900/50 p-5 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-900 transition-colors cursor-pointer group">
          <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
            <Smartphone size={24} />
          </div>
          <span className="text-sm font-medium">Pair New Sensor</span>
          <span className="text-xs opacity-50 text-center mt-1">Scan QR on device</span>
        </div>
      </div>
    </div>
  );
}