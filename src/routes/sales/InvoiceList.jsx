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
import { downloadInvoiceAsPDF } from "../../utils/downloadInvoiceDetails";
import { CompanyContext } from "../../context/company/CompanyContext";
import { ToastContainer } from "react-toastify";
import { downloadAsZip } from "../../utils/downloadAsZip";

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
      <ToastContainer />
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
  const { companyDetails } = useContext(CompanyContext);
  const [isDownloading, setisDownloading] = useState(-1);
console.log(isDownloading)
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
                  className="px-3 py-4 text-center whitespace-nowrap font-medium "
                >
                  Sales ID
                </th>
              </tr>
            </thead>
            <tbody>
              {[...(AllInvoice || [])].reverse().map((invoice, idx) => {
                // return invoice.list_items.map((item, index) => {
                return (
                  <tr
                    key={`${idx}-${Math.random}`}
                    onClick={(e) => {
                      // navigate(`/sales/saleDetails/${invoice.sales_id}`);
                    }}
                    className=" hover:bg-[#e6e6e6c4] border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                  >
                    <td
                      onClick={async (e) => {
                        e.stopPropagation();
                        setisDownloading(idx);
                        if (
                          invoice.invoice_url[0]?.invoice_url.toLowerCase() ===
                          "n/a"
                        ) {
                          await downloadInvoiceAsPDF(
                            companyDetails,
                            invoice,
                          );
                        } else {
                          await downloadAsZip(
                            invoice.invoice_url,
                            `Invoice-douments`
                          );
                        }

                        setisDownloading(-1);
                      }}
                      className=" text-center cursor-pointer px-3 py-4 text-[#ffffff] font-medium"
                    >
                      <button
                        disabled={isDownloading === idx}
                        aria-label="download invoice details"
                        className=" disabled:cursor-not-allowed text-[#2543B1] cursor-pointer"
                      >
                        {isDownloading === idx ? (
                          <>
                            <Loader2 className=" w-5 animate-spin mx-auto" />
                          </>
                        ) : (
                          <Download className=" w-8" />
                        )}
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
