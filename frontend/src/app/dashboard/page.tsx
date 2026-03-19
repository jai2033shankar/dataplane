"use client";

export default function DashboardPage() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Metric Card 1 */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between backdrop-blur-sm">
        <div>
          <span className="text-sm font-medium text-zinc-400">Connected Sources</span>
          <div className="text-4xl font-bold mt-2">2</div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-emerald-400">
          <span>MySQL, SQLite</span>
        </div>
      </div>

      {/* Metric Card 2 */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between backdrop-blur-sm">
        <div>
          <span className="text-sm font-medium text-zinc-400">Active Pipelines</span>
          <div className="text-4xl font-bold mt-2">1</div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-amber-400">
          <span>1 execution pending approval</span>
        </div>
      </div>

      {/* Metric Card 3 */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between backdrop-blur-sm">
        <div>
          <span className="text-sm font-medium text-zinc-400">AI Matches Found</span>
          <div className="text-4xl font-bold mt-2">14</div>
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-blue-400">
          <span>92% avg confidence</span>
        </div>
      </div>

      {/* Large Activity Card */}
      <div className="md:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm">
        <h3 className="font-semibold mb-4 text-zinc-200">Recent Activity</h3>
        <div className="flex flex-col gap-3">
          {[
            { user: "AI Autopilot", action: "Matched tables with 94% confidence", time: "2m ago", type: "ai" },
            { user: "Admin", action: "Connected new SQLite source", time: "10m ago", type: "system" },
            { user: "Auditor", action: "Viewed compliance report", time: "1h ago", type: "audit" },
          ].map((act, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-zinc-800/30 border border-zinc-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${act.type === 'ai' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-700 text-zinc-300'}`}>
                  {act.type === 'ai' ? '🤖' : '👤'}
                </div>
                <div>
                  <div className="text-sm font-medium">{act.action}</div>
                  <div className="text-xs text-zinc-500">{act.user}</div>
                </div>
              </div>
              <span className="text-xs text-zinc-500">{act.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm flex flex-col">
        <h3 className="font-semibold mb-4 text-zinc-200">AI Agent Status</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-3xl mb-4 border border-blue-500/20">
            🤖
          </div>
          <div className="font-medium text-blue-400">Autopilot Idle</div>
          <p className="text-xs text-zinc-500 mt-1">Ready for schema mapping requests</p>
          <button className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl text-sm font-semibold">
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
