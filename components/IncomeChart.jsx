import React from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

export default function IncomeChart({ data }) {
  if (!data || data.length === 0) return null

  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffe2c8" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tickFormatter={(v) => `€${v}`}
            tick={{ fontSize: 12 }}
            width={60}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value) => [`€${value}`, "Príjem"]}
            labelFormatter={(l) => `Dátum: ${l}`}
          />
          <Line type="monotone" dataKey="value" stroke="#ff8c38" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
