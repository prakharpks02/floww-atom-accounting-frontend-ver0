import React, { useContext, useState, useRef, useEffect } from "react";
import { ExpenseContext } from "../../context/expense/ExpenseContext";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Search,
  Plus,
  Filter,
  CalendarDays,
  CheckCheck,
  X,
  CircleAlert,
  RotateCcw,
  Loader2,
  Edit,
  Check,
  CheckCircle,
  AlertCircle,
  Hourglass,
  ClockAlert,
  Clock1,
  Clock8,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { motion, AnimatePresence } from "framer-motion";
import { exportToExcel } from "../../utils/downloadExcel";


export const AllExpenseList = () => {
  const [tempExpenseList, settempExpenseList] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const { AllExpenseList, getAllExpense } = useContext(ExpenseContext);
  const navigate = useNavigate();

  useEffect(() => {
    getAllExpense(setisLoading);
  }, []);

  useEffect(() => {
    settempExpenseList(AllExpenseList);
  }, [AllExpenseList]);

  useEffect(() => {
    console.log("temp list ", tempExpenseList);
  }, [tempExpenseList]);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isLoading && tempExpenseList && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] flex flex-col">
          <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
            Expenses
          </h1>
          <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
            Track and manage your business expenses
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
            <SearchExpenseList setData={settempExpenseList} />

            <div className="  grid grid-cols-12 gap-3 lg:text-sm text-xs xl:text-base">
              <button
                aria-label="download excel"
                onClick={(e) => {
                  e.preventDefault();
                  const expandedExpense = tempExpenseList.flatMap(
                    (expense) => ({
                      "Created by": expense.created_by_member_name,
                      "Expense name": expense.title,
                      "Expense type": expense.category,
                      Amount: Number(expense.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }),
                      "Bill Date": expense.date,
                      Status: `${expense.expense_status} ${
                        expense.expense_status
                          ?.toLowerCase()
                          .includes("approved")
                          ? `(${expense.paid})`
                          : ""
                      }`,
                    })
                  );
                  exportToExcel(expandedExpense, "Expense-list.xlsx");
                }}
                className=" hover:bg-[#0033662b] transition-all cursor-pointer col-span-4 flex items-center justify-center gap-2 px-4 lg:px-4 py-2 lg:py-3  bg-[#0033661A] text-[#2543B1] rounded-xl font-medium "
              >
                <Download className="w-4 h-4 " />
                <span className="">Download</span>
              </button>
              {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button> */}
              <FilterExpenseButton setData={settempExpenseList} />
              <button
                aria-label="Add Customer"
                onClick={() => {
                  navigate("/expense/addExpense/new");
                }}
                className=" cursor-pointer col-span-5 flex items-center justify-center gap-2 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
              >
                <Plus className="w-5 h-5 " />{" "}
                <span className=" whitespace-nowrap">Add Expense</span>
              </button>
            </div>
          </div>

          {tempExpenseList && (
            <ShowAllExpenses
              AllExpense={tempExpenseList}
              getAllExpense={getAllExpense}
              setisLoading={setisLoading}
            />
          )}
        </div>
      )}
    </>
  );
};

const ShowAllExpenses = ({ AllExpense, getAllExpense, setisLoading }) => {
  const navigate = useNavigate();

  return (
    <>
      {AllExpense && (
        <div div className=" overflow-auto flex-1 min-h-[400px]">
          <table className="min-w-full text-left ">
            <thead className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Created By
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Expense name
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Bill Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium text-center "
                >
                  Reimbursement
                </th>
              </tr>
            </thead>
            <tbody>
              {AllExpense.map((expense, idx) => {
                return (
                  <tr
                    key={`${idx}`}
                    onClick={(e) => {
                      navigate(
                        `/expense/expenseDetails/${expense?.expense_id}`
                      );
                    }}
                    className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                  >
                    <td className=" w-fit mr-6 min-w-[150px] flex items-center px-4 py-4  font-medium">
                      <img
                        alt="profile image"
                        loading="lazy"
                        src={expense.created_by_profile_icon_url}
                        className="text-xs w-8 lg:w-10 h-8 lg:h-10 object-cover rounded-full mr-2"
                      />
                      <div className=" h-full ">
                        <p className=" text-[#4A4A4A] font-normal 2xl:text-xl xl:text-lg lg:text-base text-sm ">
                          {expense.created_by_member_name}
                        </p>
                        <p className=" text-[#8E8E8E] font-normal xl:text-base lg:text-sm text-xs ">
                          {expense.email_created_by}
                        </p>
                      </div>
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#4A4A4A] font-medium">
                      <p className="2xl:text-xl xl:text-lg lg:text-base text-sm">
                        {expense.expenseTitle || expense.title}
                      </p>
                      <p className=" text-[#777777] font-medium xl:text-base lg:text-sm text-xs ">
                        {expense.category}
                      </p>
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#A4A4A4] font-medium">
                      {expense.amount &&
                        Number(expense.amount).toString() !== "NaN" &&
                        `₹${Number(expense.amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#4A4A4A] font-medium">
                      {expense.date}
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className={`whitespace-nowrap px-4 py-4 font-medium `}
                    >
                      <StatusCell
                        expense={expense}
                        getAllExpense={getAllExpense}
                        setisLoading={setisLoading}
                      />
                    </td>
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className={`whitespace-nowrap px-4 py-4 font-medium flex items-center justify-center gap-2`}
                    >
                      <p
                        className={` w-fit rounded-lg px-3 py-3 text-center ${
                          expense.expense_status?.toLowerCase() === "rejected"
                            ? " bg-[#FB3748]"
                            : ""
                        }
                        ${
                          expense.expense_status?.toLowerCase() === "approved"
                            ? " bg-[#2ECC71]"
                            : ""
                        }
                        ${
                          expense.expense_status?.toLowerCase() === "pending"
                            ? " bg-[#DFB400]"
                            : ""
                        }`}
                      >
                        {expense.expense_status?.toLowerCase() ===
                          "rejected" && <X className="w-5 h-5 text-white" />}
                        {expense.expense_status?.toLowerCase() === "approved" &&
                          expense.paid?.toLowerCase() !== "paid" && (
                            <AlertCircle className="w-5 h-5 text-white" />
                          )}
                        {expense.expense_status?.toLowerCase() === "approved" &&
                          expense.paid?.toLowerCase() === "paid" && (
                            <CheckCheck className="w-5 h-5 text-white" />
                          )}
                        {expense.expense_status?.toLowerCase() ===
                          "pending" && (
                          <Clock8 className="w-5 h-5 text-white" />
                        )}
                      </p>
                      {expense.expense_status?.toLowerCase() === "approved" && (
                        <PaidOrUnpaidCell
                          expense={expense}
                          getAllExpense={getAllExpense}
                          setisLoading={setisLoading}
                        />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const FilterExpenseButton = ({ setData }) => {
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);
  const [distinctExpense, setdistinctExpense] = useState([]);
  const [distinctCreater, setdistinctCreater] = useState([]);
  const { AllExpenseList } = useContext(ExpenseContext);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const handelMouseDown = (e) => {
      if (
        buttonRef.current &&
        panelRef.current &&
        !buttonRef.current.contains(e.target) &&
        !panelRef.current.contains(e.target)
      ) {
        setisFilterPannelOpen(false);
      }
    };
    window.addEventListener("mousedown", handelMouseDown);

    return () => {
      window.removeEventListener("mousedown", handelMouseDown);
    };
  }, []);

  useEffect(() => {
    if (!AllExpenseList) return;

    //get unique expense category
    const uniqueCategories = Array.from(
      new Set(AllExpenseList.map((e) => e.category))
    ).map((category) => ({ name: category, value: category }));
    setdistinctExpense(uniqueCategories);

    //get unique creater category
    const uniqueCreaters = Array.from(
      new Set(AllExpenseList.map((e) => e.created_by_member_name))
    ).map((creater) => ({ name: creater, value: creater }));
    setdistinctCreater(uniqueCreaters);
  }, [AllExpenseList]);

  return (
    <>
      <FilterExpenseedata
        setData={setData}
        ref={panelRef}
        isOpen={isFilterPannelOpen}
        setisOpen={setisFilterPannelOpen}
        AllexpenseType={distinctExpense}
        allCreaters={distinctCreater}
      />
      <button
        ref={buttonRef}
        aria-label="Filters"
        onClick={() => {
          setisFilterPannelOpen(!isFilterPannelOpen);
        }}
        className="hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 lg:px-4 py-2 lg:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium "
      >
        <Filter className="w-4 h-4 text-[#2543B1]" />
        <span className="">Filters</span>
      </button>
    </>
  );
};

const FilterExpenseedata = ({
  setData,
  isOpen,
  ref,
  setisOpen,
  AllexpenseType,
  allCreaters,
}) => {
  const [status, setstatus] = useState("All");
  const [amount, setamount] = useState("All");
  const [date, setdate] = useState("");
  const [expenseType, setexpenseType] = useState("All");
  const [createdBy, setcreatedBy] = useState("All");
  const [sortByAmount, setsortByAmount] = useState("Default");
  const [sortByDate, setsortByDate] = useState("Default");
  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const { AllExpenseList, handelMultipleFilter } = useContext(ExpenseContext);

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setData(AllExpenseList);

      setisResetFIlter(false);

      setstatus("All");
      setamount("All");
      setdate("");
      setexpenseType("All");
      setcreatedBy("All");

      setsortByAmount("Default");
      setsortByDate("Default");

      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

  const handelApplyFilter = async () => {
    const data = await handelMultipleFilter({
      amountFilter: amount,
      status: status,
      dateFilter: date.split("-").reverse().join("-"),
      category: expenseType,
      createdBy: createdBy,
      amountSort: sortByAmount,
      dateSort: sortByDate,
    });
    // console.log("data" , data)
    setData([...data]);
    setisOpen(false);
    setisOpen(false);
  };

  useEffect(() => {
    if (isApplyFilter) {
      handelApplyFilter();
      setisApplyFilter(false);
    }
  }, [isApplyFilter]);

  //reset other when sort by amount chages other than default
  useEffect(() => {
    if (sortByAmount.toLowerCase() !== "default") {
      setsortByDate("Default");
    }
  }, [sortByAmount]);
  //reset other when sort by date chages other than default
  useEffect(() => {
    if (sortByDate.toLowerCase() !== "default") {
      setsortByAmount("Default");
    }
  }, [sortByDate]);

  return (
    <>
      {/* overlay  */}
      {isOpen && (
        <div className=" fixed top-0 left-0 w-[100dvw] h-[100dvh] bg-[#00000077] backdrop-blur-xs" />
      )}
      {/* main filters  */}
      <div
        ref={ref}
        className={`z-20 bg-white fixed transition-transform duration-400 top-0 overflow-y-auto h-[100dvh] right-0 
                     border-[3px] border-[#E8E8E8] p-4 xl:p-6 xl:w-[550px] w-fit lg:w-[435px] md:max-w-none max-w-xs
                ${isOpen ? " translate-x-0" : " translate-x-full"}
                `}
      >
        <div className="mb-4 flex justify-between items-center">
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base text-[#4A4A4A] font-semibold ">
            Filters
          </h2>
          {/* close button  */}
          <button
            aria-label="close filter panel"
            onClick={() => {
              setisOpen(!isOpen);
            }}
            className=" rounded-full bg-gray-100 hover:bg-gray-200 transition cursor-pointer p-2"
          >
            <X className="w-5 h-5 text-gray-600 " />
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="mb-4">
          <InputField
            value={status}
            setvalue={setstatus}
            readOnly={true}
            label={"Status"}
            dropDownData={[
              {
                value: "All",
                name: "All",
              },
              {
                value: "Rejected",
                name: "Rejected",
              },
              {
                value: "Approved",
                name: "Approved",
              },
              {
                value: "Pending",
                name: "Pending",
              },
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* Amount Dropdown */}
        <div className="mb-4">
          <InputField
            value={amount}
            setvalue={setamount}
            readOnly={true}
            label={"Amount"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              {
                name: "₹0 - ₹5,000",
                value: "₹0 - ₹5,000",
              },
              {
                name: "₹5,000 - ₹10,000",
                value: "₹5,000 - ₹10,000",
              },
              {
                name: "₹10,000+",
                value: "₹10,000+",
              },
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* expense type Dropdown */}
        <div className="mb-4">
          <InputField
            value={expenseType}
            setvalue={setexpenseType}
            readOnly={true}
            label={"Expense Type"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              ...(AllexpenseType || []),
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* expense creater Dropdown */}
        <div className="mb-4">
          <InputField
            value={createdBy}
            setvalue={setcreatedBy}
            readOnly={true}
            label={"Expense Created by"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              ...(allCreaters || []),
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* Date Picker Field */}
        <div className="mb-6">
          <InputField
            value={date}
            setvalue={setdate}
            label={"Date"}
            placeholder={"dd-mm-yyyy"}
            icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
            inputType={"date"}
          />
        </div>

        {/* Sort Section */}
        <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base text-[#4A4A4A] font-semibold mb-4">
          Sort BY
        </h2>

        {/* Sort by Amount */}
        <div className="mb-4">
          <InputField
            value={sortByAmount}
            setvalue={setsortByAmount}
            readOnly={true}
            label={"Amount"}
            dropDownData={[
              {
                value: "Default",
                name: "Default",
              },
              {
                value: "High to low",
                name: "High to low",
              },
              {
                value: "Low to High",
                name: "Low to High",
              },
            ]}
            placeholder={""}
            hasDropDown={true}
          />
        </div>

        {/* Sort by Date */}
        <div className="mb-4">
          <InputField
            value={sortByDate}
            setvalue={setsortByDate}
            readOnly={true}
            label={"Date"}
            dropDownData={[
              {
                value: "Default",
                name: "Default",
              },
              {
                value: "Recent First",
                name: "Recent First",
              },
              {
                value: "Oldest First",
                name: "Oldest First",
              },
            ]}
            placeholder={""}
            hasDropDown={true}
          />
        </div>

        {/* apply and reset button  */}
        <div className=" flex gap-4 items-center my-4">
          <button
            aria-label="apply filter"
            onClick={() => {
              setisApplyFilter(true);
            }}
            className=" cursor-pointer flex items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 bg-[#2543B1] hover:bg-[#2527b1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
          >
            Apply Filter
          </button>
          <button
            aria-label="reset filter"
            onClick={() => {
              setisResetFIlter(true);
            }}
            className="hover:bg-[#e2e2e260] h-full transition-all cursor-pointer flex flex-wrap items-center justify-center gap-2 px-3 lg:px-4 py-2 lg:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium "
          >
            <RotateCcw className=" w-5 h-5 text-gray-600 inline-block mr-1" />
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

const StatusCell = ({ expense, getAllExpense, setisLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    expense.expense_status || "Pending"
  );
  const dropdownRef = useRef(null);
  const { updateExpense } = useContext(ExpenseContext);
  const [isUpdating, setisUpdating] = useState(false);

  const statusOptions = [
    { label: "Rejected", color: "text-[#FB3748]" },
    { label: "Approved", color: "text-[#2ECC71]" },
    { label: "Pending", color: "text-[#DFB400]" },
  ];

  const getBgColor = (status) => {
    const s = status.toLowerCase();
    if (s === "rejected") return "bg-[#FB37481A] text-[#FB3748]";
    if (s === "approved") return "bg-[#1FC16B1A] text-[#2ECC71]";
    if (s === "pending") return "bg-[#FFDB431A] text-[#DFB400]";
    return "";
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsEditing(false);
      setSelectedStatus(expense.expense_status || "pending");
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    setSelectedStatus(expense.expense_status);
  }, [expense]);

  // console.log(expense.expense_status , selectedStatus)

  const hasChanged = selectedStatus !== (expense.expense_status || "Pending");

  return (
    <div className="" ref={dropdownRef}>
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <p
            className={`w-fit rounded-lg px-3 py-2 text-center ${getBgColor(
              selectedStatus
            )}`}
          >
            {selectedStatus}
          </p>
          {hasChanged ? (
            <>
              <Edit
                className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setIsEditing(true)}
              />
              <button
                className="ml-2 text-sm font-medium cursor-pointer text-gray-100 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-all"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await updateExpense(
                      { ...expense, expenseStatus: selectedStatus },
                      setisUpdating
                    );
                    getAllExpense(setisLoading);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {isUpdating ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <>
                    <span className="">Update</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <Edit
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      ) : (
        <div className="relative w-fit mx-auto">
          <AnimatePresence>
            <motion.ul
              key="dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 z-20 mt-1 w-40 rounded-lg bg-white shadow-lg border border-gray-200"
            >
              {statusOptions.map((option) => (
                <li
                  key={option.label}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-center ${option.color}`}
                  onClick={() => {
                    setSelectedStatus(option.label);
                    setIsEditing(false); // close dropdown on selection
                  }}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <p
            className={`rounded-lg px-3 py-2 text-center border w-40 ${getBgColor(
              selectedStatus
            )}`}
          >
            {selectedStatus}
          </p>
        </div>
      )}
    </div>
  );
};

const PaidOrUnpaidCell = ({ expense, getAllExpense, setisLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    expense.paid || "Unpaid"
  );
  const dropdownRef = useRef(null);
  const { updateExpense } = useContext(ExpenseContext);
  const [isUpdating, setisUpdating] = useState(false);

  const statusOptions = [
    { label: "Unpaid", color: "text-[#FB3748]" },
    { label: "Paid", color: "text-[#2ECC71]" },
  ];

  const getTextColor = (status) => {
    const s = status.toLowerCase();
    if (s === "unpaid") return " text-[#FB3748]";
    if (s === "paid") return " text-[#2ECC71]";
    return "";
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsEditing(false);
      setSelectedStatus(expense.paid || "Unpaid");
    }
  };

  useEffect(() => {
    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing]);

  useEffect(() => {
    setSelectedStatus(expense.paid || "Unpaid");
  }, [expense]);

  // console.log(expense.expense_status , selectedStatus)

  const hasChanged = selectedStatus !== (expense.paid || "Unpaid");

  return (
    <div className="" ref={dropdownRef}>
      {!isEditing ? (
        <div className="flex items-center gap-2">
          <p
            className={`w-fit md:text-sm text-xs text-center ${getTextColor(
              selectedStatus
            )}`}
          >
            ({selectedStatus})
          </p>
          {hasChanged ? (
            <>
              <Edit
                className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
                onClick={() => setIsEditing(true)}
              />
              <button
                className="ml-2 text-sm font-medium cursor-pointer text-gray-100 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-all"
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    await updateExpense(
                      { ...expense, paid: selectedStatus },
                      setisUpdating
                    );
                    getAllExpense(setisLoading);
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                {isUpdating ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <>
                    <span className="">Update</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <Edit
              className="w-4 h-4 cursor-pointer text-gray-500 hover:text-black"
              onClick={() => setIsEditing(true)}
            />
          )}
        </div>
      ) : (
        <div className="relative w-fit mx-auto">
          <AnimatePresence>
            <motion.ul
              key="dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 z-20 mt-1 w-fit rounded-lg bg-white shadow-lg border border-gray-200"
            >
              {statusOptions.map((option) => (
                <li
                  key={option.label}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-center ${option.color}`}
                  onClick={() => {
                    setSelectedStatus(option.label);
                    setIsEditing(false); // close dropdown on selection
                  }}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>

          <p
            className={`rounded-lg px-4 py-2 text-center border w-fit ${getTextColor(
              selectedStatus
            )}`}
          >
            {selectedStatus}
          </p>
        </div>
      )}
    </div>
  );
};

const SearchExpenseList = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchExpense, AllExpenseList } = useContext(ExpenseContext);

  const handelSearchExpense = async () => {
    console.log("searching");
    if (!query) setData(AllExpenseList);

    const searchData = await searchExpense(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchExpense();
  }, [isSeachNow]);

  return (
    <div className=" w-full sm:w-1/3 md:px-4 xl:px-6 md:py-2 lg:py-3 rounded-xl border-2 border-[#3333331A] flex items-center justify-between gap-2">
      <Search className="md:w-4 xl:w-6 md:h-4 xl:h-6 text-[#2543B1] " />
      <input
        tabIndex={0}
        value={query}
        onChange={(e) => {
          setquery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setisSeachNow(true);
          }
        }}
        type="text"
        placeholder="Search Expenses..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium lg:text-sm text-xs xl:text-base outline-none"
      />
    </div>
  );
};
