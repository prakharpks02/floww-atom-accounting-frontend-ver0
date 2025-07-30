import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444"];

export const ExpenseDataPieChart = ({ data, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="space-y-1 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Weekly Expense Breakdown</h2>
        <p className="text-sm text-gray-500">Distribution of expenses across weeks</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="week"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="30%"
              paddingAngle={2}
              label={({ week_number, amount }) => 
                amount > 0 ? `Week ${week_number}` : null
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={1}
                  opacity={entry.amount > 0 ? 1 : 0.3}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value}`, "Amount"]}
              contentStyle={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                padding: "8px 12px",
              }}
              itemStyle={{
                color: "#111827",
                fontSize: "14px",
                padding: "2px 0",
              }}
            />
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: "12px",
              }}
              payload={data.map((item, index) => ({
                id: item.week_number,
                value: `Week ${item.week_number}`,
                type: "circle",
                color: COLORS[index % COLORS.length],
              }))}
              formatter={(value, entry, index) => (
                <span className="text-sm text-gray-600">
                  Week {data[index].week_number}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};