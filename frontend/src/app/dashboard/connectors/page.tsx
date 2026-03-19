"use client";

import { useState, useEffect } from "react";

interface Connector {
  id: number;
  name: string;
  type: string;
  config: any;
  status?: string;
}

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("sqlite");
  const [configJson, setConfigJson] = useState('{"path": "/tmp/test.db"}');
  const [loading, setLoading] = useState(true);

  const fetchConnectors = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/connectors/");
      if (res.ok) {
        const data = await res.json();
        setConnectors(data.map((c: any) => ({ ...c, status: "Connected" })));
      }
    } catch (err) {
      console.error("Failed to fetch connectors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/v1/connectors/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          config: JSON.parse(configJson),
        }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setName("");
        fetchConnectors(); // Refresh
      }
    } catch (err) {
      alert("Failed to create connection. Check config JSON format.");
    }
  };

  return (
    <div className="p-8 flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Your Connectors</h3>
          <p className="text-xs text-zinc-500">Manage sources and targets for data synchronization.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold text-zinc-950 bg-white rounded-xl hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          ➕ New Connector
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 text-zinc-500 text-sm">Loading connectors...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectors.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm flex flex-col gap-4 group hover:border-zinc-700 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/10">
                    {c.type}
                  </span>
                  <h4 className="font-semibold text-zinc-200 mt-2">{c.name}</h4>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  {c.status || "Active"}
                </span>
              </div>
              
              <div className="border-t border-zinc-800/50 pt-3 text-xs text-zinc-500">
                <span className="font-mono text-[10px] truncate block">{JSON.stringify(c.config)}</span>
              </div>

              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 transition-colors">
                  Test Conn
                </button>
                <button className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium text-zinc-300 transition-colors">
                  Scan Schema
                </button>
              </div>
            </div>
          ))}
          
          <div 
            onClick={() => setIsModalOpen(true)}
            className="border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center p-6 text-zinc-500 hover:border-zinc-600 hover:text-zinc-400 cursor-pointer transition-all min-h-[160px]"
          >
            <span className="text-3xl mb-1">🔌</span>
            <span className="text-sm">Link another Database</span>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {isModalOpen && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="w-full max-w-md p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4 shadow-2xl">
            <h3 className="text-lg font-semibold text-zinc-200">New Database Connector</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Connector Name</label>
                <input 
                  value={name} onChange={(e) => setName(e.target.value)} required
                  placeholder="App_Source_MySQL" className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Type</label>
                <select 
                  value={type} onChange={(e) => setType(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:border-blue-500 text-zinc-300"
                >
                  <option value="sqlite">SQLite</option>
                  <option value="postgres">Postgres</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Config JSON</label>
                <textarea 
                  value={configJson} onChange={(e) => setConfigJson(e.target.value)} required rows={4}
                  className="px-3 py-2 font-mono text-xs rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-blue-500 text-zinc-300"
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-semibold text-zinc-400">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl text-sm font-semibold text-white">
                  Add Connector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
