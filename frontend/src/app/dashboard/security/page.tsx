"use client";

import { useState } from "react";

export default function SecurityPage() {
  const [classifications] = useState([
    { id: 1, table: "crm_users", column: "email", label: "PII", level: "High", policy: "Mask on Export", color: "red" },
    { id: 2, table: "crm_users", column: "password_hash", label: "Sensitive", level: "High", policy: "No Export Allowed", color: "red" },
    { id: 3, table: "crm_users", column: "first_name", label: "Sensitive", level: "Medium", policy: "Restrict Access", color: "amber" },
    { id: 4, table: "sf_orders", column: "total", label: "Public", level: "Low", policy: "No Restrictions", color: "green" },
  ]);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Data Classification Command Center</h3>
          <p className="text-xs text-zinc-500">Auto-classified fields across your connected data landscape using PII Heuristic engines.</p>
        </div>
        <button className="px-4 py-2 text-sm font-semibold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2">
          🛡️ Run Audit Scan
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-4 font-semibold text-zinc-400">Table</th>
              <th className="p-4 font-semibold text-zinc-400">Column</th>
              <th className="p-4 font-semibold text-zinc-400">Classification</th>
              <th className="p-4 font-semibold text-zinc-400">Sensitivity</th>
              <th className="p-4 font-semibold text-zinc-400">Enforced Policy</th>
            </tr>
          </thead>
          <tbody>
            {classifications.map((c) => {
              const colorMap: any = {
                red: "bg-red-500/10 text-red-500 border-red-500/20",
                amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                green: "bg-green-500/10 text-green-500 border-green-500/20",
              };
              return (
                <tr key={c.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4 font-mono text-xs text-zinc-400">{c.table}</td>
                  <td className="p-4 font-mono text-xs text-zinc-200">{c.column}</td>
                  <td className="p-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${colorMap[c.color]}`}>
                      {c.label}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-zinc-400">{c.level}</td>
                  <td className="p-4 text-xs text-zinc-400 italic">
                    {c.policy}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
