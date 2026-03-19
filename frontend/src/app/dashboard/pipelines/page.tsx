"use client";

import { useState } from "react";
import ReactFlow, { Background, Controls, MarkerType } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "🔌 Source: CRM_MySQL" },
    position: { x: 50, y: 150 },
    style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #89b4fa", borderRadius: "12px", padding: "10px" }
  },
  {
    id: "2",
    data: { label: "🧠 AI Matcher (Auto)" },
    position: { x: 250, y: 150 },
    style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #f38ba8", borderRadius: "12px", padding: "10px" }
  },
  {
    id: "3",
    data: { label: "🛡️ Mask: PII Filter" },
    position: { x: 450, y: 100 },
    style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #a6e3a1", borderRadius: "12px", padding: "10px" }
  },
  {
    id: "4",
    data: { label: "❄️ Target: Snowflake" },
    position: { x: 650, y: 150 },
    style: { background: "#1e1e2e", color: "#cdd6f4", border: "1px solid #f9e2af", borderRadius: "12px", padding: "10px" }
  }
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", markerEnd: { type: MarkerType.Arrow } },
  { id: "e2-4", source: "2", target: "4", markerEnd: { type: MarkerType.Arrow } },
  { id: "e3-4", source: "3", target: "4", markerEnd: { type: MarkerType.Arrow } },
];

export default function PipelinesPage() {
  const [nodes] = useState(initialNodes);
  const [edges] = useState(initialEdges);

  return (
    <div className="p-0 flex h-full flex-col">
      <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 backdrop-blur-sm flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-zinc-200">Visual Transformation Studio</h3>
          <p className="text-xs text-zinc-500">Drag and drop nodes to design visual pipelines workflows mappings.</p>
        </div>
        <button className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white transition-all shadow-md">
          ▶️ Execute Pipeline
        </button>
      </div>

      <div className="flex-1 w-full bg-zinc-950/20 relative">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#52525b" gap={16} size={1} />
          <Controls className="!bg-zinc-900 !border-zinc-800 !text-zinc-400" />
        </ReactFlow>
        
        {/* Node Library Overlay */}
        <div className="absolute top-4 left-4 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-md w-48 flex flex-col gap-2 shadow-2xl">
          <span className="text-xs font-semibold text-zinc-400 mb-2">Node Library</span>
          {[
            { icon: "🔌", label: "Source" },
            { icon: "❄️", label: "Target" },
            { icon: "🧠", label: "AI Transformer" },
            { icon: "🛡️", label: "Security Mask" },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 border border-zinc-700/50 flex items-center gap-2 cursor-grab transition-all">
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
