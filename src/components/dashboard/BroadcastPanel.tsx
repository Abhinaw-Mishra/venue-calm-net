import { useState } from "react";
import { Megaphone, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ZONES, type Zone } from "@/lib/types";
import { toast } from "sonner";

const PRESETS = [
  "Evacuate Gate 2 immediately",
  "Medical team requested at Lobby",
  "All clear — resume normal operations",
];

export function BroadcastPanel() {
  const broadcasts = useStore((s) => s.broadcasts);
  const addBroadcast = useStore((s) => s.addBroadcast);
  const [msg, setMsg] = useState("");
  const [zone, setZone] = useState<Zone | "All Zones">("All Zones");

  const send = (text?: string) => {
    const message = (text ?? msg).trim();
    if (!message) return;
    addBroadcast({ message, zone });
    toast.success("📢 Broadcast sent", { description: `${zone} · ${message}` });
    setMsg("");
  };

  return (
    <div className="glass flex h-full flex-col rounded-2xl">
      <div className="flex items-center gap-2 border-b border-white/5 px-5 py-4">
        <Megaphone className="h-4 w-4 text-primary" />
        <div>
          <h2 className="font-display text-lg font-semibold">Broadcast</h2>
          <p className="text-xs text-muted-foreground">Push real-time alerts to staff & guests</p>
        </div>
      </div>
      <div className="space-y-3 px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {(["All Zones", ...ZONES] as const).map((z) => (
            <button
              key={z}
              onClick={() => setZone(z)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                zone === z ? "border-primary/50 bg-primary/15 text-primary" : "border-white/5 bg-white/[0.02] text-muted-foreground hover:text-foreground"
              }`}
            >
              {z}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a broadcast message…"
            className="border-white/5 bg-white/[0.02]"
          />
          <Button onClick={() => send()} className="bg-gradient-primary text-primary-foreground shadow-glow">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="rounded-full border border-white/5 bg-white/[0.02] px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-white/[0.05] hover:text-foreground"
            >
              + {p}
            </button>
          ))}
        </div>
      </div>
      <div className="border-t border-white/5 px-5 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</div>
        <ul className="mt-2 space-y-2">
          {broadcasts.length === 0 && <li className="text-sm text-muted-foreground">No broadcasts yet.</li>}
          {broadcasts.slice(0, 5).map((b) => (
            <li key={b.id} className="rounded-lg border border-white/5 bg-white/[0.02] p-2.5 text-sm animate-fade-in">
              <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="font-medium text-primary">{b.zone}</span>
                <span className="font-mono">{new Date(b.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="mt-1">{b.message}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
