import MonthlyRevenueExpensesChart from "./MonthlyRevenueExpensesChart";
import { useContext, useEffect, useState } from "react";
import { ArrowRightLeft, Loader2 } from "lucide-react";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { ToastContainer } from "react-toastify";
import { DashBoardContext } from "../../context/dashBoard/DashBoardContext";
import { ExpenseDataPieChart } from "./ExpenseDataPieChart";

export const Dashboard = () => {
  const { dashBoardDetails, getDashBoardDetails } =
    useContext(DashBoardContext);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    getDashBoardDetails(setisLoading);
  }, []);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}
      {!isLoading && dashBoardDetails && (
        <div className="md:p-6 py-6 px-3 md:px-5 lg:px-3 xl:px-6 2xl:px-8 space-y-6 bg-gray-50">
          <div>
            <h1 className=" text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#4A4A4A] font-semibold">
              Dashboard
            </h1>
            <p className="text-xs lg:text-sm xl:text-base 2xl:text-lg text-[#A4A4A4] font-medium">
              Welcome back! Here's your business overview.
            </p>
          </div>

          {/* Metrics */}
          <OverAllData dashBoardDetails={dashBoardDetails} />

          <div className=" grid grid-cols-1 lg:grid-cols-2 space-y-4 md:gap-2 xl:gap-4">
            {/* monthly revenue - expense chart */}
            <MonthlyRevenueExpensesChart
              className={"col-span-1"}
              dashboardData={dashBoardDetails}
            />

            {/* expense break down  */}
            <ExpenseDataPieChart data={dashBoardDetails.weekly_expense} />
          </div>

          {/* Transactions */}
          <RecentTransaction dashBoardDetails={dashBoardDetails} />
        </div>
      )}
    </>
  );
};

const OverAllData = ({ dashBoardDetails }) => {
  return (
    <div className="md:grid flex grid-cols-1 md:grid-cols-3 lg:gap-4 gap-2 w-full overflow-auto pb-3">
      {[
        {
          label: "Revenue",
          value: dashBoardDetails?.total_sales || 0,
          icon: "/icons/total-sales.png",
        },
        {
          label: "Total Expenses",
          value: dashBoardDetails?.total_expense || "0",
          icon: "/icons/total-expenses.png",
        },
        {
          label: "Net Profit",
          value: dashBoardDetails?.net_profit || "0",
          icon: "/icons/net-profit.png",
        },
        // {
        //   label: "Revenue",
        //   value: dashBoardDetails?.revenue || "0",
        //   icon: "/icons/revenue.png",
        // },
      ].map((item, ind) => {
        return (
          <div
            key={ind}
            className="min-w-fit w-full overflow-auto bg-white border-[#E8E8E8] border-[2px] rounded-xl flex gap-1.5 lg:gap-3 items-center md:py-[14px] py-1.5 px-2 lg:px-4 "
          >
            <div className=" xl:p-3 p-2 rounded-[10px] bg-[#0033661A] ">
              <img
                loading="lazy"
                alt={item.label}
                src={item.icon}
                className="sm:w-4 w-3 text-xs object-contain"
              />
            </div>
            <div className=" overflow-auto">
              <p className=" whitespace-nowrap text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-[#4A4A4A] ">
                ₹{" "}
                {Number(item.value || 0).toString() !== "NaN"
                  ? Number(item.value || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 2,
                    })
                  : "---"}
              </p>
              <p className="text-[#BBBBBB] text-[10px] lg:text-xs xl:text-sm">
                {item.label}
              </p>
            </div>
          </div>
        );
      })}

      {/* net profit  */}
    </div>
  );
};

const RecentTransaction = ({ dashBoardDetails }) => {
  return (
    <div className="bg-white p-3 md:p-4 lg:p-6 xl:p-8 rounded-2xl border-2 border-[#E8E8E8] ">
      <div className="flex justify-between items-center mb-4 ">
        <div className=" max-w-[80%]">
          <h2 className="font-medium  text-[#4A4A4A] text-base lg:text-lg xl:text-xl 2xl:text-2xl ">
            Recent Transactions
          </h2>
          <p className="text-xs xl:text-sm text-[#8E8E8E]">
            This is the data of recent transactions from your accounts
          </p>
        </div>
        <a
          href="#"
          className="text-[#0077EE] underline underline-offset-1 text-xs lg:text-sm xl:text-base 2xl:text-lg font-medium hover:underline"
        >
          View all
        </a>
      </div>
      <div className="divide-y">
        {dashBoardDetails?.recent_transactions?.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 border-[1px] border-[#0000001A] rounded-xl xl:rounded-2xl "
          >
            <div className="flex items-center gap-4 ">
              <div className="px-3 py-2 bg-[#0033661A] rounded-lg xl:rounded-xl 2xl:rounded-2xl">
                <ArrowRightLeft className="text-blue-700 w-4" />
              </div>
              <div>
                <p className="font-medium text-[#333333] text-base lg:text-lg xl:text-xl 2xl:text-2xl ">
                  {item.type}
                </p>
                <p className="text-xs xl:text-sm 2xl:text-base text-[#8E8E8E]">
                  {item.name}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-medium text-base lg:text-lg xl:text-xl 2xl:text-2xl  ${
                  item.amount < 0 ? "text-[#FB3748]" : "text-[#1FC16B]"
                }`}
              >
                {item.amount < 0
                  ? `-₹ ${Math.abs(
                      Number(item.amount).toString() !== "NaN"
                        ? Number(item.amount)
                        : 0
                    ).toLocaleString("en-IN")}`
                  : `+₹ ${Number(item.amount).toLocaleString("en-IN")}`}
              </p>
              <p className="text-xs xl:text-sm 2xl:text-base font-light text-[#777777]">
                {item.timestamp && item.timestamp.includes("-")
                  ? item.timestamp
                  : formatISODateToDDMMYYYY(item.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
