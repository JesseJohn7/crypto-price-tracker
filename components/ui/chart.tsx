"use client"

import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line as RechartsLine,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  Tooltip as RechartsTooltip,
} from "recharts"

export const ChartContainer = ({ children }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  )
}

export const LineChart = ({ data, children }) => {
  return <RechartsLineChart data={data}>{children}</RechartsLineChart>
}

export const Line = (props) => {
  return <RechartsLine type="monotone" {...props} />
}

export const XAxis = (props) => {
  return <RechartsXAxis dataKey="name" {...props} />
}

export const YAxis = (props) => {
  return <RechartsYAxis {...props} />
}

export const ChartTooltipContent = ({ children }) => {
  return <div className="bg-white border rounded p-2 shadow-md">{children}</div>
}

export const ChartTooltip = ({ children }) => {
  return <RechartsTooltip content={children} />
}

