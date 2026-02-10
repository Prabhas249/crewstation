"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { CostEntry } from "@/lib/mock-data";

const barColors = ["#ff543d", "#22d3ee", "#4ade80", "#fbbf24", "#f87171", "#a78bfa", "#fb923c", "#94a3b8"];

export function DailyCostChart({ data }: { data: CostEntry[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="costAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff543d" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ff543d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
        />
        <Area type="monotone" dataKey="totalCost" stroke="#ff543d" strokeWidth={2} fill="url(#costAreaGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface AgentCostItem {
  name: string;
  cost: number;
  tokens: number;
}

export function AgentCostBarChart({ data }: { data: AgentCostItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} width={80} />
        <Tooltip
          contentStyle={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cost"]}
        />
        <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={barColors[i % barColors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
