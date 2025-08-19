import {
  Home,
  Share2,
  Package,
  Users,
  FileText,
  UserPlus,
  File,
  PanelLeftClose,
  PanelRightClose,
  ChevronRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CompanyContext } from "../../context/company/CompanyContext";
import { AnimatePresence, motion } from "framer-motion";
import { UserContext } from "../../context/userContext/UserContext";

const navbarRoutes = [
  {
    label: "Dashboard",
    icon: <Home className="w-full h-full" />,
    href: "/",
  },
  {
    hasDropDown: true,
    label: "Sales",
    icon: <Share2 className="w-full h-full" />,
    href: "/sales/salesList",
  },
  {
    hasDropDown: true,
    label: "Purchase",
    icon: <Package className="w-full h-full" />,
    href: "/purchase/purchaseList",
  },
  {
    hasDropDown: true,
    label: "Quotation",
    icon: <Package className="w-full h-full" />,
    href: "/quotation/quotationList",
  },
  {
    hasDropDown: true,
    label: "Customers",
    icon: <Users className="w-full h-full" />,
    href: "/customer/customerList",
  },
  {
    hasDropDown: true,
    label: "Vendors",
    icon: <Users className="w-full h-full" />,
    href: "/vendor/vendorsList",
  },
  {
    hasDropDown: true,
    label: "Expenses",
    icon: <Package className="w-full h-full" />,
    href: "/expense/expenseList",
  },
  {
    label: "Documents",
    icon: <FileText className="w-full h-full" />,
    href: "/documents",
  },
  {
    label: "Ledger",
    icon: <File className="w-full h-full" />,
    href: "/ledger",
  },
  {
    label: "Add members",
    icon: <UserPlus className="w-full h-full" />,
    href: "/addMembers",
  },
];

const dropDownDataList = {
  Sales: [
    {
      label: "Sales List",
      href: "/sales/salesList",
    },
    {
      label: "Add Sales",
      href: "/sales/addSales/new",
    },
    {
      label: "Invoice List",
      href: "/sales/allInvoiceList",
    },
    {
      label: "Create Invoice",
      href: "/sales/createInvoice",
    },
  ],
  Purchase: [
    {
      label: "Order List (PO)",
      href: "/purchase/OrderList",
    },
    {
      label: "Create Order (PO)",
      href: "/purchase/createOrder/new",
    },
    {
      label: "Purchase List",
      href: "/purchase/purchaseList",
    },
    {
      label: "Add Purchase",
      href: "/purchase/addPurchase/new",
    },
  ],
  Quotation: [
    {
      label: "Quotation List",
      href: "/quotation/quotationList",
    },
    {
      label: "Create Quotation",
      href: "/quotation/createQuotation/new",
    },
  ],
  Customers: [
    {
      label: "Customer List",
      href: "/customer/customerList",
    },
    {
      label: "Add Customer",
      href: "/customer/addCustomer/new",
    },
  ],
  Vendors: [
    {
      label: "Vendors List",
      href: "/vendor/vendorsList",
    },
    {
      label: "Add Vendors",
      href: "/vendor/addVendors/new",
    },
  ],
  Expenses: [
    {
      label: "Expense List",
      href: "/expense/expenseList",
    },
    {
      label: "Add Expense",
      href: "/expense/addExpense/new",
    },
  ],
};

export default function SideNavbar() {
  const [isPanelClosed, setisPanelClosed] = useState(false);
  const { pathname } = useLocation();
  const { userDetails } = useContext(UserContext);
  console.log(pathname);

  return (
    !(
      pathname.toLowerCase().includes("login") ||
      pathname.toLowerCase().includes("signup")
    ) && (
      <aside
        className={`
        ${
          isPanelClosed
            ? "md:w-[50px] xl:w-[65px]"
            : "2xl:w-[20%] xl:w-[25%] lg:w-[25%] md:w-[25%]"
        } sm:block hidden relative z-50 max-w-sm h-full overflow-y-auto bg-white border-r-[3px] border-[#E8E8E8] transition-all  ease-linear `}
      >
        <div
          className={`${
            isPanelClosed
              ? "px-2 justify-center"
              : "md:px-4 lg:px-6 justify-between"
          } xl:py-6 md:py-5 flex  items-center`}
        >
          <Link tabIndex={0} to={"/"}>
            <img
              loading="lazy"
              alt="floww icon"
              src="/icons/floww.png"
              className={`xl:w-[123px] lg:w-[90px] md:w-[75px] transition-all delay-100 ${
                isPanelClosed ? "hidden" : ""
              }`}
            />
          </Link>
          <button
            tabIndex={0}
            onClick={() => {
              setisPanelClosed(!isPanelClosed);
            }}
            aria-label="toggle panel button"
            className=" cursor-pointer"
          >
            {isPanelClosed ? (
              <PanelRightClose className=" md:w-5 xl:w-7" />
            ) : (
              <PanelLeftClose className=" md:w-5 xl:w-7" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1 pb-5">
          <SwitchCompanyButton isPanelClosed={isPanelClosed} />
          {navbarRoutes.map((item, index) => {
            return (
              !(
                item.label?.toLowerCase().includes("member") &&
                userDetails.email?.toLowerCase().includes("member")
              ) && (
                <SidebarLink
                  key={index}
                  icon={item.icon}
                  href={item.href}
                  label={item.label}
                  isPanelClosed={isPanelClosed}
                  hasDropDown={item.hasDropDown}
                />
              )
            );
          })}
        </nav>
      </aside>
    )
  );
}

function SidebarLink({ icon, label, href, isPanelClosed, hasDropDown }) {
  const pathname = window.location.pathname;
  let isActive;

  // console.log(pathname.split("/"))

  if (isPanelClosed && pathname === "/" && label === "Dashboard")
    isActive = true;
  else if (
    isPanelClosed &&
    pathname !== "/" &&
    label.toLowerCase().includes(
      pathname
        .split("/")[1]
        .trim()
        .replace(/ (?=.)/g, "")
        .toLowerCase()
    )
  )
    isActive = true;

  if (!isPanelClosed) {
    if (pathname === "/" && label === "Dashboard") isActive = true;
    else
      isActive =
        pathname.toLowerCase() ===
        label
          .trim()
          .replace(/ (?=.)/g, "")
          .toLowerCase();
  }

  const [isDropDownOpen, setisDropDownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <button
        tabIndex={0}
        onClick={(e) => {
          hasDropDown && !isPanelClosed && setisDropDownOpen(!isDropDownOpen);
          !hasDropDown && navigate(`${href}`);
          isPanelClosed && hasDropDown && navigate(`${href}`);
        }}
        className={`flex items-center  text-sm font-normal py-3 cursor-pointer transition-[background] duration-100 ease-linear
        ${
          isPanelClosed
            ? "justify-center"
            : " gap-3 md:px-3 lg:px-3 xl:px-5 2xl:px-6 "
        }
        ${
          isActive
            ? "bg-[#E8E8E8] text-[#333333] hover:bg-[#e0e0e0] md:text-xs lg:text-sm xl:text-base"
            : "text-[#777777] hover:bg-[#e2e2e24b] md:text-xs lg:text-sm xl:text-base"
        } `}
      >
        <span className="md:w-4 xl:w-5 2xl:w-6 md:h-4 xl:h-5 2xl:h-6">
          {icon}
        </span>
        <span
          className={`${
            isPanelClosed ? "hidden " : "opacity-100"
          } transition-opacity duration-150 ease-linear `}
        >
          {label}
        </span>
        {/* {hasDropDown && <span className="md:w-4 xl:w-5 2xl:w-6 md:h-4 xl:h-5 2xl:h-6"><ChevronDown className="w-5 h-5" /></span>} */}
      </button>
      {hasDropDown && (
        <DropDown
          isOpen={isDropDownOpen}
          data={dropDownDataList[label]}
          isPanelClosed={isPanelClosed}
        />
      )}
    </>
  );
}

const DropDown = ({ data = [], isOpen, isPanelClosed }) => {
  const DropDownLink = ({ data, isPanelClosed }) => {
    let isActive;
    const pathName = window.location.pathname.split("/")[2];

    if (
      pathName &&
      data.label
        .trim()
        .replace(/ (?=.)/g, "")
        .toLowerCase()
        .includes(pathName.toLowerCase())
    )
      isActive = true;
    else isActive = false;

    // console.log(pathName)

    return (
      <>
        {!isPanelClosed && (
          <Link
            to={data.href}
            className={`flex items-center text-sm font-normal py-3 cursor-pointer 
                ${
                  isActive
                    ? "bg-[#E8E8E8] text-[#333333] hover:bg-[#e0e0e0] md:text-xs lg:text-sm xl:text-base"
                    : "text-[#777777] hover:bg-[#e2e2e23a] md:text-xs lg:text-sm xl:text-base"
                } 
                ${
                  isPanelClosed
                    ? "justify-center"
                    : " xl:gap-3 gap-1 md:px-3 lg:px-3 xl:px-5 2xl:px-6 "
                }
                md:translate-x-2 lg:translate-x-4 xl:translate-x-7 2xl:translate-x-8
            `}
          >
            <ChevronRight className="w-4 h-4" />
            {data.label}
          </Link>
        )}
      </>
    );
  };

  return (
    <>
      <div
        className={`${isOpen ? "h-auto" : "h-0"} flex flex-col overflow-hidden`}
      >
        {data.map((item, index) => {
          return (
            <DropDownLink
              key={index}
              data={item}
              isPanelClosed={isPanelClosed}
            />
          );
        })}
      </div>
    </>
  );
};

const SwitchCompanyButton = ({ isPanelClosed }) => {
  const { companyDetails, companyList, getCompanyList } =
    useContext(CompanyContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLoading, setisLoading] = useState(true);
  const { userDetails } = useContext(UserContext);

  console.log(companyList);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCompanySelect = (company) => {
    localStorage.setItem("companyid", company.company_id);
    setIsOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    userDetails.email &&
      userDetails.email?.toLowerCase() != "member" &&
      getCompanyList(setisLoading);
  }, []);

  return (
    <div
      className={`relative inline-block  ${!isPanelClosed ? "px-2" : ""}`}
      ref={dropdownRef}
    >
      {/* Main Button */}
      <div
        className={`flex items-center gap-3 rounded-xl ${
          !isPanelClosed ? " px-4" : " justify-center"
        } py-3 bg-[#0000000D] cursor-pointer select-none`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img
          loading="lazy"
          src={
            companyDetails?.company_logo ||
            "https://api.dicebear.com/6.x/initials/svg?seed=G"
          } // fallback
          alt="logo"
          className="w-10 h-10 rounded-full text-xs bg-white object-cover"
        />
        {!isPanelClosed && (
          <div className="text-left">
            <p className="2xl:text-xl xl:text-lg lg:text-base text-sm font-semibold text-[#4A4A4A]">
              {companyDetails?.company_name || "Company"}
            </p>
          </div>
        )}
        {!isPanelClosed && companyList && companyList.length > 0 && (
          <div className="ml-auto bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition">
            <ChevronDown className=" text-gray-800" size={20} />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {companyList && (
        <AnimatePresence>
          {isOpen && isLoading && (
            <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
              <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
            </div>
          )}
          {isOpen && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute left-2 mt-1 w-fit max-h-[200px] z-50 bg-white border border-gray-200 rounded-lg shadow-md overflow-y-auto"
            >
              {companyList?.map((company) => (
                <div
                  key={company.company_id}
                  onClick={() => handleCompanySelect(company)}
                  className="flex items-center gap-3 pr-6 pl-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  <img
                    loading="lazy"
                    src={
                      company.company_logo ||
                      "https://api.dicebear.com/6.x/initials/svg?seed=C"
                    }
                    alt="logo"
                    className="w-8 h-8 text-xs rounded-full object-contain"
                  />
                  <div className="text-left">
                    <p className="2xl:text-xl xl:text-lg lg:text-base text-sm  font-medium text-gray-800">
                      {company.company_name}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
