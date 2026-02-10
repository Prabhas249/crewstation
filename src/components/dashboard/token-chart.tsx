"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TokenChartProps {
  data: { hour: string; tokens: number }[];
}

export function TokenChart({ data }: TokenChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="tokenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff543d" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ff543d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} interval={3} />
        <YAxis tick={{ fontSize: 10, fill: "#a3a3a3" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
          formatter={(value) => [`${Number(value).toLocaleString()} tokens`]}
        />
        <Area type="monotone" dataKey="tokens" stroke="#ff543d" strokeWidth={2} fill="url(#tokenGrad)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
