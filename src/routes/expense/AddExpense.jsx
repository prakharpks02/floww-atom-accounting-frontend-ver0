import React, { useContext, useEffect, useState } from "react";
import { InputField } from "../../utils/ui/InputField";
import { CalendarDays, Loader2, Plus, Upload } from "lucide-react";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { ToastContainer } from "react-toastify";
import { showToast } from "../../utils/showToast";
import { ExpenseContext } from "../../context/expense/ExpenseContext";
import { useParams } from "react-router-dom";

export const expenseCategories = [
  { name: "Food", value: "Food" },
  { name: "Travel", value: "Travel" },
  { name: "Stationary", value: "Stationary" },
  { name: "Business", value: "Business" },
  { name: "Marketing", value: "Marketing" },
  { name: "Other", value: "Other" },
];

export const AddExpense = () => {
  const { getExpenseDetails, expenseDetails, createExpense, updateExpense } =
    useContext(ExpenseContext);
  const [isDataFechting, setisDataFechting] = useState(true);
  const { expenseid } = useParams();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    getExpenseDetails(expenseid, setisDataFechting);
  }, []);

  console.log(expenseid)

  return (
    <>
      <ToastContainer />
      {isDataFechting && (
        <div className=" flex-1 flex justify-center items-center py-10 px-4 min-h-[300px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isDataFechting && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5">
          <div>
            <h1 className=" 2xl:text-[40px] xl:text-[32px] lg:text-[28px] md:text-2xl text-xl  font-semibold text-[#333333]">
              Add New Expense
            </h1>
            <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
              Create a new expense record
            </p>
          </div>
          <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5 rounded-2xl border-[1.5px] border-[#0000001A] ">
            {/* header  */}
            <div className=" mb-6">
              <h2 className=" mb-6  2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                Expense Information
              </h2>
            </div>

            <div className=" grid md:grid-cols-2 grid-cols-1 xl:gap-4 md:gap-2">
              <ExpenseTitle expenseDetails={expenseDetails} />
              <Category expenseDetails={expenseDetails} />
              <Date expenseDetails={expenseDetails} />
              <Amount expenseDetails={expenseDetails} />
            </div>
            {/* Attachments Section */}
            <UploadAttachment expenseDetails={expenseDetails} />

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button
                disabled={isLoading}
                onClick={(e) => {
                  expenseid?.toLowerCase() === "new" &&
                    createExpense(e, setisLoading);
                  expenseid?.toLowerCase() !== "new" &&
                    updateExpense(expenseid, setisLoading);
                }}
                className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
              >
                {isLoading ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <>
                    {expenseid?.toLowerCase() !== "new" ? "Update" : "Add"}{" "}
                    Expense
                    <Plus className=" ml-2 w-5 h-5 text-white inline-block" />
                  </>
                )}
              </button>
              <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ExpenseTitle = ({ className, expenseDetails }) => {
  const [title, settitle] = useState(expenseDetails?.title || "");
  const { createExpenseFormdispatch } = useContext(ExpenseContext);
  useEffect(() => {
    createExpenseFormdispatch({
      type: "UPDATE_FIELD",
      field: "title",
      value: title,
    });
  }, [title]);

  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={title}
        setvalue={settitle}
        label={"Expense Title*"}
        placeholder={"Enter Title of your Expense"}
      />
    </div>
  );
};

const Category = ({ className, expenseDetails }) => {
  const [category, setcategory] = useState(expenseDetails?.category || "");
  const { createExpenseFormdispatch } = useContext(ExpenseContext);
  useEffect(() => {
    createExpenseFormdispatch({
      type: "UPDATE_FIELD",
      field: "category",
      value: category,
    });
  }, [category]);
  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={category}
        setvalue={setcategory}
        label={"Category*"}
        placeholder={"Choose category of expense"}
        hasDropDown={true}
        dropDownData={expenseCategories || []}
      />
    </div>
  );
};

const Date = ({ className, expenseDetails }) => {
  const [date, setdate] = useState(
    expenseDetails?.date?.split("-").reverse().join("-") || ""
  );
  const { createExpenseFormdispatch } = useContext(ExpenseContext);
  useEffect(() => {
    createExpenseFormdispatch({
      type: "UPDATE_FIELD",
      field: "date",
      value: (date || "").split("-").reverse().join("-"),
    });
  }, [date]);
  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={date}
        inputType={"date"}
        icon={<CalendarDays className=" w-5 h-5 text-[#777777] " />}
        setvalue={setdate}
        label={"Date*"}
        placeholder={"dd-mm-yyyy"}
      />
    </div>
  );
};

const Amount = ({ className, expenseDetails }) => {
  const [amount, setamount] = useState(expenseDetails?.amount || "");
  const { createExpenseFormdispatch } = useContext(ExpenseContext);
  useEffect(() => {
    createExpenseFormdispatch({
      type: "UPDATE_FIELD",
      field: "amount",
      value: amount,
    });
  }, [amount]);
  return (
    <div className={`${className}`}>
      <p className="font-normal text-[#000000] mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs">
        Amount
      </p>
      <div className=" flex items-end ">
        <div className="text-[#333333c6] w-fit font-normal 2xl:text-lg md:text-base px-3 py-2 border-[1.5px] border-[#0000001A] rounded-lg mr-3">
          INR
        </div>
        <InputField
          hasLabel={false}
          inputType={"number"}
          className={"inline-block flex-1"}
          value={amount}
          setvalue={setamount}
          label={""}
          placeholder={"Enter amount"}
        />
      </div>
    </div>
  );
};

const UploadAttachment = ({ className, expenseDetails }) => {
  const [files, setfiles] = useState(
    expenseDetails?.attachments?.map((item) => {
      return {
        related_doc_name: item.related_doc_name,
        related_doc_url: item.related_doc_url,
      };
    }) || []
  );
  const { createExpenseFormdispatch } = useContext(ExpenseContext);
  useEffect(() => {
    const payload = files?.map((file) => {
      return {
        related_doc_name: file.name || file.related_doc_name,
        related_doc_url: file.name || file.related_doc_url,
      };
    });
    createExpenseFormdispatch({
      type: "UPDATE_FIELD",
      field: "attachments",
      value: payload,
    });
  }, [files]);

  return (
    <div className=" col-span-2 outline-[#00000029] rounded-lg p-3 border-2 border-[#00000033] border-dashed">
      {files && files.length > 0 && (
        <div>
          <ShowUploadedFiles files={files} setfiles={setfiles} />
          <div className=" flex flex-col gap-2 items-center my-5">
            <label
              htmlFor="upload-invoice"
              className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
            >
              Choose files
            </label>
            <p className="text-[#00000080] text-xs ">
              Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {(!files || files.length == 0) && (
        <label
          tabIndex={0}
          htmlFor="upload-invoice"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className=" w-10 h-8 text-[#000000] mb-3" />
          <p className="font-medium xl:text-base md:text-sm mb-1">
            Upload invoices, receipts, or related documents
          </p>
          <p className="text-[#00000080] text-xs ">
            Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
          </p>
        </label>
      )}

      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
        id="upload-invoice"
        multiple
        onChange={(e) => {
          const maxSizeMB = 10;
          const validFiles = [];
          const invalidFiles = [];

          const selectedFiles = Array.from(e.target.files);

          selectedFiles.forEach((file) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
              showToast(`"${file.name}" is too large. Max size is 10MB.`, 1);
            }
          });

          if (validFiles.length + files.length > 10) {
            showToast("Maximum 10 files can be selected", 1);
            return;
          }

          // Do something with the valid files (e.g. store them in state)
          console.log("Valid files:", validFiles);
          setfiles((prev) => [...prev, ...validFiles]);

          // Clear the input to allow re-uploading the same files
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};
