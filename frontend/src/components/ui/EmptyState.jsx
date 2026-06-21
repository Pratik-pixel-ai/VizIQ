import { CheckCircle2 } from "lucide-react";

export default function EmptyState({ message, icon: Icon = CheckCircle2 }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-4 py-3.5 text-sm font-medium"
      style={{ background: "var(--accent-2-soft)", color: "var(--accent-2)" }}
    >
      <Icon size={18} strokeWidth={2.25} />
      {message}
    </div>
  );
}
