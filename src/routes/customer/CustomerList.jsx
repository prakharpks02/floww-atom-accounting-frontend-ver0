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
import { InputField } from "../../utils/ui/InputField";
import { CustomerContext } from "../../context/customer/customerContext";
import { exportToExcel } from "../../utils/downloadExcel";

export const AllCustomersList = () => {
  const { AllCustomersList, getAllCustomers } = useContext(CustomerContext);
  const [localCustomerList, setlocalCustomerList] = useState(AllCustomersList); // this will have the filtered and without filtered customer list that's why its local customer list
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();

  // set customer list from customer context to local customer list
  useEffect(() => {
    setlocalCustomerList(AllCustomersList);
  }, [AllCustomersList]);

  // call the get customer list function at the first rendering
  useEffect(() => {
    getAllCustomers(setisLoading);
  }, []);

  console.log(localCustomerList);

  return (
    <>
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] min-h-[400px] flex flex-col">
        <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
          Customers
        </h1>
        <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
          Manage your customer relationships
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
          <SearchCustomersComponent setData={setlocalCustomerList} />

          <div className=" grid grid-cols-12 gap-3 lg:text-sm text-xs xl:text-base">
            <button
              aria-label="download excel"
              onClick={(e) => {
                e.preventDefault();
                const expandedCustomers = localCustomerList.flatMap(
                  (Customer) => ({
                    "Customer ID": Customer.customer_id,
                    "Customer Name": Customer.customer_name,
                    Email: Customer.email,
                    "Contact No": Customer.contact_no,
                    Company: Customer.company_name,
                    "Customer Type": Customer.customer_type,
                  })
                );
                exportToExcel(expandedCustomers, "customer-list.xlsx");
              }}
              className=" hover:bg-[#0033662b] transition-all cursor-pointer col-span-4 flex items-center justify-center gap-2 px-4 xl:px-4 py-2 xl:py-3  bg-[#0033661A] text-[#2543B1] rounded-xl font-medium "
            >
              <Download className="w-4  h-4 " />
              <span className="">Download</span>
            </button>
            {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button> */}
            <FilterCustomersButton
              currData={localCustomerList}
              setData={setlocalCustomerList}
            />
            <button
              aria-label="Add Customer"
              onClick={() => {
                navigate("/customer/addCustomer/new");
              }}
              className=" cursor-pointer col-span-5 flex items-center justify-center gap-1 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              <Plus className="w-5 h-5 " />{" "}
              <span className=" whitespace-nowrap">Create Customers</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && localCustomerList && (
          <ShowCustomersInTable AllCustomers={localCustomerList} />
        )}
      </div>
    </>
  );
};

const SearchCustomersComponent = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchCustomer, AllCustomersList } = useContext(CustomerContext);

  const handelSearchCustomer = async () => {
    console.log("searching");
    if (!query) setData(AllCustomersList);

    const searchData = await searchCustomer(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchCustomer();
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
        placeholder="Search Customers..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium lg:text-sm  text-xs xl:text-base outline-none"
      />
    </div>
  );
};

const ShowCustomersInTable = ({ AllCustomers }) => {
  const navigate = useNavigate();

  return (
    <>
      {AllCustomers && (
        <div div className=" overflow-auto flex-1 min-h-[300px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Customer Id
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Customer name
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-4 py-4 whitespace-nowrap font-medium "
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {AllCustomers.map((Customer, idx) => (
                <tr
                  key={idx}
                  onClick={(e) => {
                    navigate(
                      `/customer/customerDetails/${Customer.customer_id}`
                    );
                  }}
                  className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] md:text-[10px] lg:text-sm xl:text-base 2xl:text-lg"
                >
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#4A4A4A] font-medium">
                    {Customer.customer_id}
                  </td>
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#4A4A4A] font-medium">
                    {Customer.customer_name}
                  </td>
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#A4A4A4] font-medium">
                    {Customer.email}
                  </td>
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#A4A4A4] font-medium">
                    {Customer.contact_no}
                  </td>
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#4A4A4A] font-medium">
                    {Customer.company_name}
                  </td>
                  <td className=" whitespace-nowrap max-w-[150px] overflow-x-auto px-4 py-4 text-[#4A4A4A] font-medium">
                    {Customer.customer_type}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const FilterCustomersButton = ({ setData, currData }) => {
  const [companies, setcompanies] = useState([]);
  const [AllTypes, setAllTypes] = useState([]);
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);

  const { AllCustomersList } = useContext(CustomerContext);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!AllCustomersList) return;
    const uniqueCompanies = Array.from(
      new Map(
        AllCustomersList.map((obj) => [
          obj.company_name,
          { name: obj.company_name, value: obj.company_name },
        ])
      ).values()
    );

    setcompanies(uniqueCompanies);
  }, [AllCustomersList]);

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
      <FilterCustomersdata
        setData={setData}
        currData={currData}
        ref={panelRef}
        setisOpen={setisFilterPannelOpen}
        isOpen={isFilterPannelOpen}
        companies={companies}
        allTypes={AllTypes}
      />
      <button
        ref={buttonRef}
        aria-label="Filters"
        onClick={() => {
          setisFilterPannelOpen(!isFilterPannelOpen);
        }}
        className="hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-2 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium "
      >
        <Filter className="w-4 h-4 text-[#2543B1]" />
        <span className="">Filters</span>
      </button>
    </>
  );
};

const FilterCustomersdata = ({
  setData,
  isOpen,
  ref,
  setisOpen,
  companies,
}) => {
  const [companyName, setcompanyName] = useState("All");
  const [CompanyType, setCompanyType] = useState("All");
  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const { AllCustomersList, filterCustomerList } = useContext(CustomerContext);

  // apply filter
  useEffect(() => {
    if (isApplyFilter) {
      const filteredData = filterCustomerList({
        type: CompanyType,
        companyName: companyName,
      });
      setData(filteredData);
      setisApplyFilter(false);
      setisOpen(false);
    }
  }, [isApplyFilter]);

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setData(AllCustomersList);
      setcompanyName("All");
      setCompanyType("All");
      setisResetFIlter(false);
      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

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

        {/* customer type Field  */}
        <div className="mb-4">
          <InputField
            value={CompanyType}
            setvalue={setCompanyType}
            readOnly={true}
            label={"Customer type"}
            dropDownData={[
              {
                value: "All",
                name: "All",
              },
              {
                value: "Individual",
                name: "Individual",
              },
              {
                value: "Business",
                name: "Business",
              },
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* company Dropdown */}
        <div className="mb-4">
          <InputField
            value={companyName}
            setvalue={setcompanyName}
            readOnly={true}
            label={"Company Name"}
            dropDownData={[
              {
                value: "All",
                name: "All",
              },
              ...(companies || []),
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
