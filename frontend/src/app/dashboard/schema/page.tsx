"use client";

import { useState } from "react";

export default function SchemaPage() {
  const [mappings] = useState([
    { id: 1, source: "crm_users.id", target: "sf_customers.customer_id", score: 98, type: "Int64 ➝ Varchar" },
    { id: 2, source: "crm_users.first_name", target: "sf_customers.given_name", score: 94, type: "Text ➝ Text" },
    { id: 3, source: "crm_users.email", target: "sf_customers.contact_email", score: 100, type: "Text ➝ Text" },
    { id: 4, source: "crm_users.created_at", target: "sf_customers.signup_date", score: 87, type: "Timestamp ➝ Date" },
  ]);

  return (
    <div className="p-8 flex flex-col gap-6">
      <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Schema Intelligence Matcher</h3>
          <p className="text-xs text-zinc-500">AI-assisted mapping between `Sales_CRM_Source` and `Analytical_Warehouse`.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1 bg-green-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
            94% Avg Confidence
          </span>
          <button className="px-4 py-2 text-sm font-semibold text-zinc-950 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
            🤖 Re-Analyze Schema
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-4 font-semibold text-zinc-400">Source Column</th>
              <th className="p-4 font-semibold text-zinc-400">Target Column</th>
              <th className="p-4 font-semibold text-zinc-400">Confidence</th>
              <th className="p-4 font-semibold text-zinc-400">Cast Logic</th>
              <th className="p-4 font-semibold text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mappings.map((m) => (
              <tr key={m.id} className="border-b border-zinc-800/60 hover:bg-zinc-800/20 transition-colors">
                <td className="p-4 font-mono text-xs text-blue-400">{m.source}</td>
                <td className="p-4 font-mono text-xs text-indigo-400">{m.target}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${m.score}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">{m.score}%</span>
                  </div>
                </td>
                <td className="p-4 text-xs text-zinc-400 italic">
                  {m.type}
                </td>
                <td className="p-4 text-right">
                  <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 hover:underline">
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
