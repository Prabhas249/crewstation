"use client";

import dynamic from "next/dynamic";
import { TopBar } from "@/components/layout/top-bar";
import { StatCard } from "@/components/dashboard/stat-card";
import { mockCostData, mockAgents, mockStats } from "@/lib/mock-data";
import { DollarSign, Zap, TrendingDown } from "lucide-react";

const DailyCostChart = dynamic(
  () => import("@/components/dashboard/cost-charts").then((mod) => mod.DailyCostChart),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-muted/50" /> }
);

const AgentCostBarChart = dynamic(
  () => import("@/components/dashboard/cost-charts").then((mod) => mod.AgentCostBarChart),
  { ssr: false, loading: () => <div className="h-[240px] animate-pulse rounded-lg bg-muted/50" /> }
);

const barColors = ["#ff543d", "#22d3ee", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#fb923c", "#94a3b8"];

const agentCostData = mockAgents
  .map((a) => ({
    name: a.name,
    cost: a.costToday,
    tokens: a.tokensUsed,
  }))
  .sort((a, b) => b.cost - a.cost);

export default function CostsPage() {
  const totalCost14d = mockCostData.reduce((sum, d) => sum + d.totalCost, 0);
  const avgDaily = totalCost14d / mockCostData.length;

  return (
    <div className="flex flex-col">
      <TopBar title="Costs" description="Token usage and spending analytics" />

      <div className="space-y-5 p-5">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Today's Cost"
            value={`$${mockStats.totalCostToday.toFixed(2)}`}
            change="-8% from yesterday"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            label="14-Day Total"
            value={`$${totalCost14d.toFixed(2)}`}
            icon={DollarSign}
          />
          <StatCard
            label="Daily Average"
            value={`$${avgDaily.toFixed(2)}`}
            icon={TrendingDown}
          />
          <StatCard
            label="Total Tokens"
            value={`${(mockStats.totalTokens / 1_000_000).toFixed(1)}M`}
            change="Across all agents"
            changeType="neutral"
            icon={Zap}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="glass-panel rounded-xl p-5">
            <h3 className="mb-4 text-[13px] font-semibold">Daily Cost (14 days)</h3>
            <div className="h-[240px]">
              <DailyCostChart data={mockCostData} />
            </div>
          </div>

          <div className="glass-panel rounded-xl p-5">
            <h3 className="mb-4 text-[13px] font-semibold">Cost by Agent (Today)</h3>
            <div className="h-[240px]">
              <AgentCostBarChart data={agentCostData} />
            </div>
          </div>
        </div>

        {/* Agent cost table */}
        <div className="glass-panel rounded-xl overflow-hidden">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-[13px] font-semibold">Agent Cost Breakdown</h3>
          </div>
          <div className="grid grid-cols-[1fr_100px_120px_100px] items-center gap-4 border-b border-border px-4 py-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">Agent</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground text-right">Cost</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground text-right">Tokens</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground text-right">% of Total</span>
          </div>
          <div className="divide-y divide-border">
            {agentCostData.map((agent, i) => (
              <div key={agent.name} className="grid grid-cols-[1fr_100px_120px_100px] items-center gap-4 px-4 py-3 transition-colors hover:bg-muted">
                <div className="flex items-center gap-2.5">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: barColors[i] }} />
                  <span className="text-[13px] font-medium">{agent.name}</span>
                </div>
                <span className="text-right font-mono text-[12px] tabular-nums">${agent.cost.toFixed(2)}</span>
                <span className="text-right font-mono text-[12px] tabular-nums text-muted-foreground">
                  {(agent.tokens / 1000).toFixed(0)}k
                </span>
                <span className="text-right font-mono text-[12px] tabular-nums text-muted-foreground">
                  {((agent.cost / mockStats.totalCostToday) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
