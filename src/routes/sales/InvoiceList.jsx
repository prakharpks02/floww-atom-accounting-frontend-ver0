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
import { SalesContext } from "../../context/sales/salesContext";
// import data from "../../demo_data/allSales.json";
import {
  amountDropdown,
  currentFinancialYear,
  getAllMonths,
  getLast10FinancialYears,
  StatusFieldsDropDown,
} from "../../utils/dropdownFields";
import { InvoiceContext } from "../../context/invoiceContext/InvoiceContext";

export const AllInvoiceList = () => {
  const [tempAllInvoices, settempAllInvoices] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const { getAllInvoices, AllInvoiceList } = useContext(InvoiceContext);

  useEffect(() => {
    getAllInvoices(setisLoading);
  }, []);

  useEffect(() => {
    settempAllInvoices(AllInvoiceList);
  }, [AllInvoiceList]);

  console.log(tempAllInvoices);

  return (
    <>
      <div className="p-6 px-3 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] min-h-[400px] flex flex-col">
        <h1 className=" text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
          Invoice List
        </h1>
        <p className="text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
          Manage your invoice transactions
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
          <SearchSalesComponent setData={settempAllInvoices} />

          <div className=" grid grid-cols-9 gap-3 lg:text-sm text-sm xl:text-base">
            <button
              aria-label="download excel"
              onClick={(e) => {
                if (!tempAllInvoices) window.location.reload();

                const expandedInvoice = tempAllInvoices
                  .filter(
                    (invocie) =>
                      invocie?.invoice_url?.[0]?.invoice_url?.toLowerCase() ===
                      "n/a"
                  )
                  .flatMap((invoice) => ({
                    "Invoice No": invoice.invoice_number,
                    Date: invoice.invoice_date,
                    "Due Date": invoice.invoice_due_by,
                    Customer: invoice.customer_name || "Unknown",
                    "Sales ID": invoice.sales_id,
                  }));
                exportToExcel(expandedInvoice, "Invoice-List.xlsx");
              }}
              className=" hover:bg-[#0033662b] transition-all cursor-pointer md:col-span-5 col-span-3 flex items-center justify-center gap-2 px-2 md:px-4 lg:px-4 py-2 lg:py-3  bg-[#0033661A] text-[#2543B1] md:rounded-xl rounded-lg font-medium "
            >
              <Download className="sm:w-4 sm:h-4 w-5 h-5 " />
              <span className="md:block hidden">Download Excel</span>
            </button>
            {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button> */}
            {/* <FilterInvoiceButton
              className={""}
              currData={tempAllInvoices}
              setData={settempAllInvoices}
            /> */}
            <button
              aria-label="Add invoice"
              onClick={() => {
                navigate("/sales/createInvoice");
              }}
              className=" cursor-pointer md:col-span-4 col-span-6 flex items-center justify-center gap-1 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              <Plus className="w-5 h-5 " />{" "}
              <span className=" whitespace-nowrap">Add Invoice</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && tempAllInvoices && (
          <ShowSalesInTable AllInvoice={tempAllInvoices} />
        )}
      </div>
    </>
  );
};

const SearchSalesComponent = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchInvoice, AllInvoiceList } = useContext(InvoiceContext);

  const handelSearchSales = async () => {
    console.log("searching");
    if (!query) setData(AllInvoiceList);

    const searchData = await searchInvoice(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchSales();
  }, [isSeachNow]);

  useEffect(() => {}, [query]);

  return (
    <div className=" w-full sm:w-1/3 px-3 md:px-4 xl:px-6 py-2 lg:py-3 rounded-xl border-2 border-[#3333331A] flex items-center justify-between gap-2">
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
        placeholder="Search Sales..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium lg:text-sm text-xs  xl:text-base outline-none"
      />
    </div>
  );
};

const ShowSalesInTable = ({ AllInvoice }) => {
  const navigate = useNavigate();

  return (
    <>
      {AllInvoice && (
        <div div className=" overflow-auto flex-1 min-h-[400px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className=" text-center px-3 py-4 whitespace-nowrap font-medium "
                >
                  Download
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Invoice No
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Due Date
                </th>

                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Customer Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Sales ID
                </th>
              </tr>
            </thead>
            <tbody>
              {AllInvoice.map((invoice, idx) => {
                // return invoice.list_items.map((item, index) => {
                return (
                  <tr
                    key={`${idx}-${Math.random}`}
                    onClick={(e) => {
                      // navigate(`/sales/saleDetails/${invoice.sales_id}`);
                    }}
                    className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                  >
                    <td
                      onClick={(e) => {
                        e.stopPropagation();
                        // generatePDF(sale);
                      }}
                      className=" text-center px-3 py-4 text-[#ffffff] font-medium"
                    >
                      <button
                        aria-label="download invoice details"
                        className=" text-[#2543B1] cursor-pointer"
                      >
                        <Download className=" w-8" />
                      </button>
                    </td>
                    <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                      {invoice.invoice_number || "--"}
                    </td>
                    <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                      {invoice.invoice_date || "--"}
                    </td>
                    <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                      {invoice.invoice_due_by || "--"}
                    </td>
                    <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                      {invoice.customer_name || "--"}
                    </td>
                    <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium text-center">
                      {invoice.sales_id || "--"}
                    </td>
                  </tr>
                );
                // });
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const FilterInvoiceButton = ({ currData, setData }) => {
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);

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

  return (
    <>
      <FilterSalesdata
        setData={setData}
        setisOpen={setisFilterPannelOpen}
        ref={panelRef}
        isOpen={isFilterPannelOpen}
        currData={currData}
      />
      <button
        ref={buttonRef}
        aria-label="Filters"
        onClick={() => {
          setisFilterPannelOpen(!isFilterPannelOpen);
        }}
        className="hover:bg-[#e2e2e260] transition-all cursor-pointer md:col-span-3 col-span-3 flex flex-wrap items-center justify-center gap-2  lg:px-4 py-2 lg:py-3 border-2 border-[#3333331A] md:rounded-xl rounded-lg text-[#606060] font-medium "
      >
        <Filter className="sm:w-4 sm:h-4 w-5 h-5 text-[#2543B1]" />
        <span className="md:block hidden">Filters</span>
      </button>
    </>
  );
};

const FilterSalesdata = ({ setData, isOpen, ref, setisOpen, currData }) => {
  const [status, setstatus] = useState("All");
  const [amount, setamount] = useState("All");
  const [date, setdate] = useState("");
  const [financialYear, setfinancialYear] = useState("All");
  const [startMonth, setstartMonth] = useState("Default");
  const [endMonth, setendMonth] = useState("Default");
  const [sortByAmount, setsortByAmount] = useState("Default");
  const [sortByDate, setsortByDate] = useState("Default");
  const [sortByQuantity, setsortByQuantity] = useState("Default");

  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const { AllSalesList, handelMultipleFilter } = useContext(SalesContext);

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setData(AllSalesList);

      setisResetFIlter(false);

      setstatus("All");
      setamount("All");

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
      statusFilter: status,
      amountFilter: amount,
      dateFilter: date.split("-").reverse().join("-"),
      financialYearFilter: financialYear,
      amountSort: sortByAmount,
      dateSort: sortByDate,
      quantitySort: sortByQuantity,
      startMonth: startMonth,
      endMonth: endMonth,
    });
    // console.log(data)
    setData(data);
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
    }
  }, [startMonth, endMonth]);
  //reset start and end month when filter by fy chages other than all
  useEffect(() => {
    if (financialYear.toLowerCase() != "all") {
      setstartMonth("Default");
      setendMonth("Default");
    }
  }, [financialYear]);

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
              ...StatusFieldsDropDown,
              {
                name: "All",
                value: "All",
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
            dropDownData={[...amountDropdown, { name: "All", value: "All" }]}
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
                value: "High to low",
                name: "High to low",
              },
              {
                value: "Low to High",
                name: "Low to High",
              },
              {
                value: "Default",
                name: "Default",
              },
            ]}
            placeholder={"default"}
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
                value: "Recent First",
                name: "Recent First",
              },
              {
                value: "Oldest First",
                name: "Oldest First",
              },
              {
                value: "Default",
                name: "Default",
              },
            ]}
            placeholder={"Default"}
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
                value: "Descending",
                name: "Descending",
              },
              {
                value: "Ascending",
                name: "Ascending",
              },
              {
                value: "Default",
                name: "Default",
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
