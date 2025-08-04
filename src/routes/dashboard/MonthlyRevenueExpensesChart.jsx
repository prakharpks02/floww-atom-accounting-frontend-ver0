import React, { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { showToast } from "../../utils/showToast";
import { ChartColumn } from "lucide-react";


const RoundedTopBar = (props) => {
  const { fill, x, y, width, height } = props;

  if (height <= 0) return null;

  const radius = Math.min(10, height / 2); // Ensure radius does not exceed half the height

  const path = `
    M${x},${y + height}
    L${x},${y + radius}
    Q${x},${y} ${x + radius},${y}
    L${x + width - radius},${y}
    Q${x + width},${y} ${x + width},${y + radius}
    L${x + width},${y + height}
    Z
  `;

  return <path d={path} fill={fill} />;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 shadow-md rounded-md border border-[#E8E8E8]">
        <p className="font-semibold text-base text-[#4A4A4A]">{label}</p>
        <div className="flex flex-col gap-1 mt-1">
          {payload.map((entry, index) => (
            <div key={`tooltip-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: entry.color }}
              />
              <span className="md:text-xs xl:text-sm text-[#4A4A4A] font-medium ">
                {entry.name}:{" "}
                <span className="font-normal text-[#606060] ">
                  {entry.value.toLocaleString()}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const MonthlyRevenueExpensesChart = ({ className, dashboardData }) => {
  const [data, setdata] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  const formatYAxisTick = useCallback((value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  }, []);

  const combineWeeklyData = (weekly_sales, weekly_expense) => {
    if (!weekly_sales || !weekly_expense) return [];

    return weekly_sales.map((sale) => {
      const expense = weekly_expense.find(
        (exp) => exp.week_number === sale.week_number
      );
      return {
        name: sale.week.split("(")[0].trim(),
        revenue: sale.amount ,
        expenses: expense ? expense.amount : 0,
      };
    });
  };

  useEffect(() => {
    const result = combineWeeklyData(
      dashboardData?.weekly_sales,
      dashboardData?.weekly_expense
    );
    setdata(result);
    setisLoading(false);
  }, [dashboardData]);

  // console.log(data);

  return (
    <div
      className={`bg-white p-3 md:py-6 md:px-6 xl:px-8 2xl:px-10 2xl:py-8 rounded-2xl border-2 border-[#E8E8E8] ${className} `}
    >
      <h2 className=" text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-[#4A4A4A]">
        Monthly Revenue vs Expenses
      </h2>
      <p className=" text-xs text-[#8E8E8E] mb-6">
        The statistics show your revenue and expenses
      </p>

      <div className="h-[284px]">
        {!isLoading && data && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 0,
                right: 0,
                left: window.innerWidth > 500 ? -10 : -20,
                bottom: 0,
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{
                  fill: "#4A4A4A", // Gray-500 text color
                  fontSize: window.innerHeight > 500 ? "14px" : "10px", // Smaller font size
                }}
                axisLine={{ stroke: "#d1d5db" }} // Gray-300 line color
                tickLine={{ stroke: "#d1d5db" }} // Gray-300 tick line color
              />
              <YAxis
                tickFormatter={formatYAxisTick} // Use the custom formatter here
                tick={{
                  fill: "#6b7280",
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f0f0f0" }} // Light gray background when hovering
              />

              <Bar
                dataKey="revenue"
                fill="#2ECC71"
                name="Revenue"
                shape={<RoundedTopBar />}
              />
              <Bar
                dataKey="expenses"
                fill="#FB3748"
                name="Expenses"
                shape={<RoundedTopBar />}
              />
            </BarChart>
          </ResponsiveContainer>
        )}

        {(isLoading || !data) && (
          <div className="h-full flex items-center justify-center">
            <div>
              <ChartColumn className="w-15 h-15 text-[#4A4A4A] mx-auto" />
              <p className="text-[#4A4A4A] text-center text-sm">
                Bar Chart Placeholder
              </p>
              <span className=" text-[#8E8E8E] text-xs ">
                Revenue vs Expenses over time
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyRevenueExpensesChart;
