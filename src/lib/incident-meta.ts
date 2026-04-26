import { Flame, HeartPulse, Users, ShieldAlert, type LucideIcon } from "lucide-react";
import type { IncidentType, Priority, AlertStatus, Zone } from "./types";

export const INCIDENT_META: Record<IncidentType, { label: string; emoji: string; icon: LucideIcon; defaultPriority: Priority }> = {
  fire: { label: "Fire", emoji: "🔥", icon: Flame, defaultPriority: "high" },
  medical: { label: "Medical", emoji: "🚑", icon: HeartPulse, defaultPriority: "high" },
  crowd: { label: "Crowd", emoji: "👥", icon: Users, defaultPriority: "medium" },
  security: { label: "Security", emoji: "🚨", icon: ShieldAlert, defaultPriority: "high" },
};

export const PRIORITY_STYLES: Record<Priority, { label: string; chip: string; dot: string }> = {
  high: { label: "High", chip: "bg-critical/15 text-critical border-critical/30", dot: "bg-critical" },
  medium: { label: "Medium", chip: "bg-warning/15 text-warning border-warning/30", dot: "bg-warning" },
  low: { label: "Low", chip: "bg-info/15 text-info border-info/30", dot: "bg-info" },
};

export const STATUS_STYLES: Record<AlertStatus, { label: string; chip: string }> = {
  pending: { label: "Pending", chip: "bg-warning/15 text-warning border-warning/30" },
  in_progress: { label: "In Progress", chip: "bg-info/15 text-info border-info/30" },
  resolved: { label: "Resolved", chip: "bg-success/15 text-success border-success/30" },
};

export const TEAMS = [
  "Alpha Fire Squad",
  "Bravo Medical Unit",
  "Charlie Security Team",
  "Delta Crowd Control",
  "Echo Rapid Response",
];

const SUGGESTIONS: Record<IncidentType, (zone: Zone) => string> = {
  fire: (z) => `Dispatch nearest fire response team to ${z}. Activate sprinklers and seal adjacent zones.`,
  medical: (z) => `Send medical unit to ${z} with AED. Clear pathway for paramedics via service corridor.`,
  crowd: (z) => `High crowd density in ${z}. Open auxiliary exits and redirect flow to Gate B.`,
  security: (z) => `Deploy security team to ${z}. Lock down adjacent zones and review camera feed.`,
};

export const suggestionFor = (type: IncidentType, zone: Zone) => SUGGESTIONS[type](zone);
