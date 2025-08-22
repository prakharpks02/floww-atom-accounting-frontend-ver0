import { useContext, useEffect, useState } from "react";
import { DashBoardContext } from "../../context/dashBoard/DashBoardContext";
import { ArrowRightLeft, Loader2 } from "lucide-react";

export const AllRecentTransactionList = () => {
  const [isLoading, setisLoading] = useState(true);

  const { dashBoardDetails, getDashBoardDetails } =
    useContext(DashBoardContext);
  const list = dashBoardDetails?.recent_transactions;
  useEffect(() => {
    !dashBoardDetails && getDashBoardDetails(setisLoading);
    dashBoardDetails && setisLoading(false);
  }, [dashBoardDetails]);

  if (!list || !Array.isArray(list) || list.length == 0) return;

  if (isLoading) {
    return (
      <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  return (
    <div className=" py-4 lg:px-10 md:px-6 px-4 max-w-5xl mx-auto">
      <div className=" max-w-[80%] mb-5">
        <h2 className="font-medium  text-[#4A4A4A] text-base lg:text-lg xl:text-xl 2xl:text-2xl ">
          Recent Transactions
        </h2>
        <p className="text-xs xl:text-sm text-[#8E8E8E]">
          This is the data of recent transactions from your accounts
        </p>
      </div>

      {list.map((item, idx) => {
        return (
          <div
            key={idx}
            className="flex justify-between items-center mb-3 p-3 border-[1px] border-[#0000001A] rounded-xl xl:rounded-2xl "
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
        );
      })}
    </div>
  );
};
