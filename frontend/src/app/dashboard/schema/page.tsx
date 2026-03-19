"use client";

import { useState, useEffect } from "react";

interface Match {
  source: string;
  target: string;
  confidence: number;
  reason: string;
}

export default function SchemaPage() {
  const [mappings, setMappings] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/agent/suggest?source_id=1&target_id=2&source_table=crm_users&target_table=dw_customers", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setMappings(data.suggestions?.matches || []);
      }
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <div className="p-8 flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center bg-zinc-900/40 p-5 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Schema Intelligence Matcher</h3>
          <p className="text-xs text-zinc-500">AI-assisted semantic mapping between continuous tables structures setups correctly.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchSuggestions}
            className="px-4 py-2 text-sm font-semibold text-zinc-950 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
          >
            🤖 Re-Analyze Schema
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 text-zinc-500 text-sm">AI analyzing schemas...</div>
      ) : (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden backdrop-blur-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-4 font-semibold text-zinc-400">Source Column (crm_users)</th>
                <th className="p-4 font-semibold text-zinc-400">Target Column (dw_customers)</th>
                <th className="p-4 font-semibold text-zinc-400">Confidence</th>
                <th className="p-4 font-semibold text-zinc-400">Match Reason</th>
                <th className="p-4 font-semibold text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((m, i) => (
                <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/10 transition-colors">
                  <td className="p-4 font-mono text-xs text-blue-400">crm_users.{m.source}</td>
                  <td className="p-4 font-mono text-xs text-indigo-400">dw_customers.{m.target}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${m.confidence}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-300">{m.confidence}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-zinc-400 italic">
                    {m.reason}
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
      )}
    </div>
  );
}
