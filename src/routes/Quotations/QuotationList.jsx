import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { showToast } from "../../utils/showToast";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  FilterIcon,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Share2,
  Upload,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { exportToExcel } from "../../utils/downloadExcel";
import { InputField } from "../../utils/ui/InputField";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { ToastContainer } from "react-toastify";
import { QuotationContext } from "../../context/quotation/QuotationContext";
import {
  getLast10FinancialYears,
  getAllMonths,
} from "../../utils/dropdownFields";

export const QuotationList = () => {
  const [tempAllQuotationList, settempAllQuotationList] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { getQuotationList, quotationList } = useContext(QuotationContext);

  useEffect(() => {
    getQuotationList(setisLoading);
  }, []);

  useEffect(() => {
    settempAllQuotationList(quotationList);
  }, [quotationList]);

  console.log(quotationList);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isLoading && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] flex flex-col">
          <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
            Quotations
          </h1>
          <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
            Manage your quotations and proposals
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
            <SearchQuotationComponent setData={settempAllQuotationList} />

            <div className=" grid xl:grid-cols-12 grid-cols-12 items-center gap-3 lg:text-sm text-xs xl:text-base">
              <button
                aria-label="download excel"
                onClick={(e) => {
                  e.preventDefault();
                  const expandedQuotation = tempAllQuotationList.flatMap(
                    (Quotation) =>
                      Quotation.list_items.map((item) => ({
                        "Quotation ID": Quotation.quotation_id,
                        Customer: Quotation.customer_name,
                        Email: Quotation.email,
                        Item: item.item_description,
                        Quantity: item.quantity,
                        Amount: item.gross_amount,
                        "Quote Date": Quotation.quotation_date,
                      }))
                  );
                  exportToExcel(expandedQuotation, "Quotation-list.xlsx");
                }}
                className=" hover:bg-[#0033662b] transition-all cursor-pointer col-span-4 h-full flex items-center justify-center gap-2 px-2 xl:px-4 py-2 xl:py-3  bg-[#0033661A] text-[#2543B1] rounded-xl font-medium "
              >
                <Download className="w-4  h-4 " />
                <span className="">Download</span>
              </button>
              {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button>*/}
              <FilterQuotationButton
                className={"col-span-3"}
                setData={settempAllQuotationList}
              />
              <button
                aria-label="Create Quotation"
                onClick={() => {
                  navigate("/quotation/createQuotation/new");
                }}
                className=" cursor-pointer col-span-5 flex items-center justify-center gap-1 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
              >
                <Plus className="w-5 h-5 " />{" "}
                <span className=" whitespace-nowrap">Create Quotation</span>
              </button>
            </div>
          </div>

          {!isLoading && tempAllQuotationList && (
            <ShowQuotationInTable AllQuotation={tempAllQuotationList} />
          )}
        </div>
      )}
    </>
  );
};

const ShowQuotationInTable = ({ AllQuotation }) => {
  const navigate = useNavigate();

  return (
    <>
      {AllQuotation && (
        <div div className=" overflow-auto flex-1 min-h-[300px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Quote Id
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  No. of Items
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Quote Date
                </th>
              </tr>
            </thead>
            <tbody>
              {AllQuotation?.map((Quotation, idx) => {
                // console.log(Quotation)
                return Quotation?.list_items?.map((item, index) => {
                  return (
                    <tr
                      key={`${idx}-${index}`}
                      onClick={(e) => {
                        navigate(
                          `/quotation/quotationDetails/${Quotation.quotation_id}`
                        );
                      }}
                      className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                    >
                      <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                        {Quotation.quotation_id}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                        {Quotation.customer_name}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                        {Quotation.email}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                        {item?.item_name}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium text-center">
                        {item?.quantity}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                        ₹
                        {Number(item?.gross_amount).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                        {Quotation.quotation_date}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const FilterQuotationButton = ({ className, AllQuotation, setData }) => {
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);
  const [distinctItems, setdistinctItems] = useState([]);
  const { quotationList } = useContext(QuotationContext);
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
    if (!quotationList || quotationList.length == 0) return;

    // Step 1: Flatten all item_names from all list_items
    const allItemNames = quotationList.flatMap((obj) =>
      obj.list_items.map((item) => item.item_name)
    );

    // Step 2: Get unique item names using a Set
    const uniqueItemNames = [...new Set(allItemNames)];

    // Step 3: Map into desired format
    const result = uniqueItemNames.map((name) => ({ name, value: name }));
    setdistinctItems(result);
  }, [quotationList]);

  return (
    <>
      <FilterQuotationdata
        items={distinctItems}
        ref={panelRef}
        isOpen={isFilterPannelOpen}
        setisOpen={setisFilterPannelOpen}
        setdata={setData}
      />
      <button
        ref={buttonRef}
        aria-label="Filters"
        onClick={() => {
          setisFilterPannelOpen(!isFilterPannelOpen);
        }}
        className={`hover:bg-[#e2e2e260] transition-all cursor-pointer flex flex-wrap items-center justify-center gap-2 px-2 lg:px-4 py-2 lg:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ${className}`}
      >
        <Filter className="w-4 h-4 text-[#2543B1]" />
        <span className="">Filters</span>
      </button>
    </>
  );
};

const FilterQuotationdata = ({
  setdata = () => {},
  isOpen,
  ref,
  items,
  setisOpen,
}) => {
  const [amount, setamount] = useState("All");
  const [itemName, setitemName] = useState("All");
  const [date, setdate] = useState("");
  const [financialYear, setfinancialYear] = useState("All");
  const [startMonth, setstartMonth] = useState("Default");
  const [endMonth, setendMonth] = useState("Default");
  const [sortByAmount, setsortByAmount] = useState("Default");
  const [sortByDate, setsortByDate] = useState("Default");
  const [sortByQuantity, setsortByQuantity] = useState("Default");
  const [isApplyFilter, setisApplyFilter] = useState(false);
  const [isResetFIlter, setisResetFIlter] = useState(false);

  const { handelMultipleFilter, quotationList } = useContext(QuotationContext);

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setdata(quotationList);

      setisResetFIlter(false);

      setamount("All");
      setitemName("All");

      setdate("");
      setfinancialYear("All");
      setstartMonth("Default");
      setendMonth("Default");

      setsortByAmount("Default");
      setsortByDate("Default");
      setsortByQuantity("Default");

      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

  const handelApplyFilter = async () => {
    const data = await handelMultipleFilter({
      amountFilter: amount,
      itemName: itemName,
      dateFilter: date.split("-").reverse().join("-"),
      financialYearFilter: financialYear,
      amountSort: sortByAmount,
      dateSort: sortByDate,
      quantitySort: sortByQuantity,
      startMonth: startMonth,
      endMonth: endMonth,
    });
    // console.log(data)
    setdata(data);
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
      setsortByQuantity("Default");
    }
  }, [sortByAmount]);
  //reset other when sort by date chages other than default
  useEffect(() => {
    if (sortByDate.toLowerCase() !== "default") {
      setsortByAmount("Default");
      setsortByQuantity("Default");
    }
  }, [sortByDate]);
  //reset other when sort by quantity chages other than default
  useEffect(() => {
    if (sortByAmount.toLowerCase() !== "default") {
      setsortByAmount("Default");
      setsortByDate("Default");
    }
  }, [sortByQuantity]);
  //reset financial year when filter by month chages other than all
  useEffect(() => {
    if (
      startMonth.toLowerCase() !== "default" &&
      endMonth.toLowerCase() !== "default"
    ) {
      setfinancialYear("All");
      setdate("");
    }
  }, [startMonth, endMonth]);
  //reset start and end month when filter by fy chages other than all
  useEffect(() => {
    if (financialYear.toLowerCase() != "all") {
      setstartMonth("Default");
      setendMonth("Default");
      setdate("");
    }
  }, [financialYear]);
  //reset start and end month and fc year when filter by date chages other than all
  useEffect(() => {
    if (date) {
      setstartMonth("Default");
      setendMonth("Default");
      setfinancialYear("All");
    }
  }, [date]);

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
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base text-[#4A4A4A] font-semibold mb-4">
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

        {/* Item name Dropdown */}
        <div className="mb-4">
          <InputField
            value={itemName}
            setvalue={setitemName}
            readOnly={true}
            label={"Item name"}
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              ...(items || []),
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

        {/* financial year  */}
        <div className=" space-y-5 mb-5">
          {/* Yearly */}
          <div className="flex items-center gap-3">
            <span className=" font-normal 2xl:text-lg xl:text-base lg:text-sm text-xs text-[#4A4A4A]">
              Yearly
            </span>
            <InputField
              value={financialYear}
              setvalue={setfinancialYear}
              label={""}
              hasLabel={false}
              placeholder={[
                {
                  value: "All",
                  name: "All",
                },
                ...financialYear,
              ]}
              icon={<CalendarDays className="w-5 h-5 text-[#777777]" />}
              inputType={"text"}
              hasDropDown={true}
              dropDownData={getLast10FinancialYears()}
              className={"w-full"}
            />
          </div>

          {/* Monthly */}
          <div className="flex items-center gap-3">
            <label className="font-normal 2xl:text-lg xl:text-base lg:text-sm text-xs text-[#4A4A4A]">
              Monthly
            </label>
            <div className="flex items-center justify-between gap-2 px-3 py-2 w-full">
              {/* Start Month */}
              <InputField
                value={startMonth}
                setvalue={setstartMonth}
                label={""}
                hasLabel={false}
                placeholder={startMonth}
                // icon={<CalendarDays className="w-5 h-5 text-[#777777]" />}
                inputType={"text"}
                hasDropDown={true}
                dropDownData={getAllMonths}
              />

              <span className="text-gray-500">-</span>

              {/* End Month */}
              <InputField
                value={endMonth}
                setvalue={setendMonth}
                label={""}
                hasLabel={false}
                placeholder={endMonth}
                // icon={<CalendarDays className="w-5 h-5 text-[#777777]" />}
                inputType={"text"}
                hasDropDown={true}
                dropDownData={getAllMonths}
              />
            </div>
          </div>
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
            placeholder={"High to Low"}
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
            placeholder={"Recent First"}
            hasDropDown={true}
          />
        </div>

        {/* Sort by No of Items */}
        <div>
          <InputField
            value={sortByQuantity}
            setvalue={setsortByQuantity}
            readOnly={true}
            label={"No of Items"}
            dropDownData={[
              {
                value: "Default",
                name: "Default",
              },
              {
                value: "Descending",
                name: "Descending",
              },
              {
                value: "Ascending",
                name: "Ascending",
              },
            ]}
            placeholder={"Ascending"}
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

const SearchQuotationComponent = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchQuotation, quotationList } = useContext(QuotationContext);

  const handelSearchQuotation = async () => {
    console.log("searching");
    if (!query) setData(quotationList);

    const searchData = await searchQuotation(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchQuotation();
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
        placeholder="Search Quotations..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium text-xs lg:text-sm  xl:text-base outline-none"
      />
    </div>
  );
};
