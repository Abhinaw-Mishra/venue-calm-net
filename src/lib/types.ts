export type IncidentType = "fire" | "medical" | "crowd" | "security";
export type AlertStatus = "pending" | "in_progress" | "resolved";
export type Priority = "high" | "medium" | "low";
export type Role = "guest" | "admin" | "responder";

export type Zone = "Gate A" | "Gate B" | "Lobby" | "Stage" | "Parking" | "Restaurant" | "Pool Deck";

export const ZONES: Zone[] = ["Gate A", "Gate B", "Lobby", "Stage", "Parking", "Restaurant", "Pool Deck"];

export interface Alert {
  id: string;
  type: IncidentType;
  status: AlertStatus;
  priority: Priority;
  zone: Zone;
  floor?: string;
  room?: string;
  message?: string;
  createdAt: number;
  resolvedAt?: number;
  assignedTeam?: string;
  reporter: Role;
  suggestion: string;
}

export interface Broadcast {
  id: string;
  message: string;
  zone: Zone | "All Zones";
  createdAt: number;
}
