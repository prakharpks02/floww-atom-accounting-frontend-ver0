import { Download, Edit, FileText, Loader2, Upload } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../utils/showToast";
import { useNavigate, useParams } from "react-router-dom";
import { ExpenseContext } from "../../context/expense/ExpenseContext";

export const ExpenseDetails = () => {
  const { getExpenseDetails, expenseDetails } = useContext(ExpenseContext);
  const { expenseid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getExpenseDetails(expenseid, setisLoading);
  }, []);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isLoading && expenseDetails && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
          {/* header  */}
          <div className=" mb-6">
            <div className="flex justify-between items-center mb-1">
              <div className="">
                <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                  VEN Office Supplies Co Partnership
                </h1>
                <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
                  View details about the vendor
                </p>
              </div>

              <div className=" flex gap-3 w-fit">
                <button
                  onClick={() => {
                    navigate(`/expense/addExpense/${expenseid}`);
                  }}
                  className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
                >
                  <Edit className="w-5 h-5" /> Edit Details
                </button>
                {/* <button className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#0033661A] text-[#2543B1] rounded-xl hover:bg-[#00336626] cursor-pointer transition">
                  <Upload className="w-5 h-5" /> Share
                </button> */}
              </div>
            </div>
          </div>

          {/* besic info  */}
          <BesicDetails className={"mb-8"} expenseDetails={expenseDetails} />

          {/* releated document  */}
          <RelatedDocuments expenseDetails={expenseDetails} />
        </div>
      )}
    </>
  );
};

const BesicDetails = ({ className, expenseDetails }) => {
  return (
    <div
      className={`rounded-lg w-full h-fit 2xl:p-8 xl:p-6 md:p-4 p-2 border-[1.5px] border-[#E8E8E8] ${className}`}
    >
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold text-[#4A4A4A] mb-4">
        Expense Basic Details
      </h2>
      <div className="grid grid-cols-5 gap-4 ">
        <div className=" overflow-x-auto">
          <p className="text-[#777777] font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm">
            Expense Title
          </p>
          <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base sm:text-sm text-xs text-[#4A4A4A]">
            {expenseDetails?.title || expenseDetails?.expense_title}
          </p>
        </div>
        <div className=" overflow-x-auto">
          <p className="text-[#777777] font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm">
            Category
          </p>
          <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base sm:text-sm text-xs text-[#4A4A4A]">
            {expenseDetails?.currency}
          </p>
        </div>
        <div className=" overflow-x-auto">
          <p className="text-[#777777] font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm">
            Expense ID
          </p>
          <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base sm:text-sm text-xs text-[#4A4A4A]">
            {expenseDetails?.expense_id}
          </p>
        </div>
        <div className=" overflow-x-auto">
          <p className="text-[#777777] font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm">
            Dates
          </p>
          <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base sm:text-sm text-xs text-[#4A4A4A]">
            {expenseDetails?.date}
          </p>
        </div>
        <div className=" overflow-x-auto">
          <p className="text-[#777777] font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm">
            Amount
          </p>
          <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base sm:text-sm text-xs text-[#4A4A4A]">
            ₹{expenseDetails?.amount}
          </p>
        </div>
      </div>
    </div>
  );
};

const RelatedDocuments = ({ expenseDetails }) => {
  const [files, setFile] = useState(expenseDetails?.attachments || []);
  const [isZipping, setisZipping] = useState(false);

  const downloadAllFiles = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    try {
      setisZipping(true);
      await downloadAsZip(files);
    } catch (error) {
      showToast(error.message, 1);
    } finally {
      setisZipping(false);
    }
  };

  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <div className="flex justify-between items-center mb-10 mx-auto">
        <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A]">
          Documents Related to Expense
        </h2>
        <button
          onClick={downloadAllFiles}
          tabIndex={0}
          disabled={isZipping}
          className="flex items-center gap-2 disabled:cursor-not-allowed cursor-pointer bg-[#0033661A] text-indigo-800 px-4 py-2 rounded-lg text-base font-medium hover:bg-[#0016661a] transition"
        >
          {isZipping ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin " />
              zipping...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download all
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 mb-4 max-h-[250px] overflow-auto">
        {files && files.length > 0 ? (
          <ShowUploadedFiles files={files} />
        ) : (
          <div className=" w-full flex flex-col items-center gap-4">
            <div className="text-[#2543B1] bg-[#0033661A] rounded-lg p-2 justify-center flex text-sm">
              <FileText className="h-8 w-8" />
            </div>{" "}
            <p className="text-[#606060] text-sm">No documents attached</p>
          </div>
        )}
      </div>
    </div>
  );
};
