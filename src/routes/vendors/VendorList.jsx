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
  Plus,
  Search,
  Share2,
  Upload,
  X,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { exportToExcel } from "../../utils/downloadExcel";
import { InputField } from "../../utils/ui/InputField";
import { VendorContext } from "../../context/vendor/VendorContext";
import { ToastContainer } from "react-toastify";

export const VendorList = () => {
  const [localVendorsList, setlocalVendorsList] = useState(null); // this will have the filtered and without filtered customer list that's why its local customer list
  const { getAllVendors, AllVendorList } = useContext(VendorContext);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true);

  // set customer list from customer context to local customer list
  useEffect(() => {
    setlocalVendorsList(AllVendorList);
  }, [AllVendorList]);

  // call the get customer list function at the first rendering
  useEffect(() => {
    getAllVendors(setisLoading);
  }, []);

  console.log(localVendorsList);

  return (
    <>
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] flex flex-col">
        <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
          Vendors
        </h1>
        <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
          Manage your vendor relationships
        </p>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
          <SearchVendorList setData={setlocalVendorsList} />

          <div className=" grid grid-cols-9 gap-3 lg:text-sm text-xs xl:text-base">
            <button
              aria-label="download excel"
              onClick={(e) => {
                e.preventDefault();
                const expandedVendors = localVendorsList.flatMap((Vendor) => ({
                  "Vendor ID": Vendor.vendor_id,
                  "Vendor Name": Vendor.vendor_name,
                  Email: Vendor.email,
                  "Contact No": Vendor.contact_no,
                  Company: Vendor.company_name,
                }));
                exportToExcel(expandedVendors, "vendor-list.xlsx");
              }}
              className=" hover:bg-[#0033662b] transition-all cursor-pointer col-span-5 flex items-center justify-center gap-2 px-2 lg:px-4 py-2 lg:py-3  bg-[#0033661A] text-[#2543B1] rounded-xl font-medium "
            >
              <Download className="w-4  h-4 " />
              <span className="">Download Excel</span>
            </button>
            {/* <button aria-label='Share'
                            className=" hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium ">
                            <Upload className="w-4 h-4 text-[#2543B1]" /><span className=''>Share</span>
                        </button> */}
            {/* <FiltervendorButton
              setData={setlocalVendorsList}
              currData={localVendorsList}
            /> */}
            <button
              aria-label="Create vendor"
              onClick={() => {
                navigate("/vendor/addVendors/new");
              }}
              className=" cursor-pointer col-span-4 flex items-center justify-center gap-1 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              <Plus className="w-5 h-5 " /> <span className="">Add Vendor</span>
            </button>
          </div>
        </div>

        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && localVendorsList && (
          <ShowVendorsInTable AllVendors={localVendorsList} />
        )}
      </div>
    </>
  );
};

const ShowVendorsInTable = ({ AllVendors }) => {
  const navigate = useNavigate();

  return (
    <>
      <ToastContainer />
      {AllVendors && (
        <div div className=" overflow-auto flex-1 min-h-[300px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Vendor ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Vendor name
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
                  Phone
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Company
                </th>
                {/* <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Type
                </th> */}
              </tr>
            </thead>
            <tbody>
              {AllVendors.map((Vendor, idx) => (
                <tr
                  key={idx}
                  onClick={(e) => {
                    navigate(`/vendor/vendorDetails/${Vendor.vendor_id}`);
                  }}
                  className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                >
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Vendor.vendor_id}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Vendor.vendor_name}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                    {Vendor.email}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#A4A4A4] font-medium">
                    {Vendor.contact_no}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Vendor.company_name}
                  </td>
                  {/* <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Vendor.company_type}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

const FiltervendorButton = ({ setData, currData }) => {
  const [companies, setcompanies] = useState([]);
  const [AllTypes, setAllTypes] = useState([]);
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);
  const { vendors } = useContext(VendorContext);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!vendors) return;
    const uniqueCompanies = Array.from(
      new Map(
        vendors.map((obj) => [
          obj.company_name,
          { name: obj.company_name, value: obj.company_name },
        ])
      ).values()
    );

    setcompanies(uniqueCompanies);

    const uniqueTypes = Array.from(
      new Map(
        vendors.map((obj) => [
          obj.company_type,
          { name: obj.company_type, value: obj.company_type },
        ])
      ).values()
    );

    setAllTypes(uniqueTypes);
  }, [vendors]);

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
      <Filtervendordata
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
        className="hover:bg-[#e2e2e260] transition-all cursor-pointer col-span-3 flex flex-wrap items-center justify-center gap-2 px-2 xl:px-4 py-1 xl:py-3 border-2 border-[#3333331A] rounded-xl text-[#606060] font-medium "
      >
        <Filter className="w-4 h-4 text-[#2543B1]" />
        <span className="">Filters</span>
      </button>
    </>
  );
};

const Filtervendordata = ({
  setData,
  isOpen,
  ref,
  setisOpen,
  currData,
  companies,
  allTypes,
}) => {
  const [companyName, setcompanyName] = useState("All");
  const [CompanyType, setCompanyType] = useState("All");
  const [vendorName, setvendorName] = useState("All");
  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const { vendors, handelMultipleFilter } = useContext(VendorContext);

  useEffect(() => {
    const handelIsResetFilters = async () => {
      setData(vendors);
      setcompanyName("All");
      setvendorName("All");
      setCompanyType("All");
      setisResetFIlter(false);
      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

  const handelApplyFilter = async () => {
    const data = await handelMultipleFilter({
      amountFilter: amount,
      amountSort: sortByAmount,
      dateSort: sortByDate,
      quantitySort: sortByQuantity,
      data: currData,
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

  return (
    <>
      {isOpen && (
        <div className=" fixed top-0 left-0 w-[100dvw] h-[100dvh] bg-[#00000077] backdrop-blur-xs" />
      )}
      <div
        ref={ref}
        className={` bg-white fixed transition-transform duration-400 top-20 overflow-y-auto h-[calc(100dvh-80px)] right-0 
                     border-[3px] border-[#E8E8E8] p-4 xl:p-6 sm:max-w-none w-fit lg:min-w-[435px] md:min-w-[335px] max-w-xs
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

        {/* Vendor type Field 
        <div className="mb-4">
          <InputField
            value={CompanyType}
            setvalue={setCompanyType}
            readOnly={true}
            label={"Vendor type"}
            dropDownData={[
              {
                value: "All",
                name: "All",
              },
              ...(allTypes || []),
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div> */}

        {/* vendor Dropdown */}
        <div className="mb-4">
          <InputField
            value={vendorName}
            setvalue={setvendorName}
            readOnly={true}
            label={"Vendor name"}
            dropDownType="usersData"
            dropDownData={[
              {
                name: "All",
                value: "All",
              },
              {
                name: "Person 1",
                email: "person1@estatepilot.com",
                avatar: "https://randomuser.me/api/portraits/women/1.jpg",
              },
              {
                name: "Person 2",
                email: "person2@estatepilot.com",
                avatar: "https://randomuser.me/api/portraits/women/2.jpg",
              },
              {
                name: "Person 3",
                email: "person3@estatepilot.com",
                avatar: "https://randomuser.me/api/portraits/women/3.jpg",
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

const SearchVendorList = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchVendor, AllVendorList } = useContext(VendorContext);

  const handelSearchVendor = async () => {
    console.log("searching");
    if (!query) setData(AllVendorList);

    const searchData = await searchVendor(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchVendor();
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
        placeholder="Search vendors..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium lg:text-sm text-xs xl:text-base outline-none"
      />
    </div>
  );
};
