export type MachineStatus = "Running" | "Warning" | "Critical" | "Offline";

export interface Machine {
  id: string;
  name: string;
  location: string;
  status: MachineStatus;
  vibration: number; // 0-100%
  temp: number; // Celsius
  history: number[]; // For the graph
}

export const INITIAL_DATA: Machine[] = [
  {
    id: "MP-101",
    name: "CNC Lathe (Main)",
    location: "Zone A",
    status: "Running",
    vibration: 12,
    temp: 45,
    history: [10, 12, 11, 13, 12, 11, 12, 12, 13, 12],
  },
  {
    id: "MP-102",
    name: "Hydraulic Press #3",
    location: "Zone B",
    status: "Running",
    vibration: 24,
    temp: 52,
    history: [22, 24, 23, 25, 24, 23, 24, 25, 24, 24],
  },
  {
    id: "MP-104",
    name: "Bearing Assembly Arm",
    location: "Zone C",
    status: "Critical", // The "Problem" Machine
    vibration: 88,
    temp: 82,
    history: [45, 50, 62, 70, 75, 82, 85, 88, 89, 92],
  },
  {
    id: "MP-105",
    name: "Conveyor Motor 2",
    location: "Zone A",
    status: "Warning",
    vibration: 65,
    temp: 60,
    history: [50, 52, 55, 58, 60, 62, 64, 63, 65, 66],
  },
];