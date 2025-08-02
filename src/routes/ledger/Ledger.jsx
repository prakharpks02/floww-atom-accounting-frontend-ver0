import React, { useContext, useEffect, useRef, useState } from "react";
import { InputField } from "../../utils/ui/InputField";
import {
  CalendarDays,
  Download,
  Filter,
  IndianRupee,
  Loader2,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { ToastContainer } from "react-toastify";
import { LedgerContext } from "../../context/ledger/LedgerContext";
import { exportToExcel } from "../../utils/downloadExcel";

export const Ledger = () => {
  const [tempAllLedger, settempAllLedger] = useState(null);
  const { allLedgerList, getLedgerList } = useContext(LedgerContext);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    getLedgerList(setisLoading);
  }, []);

  useEffect(() => {
    settempAllLedger(allLedgerList);
  }, [allLedgerList]);

  console.log(tempAllLedger);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}
      {!isLoading && tempAllLedger && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] flex flex-col pb-6">
          <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
            Ledger
          </h1>
          <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
            Combined customer and vendor ledger
          </p>

          {/* ledger overview count  */}
          <LedgerCount AllLedger={tempAllLedger} />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
            <SearchLedger setData={settempAllLedger} />

            <div className="  grid grid-cols-8 gap-3 md:text-sm text-xs xl:text-base">
              <button
                aria-label="download excel"
                onClick={(e) => {
                  const expandedLedger = tempAllLedger.flatMap((ledger) => ({
                    Date: `${
                      ledger.ts?.toString()?.includes("-")
                        ? ledger.ts
                        : formatISODateToDDMMYYYY(ledger.ts)
                    }`,
                    "Entry ID": ledger.id,
                    Type: ledger.type,
                    Name: ledger.name,
                    Description: ledger.description,
                    "Debit Amount": ` ${
                      ledger.debit_amount != 0 &&
                      Number(ledger.debit_amount).toString() !== "NaN"
                        ? "₹"
                        : ""
                    } ${
                      ledger.debit_amount != 0 &&
                      Number(ledger.debit_amount).toString() !== "NaN"
                        ? Number(ledger.debit_amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : ""
                    } ${
                      ledger.debit_amount == 0 ||
                      ledger.debit_amount == undefined ||
                      ledger.debit_amount == null ||
                      Number(ledger.debit_amount).toString() === "NaN"
                        ? "-"
                        : ""
                    }`,
                    "Cedit Amount": `${
                      ledger.credit_amount != 0 &&
                      Number(ledger.credit_amount).toString() !== "NaN"
                        ? "₹"
                        : ""
                    } ${
                      ledger.credit_amount != 0 &&
                      Number(ledger.credit_amount).toString() !== "NaN"
                        ? Number(ledger.credit_amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : ""
                    } ${
                      !ledger.credit_amount ||
                      Number(ledger.credit_amount).toString() === "NaN"
                        ? "-"
                        : ""
                    }`,
                  }));
                  exportToExcel(expandedLedger, "ledger-list.xlsx");
                }}
                className=" hover:bg-[#0033662b] transition-all cursor-pointer col-span-5 flex items-center justify-center gap-2 px-4 lg:px-4 py-2 lg:py-3  bg-[#0033661A] text-[#2543B1] rounded-xl font-medium "
              >
                <Download className="w-4 h-4 " />
                <span className="">Download Excel</span>
              </button>
              {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button> */}
              <FilterLedgerButton setData={settempAllLedger} />
            </div>
          </div>

          {tempAllLedger && <ShowAllLedgers AllLedger={tempAllLedger} />}
        </div>
      )}
    </>
  );
};

const ShowAllLedgers = ({ AllLedger }) => {
  console.log(AllLedger);
  return (
    <>
      {AllLedger && (
        <div div className=" overflow-auto flex-1 min-h-[400px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Entry ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium text-center "
                >
                  Debit
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium text-center "
                >
                  Credit
                </th>
              </tr>
            </thead>
            <tbody>
              {AllLedger.map((ledger, idx) => {
                return (
                  <tr
                    key={`${idx}`}
                    onClick={(e) => {
                      navigate(`#`);
                    }}
                    className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                  >
                    <td className=" whitespace-nowrap px-4 py-4 text-[#4A4A4A] font-medium">
                      {formatISODateToDDMMYYYY(ledger.ts/1000)}
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#4A4A4A] font-medium">
                      {ledger.id}
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#A4A4A4] font-medium">
                      {ledger.type}
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#A4A4A4] font-medium">
                      {ledger.name}
                    </td>
                    <td className=" whitespace-nowrap px-4 py-4 text-[#4A4A4A] font-medium">
                      {ledger.description}
                    </td>
                    <td className=" text-center whitespace-nowrap px-4 py-4 text-[#FB3748] font-medium">
                      {ledger.debit_amount != 0 &&
                        Number(ledger.debit_amount).toString() !== "NaN" &&
                        "₹"}
                      {ledger.debit_amount != 0 &&
                        Number(ledger.debit_amount).toString() !== "NaN" &&
                        Number(ledger.debit_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      {(ledger.debit_amount == 0 ||
                        ledger.debit_amount == undefined ||
                        ledger.debit_amount == null ||
                        Number(ledger.debit_amount).toString() === "NaN") &&
                        "-"}
                    </td>
                    <td className=" text-center whitespace-nowrap px-4 py-4 text-[#2ECC71] font-medium">
                      {ledger.credit_amount != 0 &&
                        Number(ledger.credit_amount).toString() !== "NaN" &&
                        "₹"}
                      {ledger.credit_amount != 0 &&
                        Number(ledger.credit_amount).toString() !== "NaN" &&
                        Number(ledger.credit_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      {(!ledger.credit_amount ||
                        Number(ledger.credit_amount).toString() === "NaN") &&
                        "-"}
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

const FilterLedgerButton = ({ setData }) => {
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);
  const [distinctNames, setdistinctNames] = useState([]);
  const { allLedgerList } = useContext(LedgerContext);
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
    if (!allLedgerList) return;

    //get unique expense category
    const uniqueNames = Array.from(
      new Set(allLedgerList.map((e) => e.name))
    ).map((name) => ({ name: name, value: name }));
    setdistinctNames(uniqueNames);
  }, [allLedgerList]);

  return (
    <>
      <FilterLedgeredata
        setisOpen={setisFilterPannelOpen}
        ref={panelRef}
        isOpen={isFilterPannelOpen}
        setData={setData}
        uniqueNames={distinctNames}
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

const FilterLedgeredata = ({
  setisOpen,
  isOpen,
  ref,
  setData,
  uniqueNames = [],
}) => {
  const [type, settype] = useState("All");
  const [name, setname] = useState("All");
  const [debitAmount, setdebitAmount] = useState("All");
  const [creditAmount, setcreditAmount] = useState("All");
  const [sortByDate, setsortByDate] = useState("Default");
  const [sortByDebit, setsortByDebit] = useState("Default");
  const [sortByCredit, setsortByCredit] = useState("Default");
  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const { allLedgerList, handelMultipleFilter } = useContext(LedgerContext);

  const handelApplyFilter = async () => {
    const data = await handelMultipleFilter({
      type: type,
      name: name,
      debitAmount: debitAmount,
      creditAmount: creditAmount,
      debitSort: sortByDebit,
      creditSort: sortByCredit,
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

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setisResetFIlter(false);

      settype("All");
      setname("All");
      setdebitAmount("All");
      setcreditAmount("All");

      setsortByDate("Default");
      setsortByDebit("Default");
      setsortByCredit("Default");

      setData([...allLedgerList]);
      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

  //reset other when sort by debit chages other than default
  useEffect(() => {
    if (sortByDebit.toLowerCase() !== "default") {
      setsortByDate("Default");
      setsortByCredit("Default");
    }
  }, [sortByDebit]);
  //reset other when sort by credit chages other than default
  useEffect(() => {
    if (sortByCredit.toLowerCase() !== "default") {
      setsortByDate("Default");
      setsortByDebit("Default");
    }
  }, [sortByCredit]);
  //reset other when sort by date chages other than default
  useEffect(() => {
    if (sortByDate.toLowerCase() !== "default") {
      setsortByCredit("Default");
      setsortByDebit("Default");
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

        {/* Ledger Type Dropdown */}
        <div className="mb-4">
          <InputField
            value={type}
            setvalue={settype}
            readOnly={true}
            label={"Ledger Type"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              {
                name: "Sales",
                value: "Sales",
              },
              {
                name: "Purchase",
                value: "Purchase",
              },
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* creater name Dropdown */}
        <div className="mb-4">
          <InputField
            value={name}
            setvalue={setname}
            readOnly={true}
            label={"Name"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              ...(uniqueNames || []),
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* debit Amount Dropdown */}
        <div className="mb-4">
          <InputField
            value={debitAmount}
            setvalue={setdebitAmount}
            readOnly={true}
            label={"Debit Amount"}
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

        {/* credit Amount Dropdown */}
        <div className="mb-4">
          <InputField
            value={creditAmount}
            setvalue={setcreditAmount}
            readOnly={true}
            label={"Credit Amount"}
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

        {/* Sort Section */}
        <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base text-[#4A4A4A] font-semibold mb-4">
          Sort BY
        </h2>

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

        {/* Sort by debit Amount */}
        <div className="mb-4">
          <InputField
            value={sortByDebit}
            setvalue={setsortByDebit}
            readOnly={true}
            label={"Debit Amount"}
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
            placeholder={"Default"}
            hasDropDown={true}
          />
        </div>

        {/* Sort by credit Amount */}
        <div className="mb-4">
          <InputField
            value={sortByCredit}
            setvalue={setsortByCredit}
            readOnly={true}
            label={"Credit Amount"}
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
            placeholder={"Default"}
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

const LedgerCount = ({ AllLedger }) => {
  const [TotalReceivables, setTotalReceivables] = useState(-1);
  const [TotalPayables, setTotalPayables] = useState(-1);

  useEffect(() => {
    if (!AllLedger || !Array.isArray(AllLedger)) return;

    let temptotalReceivables = 0;
    let temptotalPayables = 0;

    AllLedger.forEach((entry) => {
      if (entry.debit_amount !== "-" && !isNaN(entry.debit_amount)) {
        temptotalPayables += parseFloat(entry.debit_amount);
      }
      if (entry.credit_amount !== "-" && !isNaN(entry.credit_amount)) {
        temptotalReceivables += parseFloat(entry.credit_amount);
      }
    });

    setTotalPayables(temptotalPayables);
    setTotalReceivables(temptotalReceivables);
  }, [AllLedger]);

  return (
    <div className=" grid grid-cols-2 gap-4 mb-6">
      {/* Total Receivables  */}
      {TotalPayables != -1 && (
        <div className=" p-4 border-2 border-[#0000001A] rounded-xl ">
          <p className="  text-[#2ECC71] font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base">
            <IndianRupee className=" w-5 h-5 inline-block" />
            {Number(TotalReceivables).toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className=" text-[#8E8E8E] text-sm ">Total Receivables</p>
        </div>
      )}

      {/* Total Payables  */}
      {TotalReceivables != -1 && (
        <div className=" p-4 border-2 border-[#0000001A] rounded-xl ">
          <p className="  text-[#FB3748] font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base">
            <IndianRupee className=" w-5 h-5 inline-block" />{" "}
            {Number(TotalPayables).toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>
          <p className=" text-[#8E8E8E] text-sm ">Total Payables</p>
        </div>
      )}
    </div>
  );
};

const SearchLedger = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchLedger, allLedgerList } = useContext(LedgerContext);

  const handelSearchLedger = async () => {
    console.log("searching");
    if (!query) setData(allLedgerList);

    const searchData = await searchLedger(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchLedger();
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
        placeholder="Search Ledger..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium md:text-sm  xl:text-base outline-none"
      />
    </div>
  );
};
