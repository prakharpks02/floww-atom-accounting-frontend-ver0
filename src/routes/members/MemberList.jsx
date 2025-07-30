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
  Edit,
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
import {
  FilterSalesOnAmount,
  FilterSalesOnStatus,
  searchSales,
  SortSalesOnAmount,
  SortSalesOnDate,
  SortSalesOnQuantity,
} from "../../data/sales/handelSalesdata";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import AddMemberModal from "./AddMemberModal";
import { AddmemberContext } from "../../context/addMember/AddmemberContext";
import { motion, AnimatePresence } from "framer-motion";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";

export const AllMembersList = () => {
  const [tempAllMemberList, settempAllMemberList] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [isAddMember, setisAddMember] = useState(false);
  const navigate = useNavigate();
  const { getAllMemberList, allMemberList } = useContext(AddmemberContext);

  useEffect(() => {
    getAllMemberList(setisLoading);
  }, []);
  useEffect(() => {
    settempAllMemberList(allMemberList);
  }, [allMemberList]);

  console.log(tempAllMemberList);

  return (
    <>
      <ToastContainer />
      {isAddMember && (
        <AddMemberModal
          setisMemberListLoading={setisLoading}
          isOpen={isAddMember}
          onClose={() => {
            setisAddMember(false);
          }}
        />
      )}
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}
      {!isLoading && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8 h-[calc(100dvh-80px)] min-h-[400px] flex flex-col">
          <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
            Members
          </h1>
          <p className=" md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
            Manage team members and their access
          </p>

          {/* member counts  */}
          <MemberCountComponent allmembers={tempAllMemberList} />

          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 mb-6">
            <SearchMembersComponent setData={settempAllMemberList} />

            <div className=" grid grid-cols-4 gap-3 md:text-sm text-xs xl:text-base">
              {/* <FilterMembersButton setData={settempAllMemberList} /> */}
              <button
                aria-label="Add Member"
                onClick={() => {
                  setisAddMember(true);
                }}
                className=" cursor-pointer col-span-4 flex items-center justify-center gap-2 px-2 lg:px-4 py-2 lg:py-3 bg-[#2543B1] border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
              >
                <Plus className="w-5 h-5 " />{" "}
                <span className="">Add Member</span>
              </button>
            </div>
          </div>

          {tempAllMemberList && (
            <ShowMembersInTable
              AllMembers={tempAllMemberList}
              getAllMemberList={getAllMemberList}
              setisLoading={setisLoading}
            />
          )}
        </div>
      )}
    </>
  );
};

const MemberCountComponent = ({ allmembers }) => {
  const [totalMembers, settotalMembers] = useState(-1);
  const [activeMembers, setactiveMembers] = useState(-1);
  const [inactiveMembers, setinactiveMembers] = useState(-1);

  useEffect(() => {
    allmembers && settotalMembers(allmembers.length);
    allmembers &&
      setactiveMembers(
        allmembers.filter((item) => item.member_status === "Active").length
      );
    allmembers &&
      setinactiveMembers(
        allmembers.filter((item) => item.member_status === "Inactive").length
      );
  }, [allmembers]);

  return (
    <div className=" grid grid-cols-3 gap-4 mb-6">
      {/* total member  */}
      {totalMembers != -1 && (
        <div className=" p-4 border-2 border-[#0000001A] rounded-xl ">
          <p className="  text-[#2543B1] font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base">
            {totalMembers}
          </p>
          <p className=" text-[#8E8E8E] text-sm ">Total Members</p>
        </div>
      )}
      {/* active member  */}
      {activeMembers != -1 && (
        <div className=" p-4 border-2 border-[#0000001A] rounded-xl ">
          <p className="  text-[#2ECC71] font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base">
            {activeMembers}
          </p>
          <p className=" text-[#8E8E8E] text-sm ">Active Members</p>
        </div>
      )}
      {/* inactiveMembers  */}
      {inactiveMembers != -1 && (
        <div className=" p-4 border-2 border-[#0000001A] rounded-xl ">
          <p className=" text-[#FB3748] font-semibold 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base">
            {inactiveMembers}
          </p>
          <p className=" text-[#8E8E8E] text-sm ">Inactive Members</p>
        </div>
      )}
    </div>
  );
};

const SearchMembersComponent = ({ setData }) => {
  const [query, setquery] = useState(null);
  const [isSeachNow, setisSeachNow] = useState(false);
  const { searchMember, allMemberList } = useContext(AddmemberContext);

  const handelSearchMember = async () => {
    console.log("searching");
    if (!query) setData(allMemberList);

    const searchData = await searchMember(query);
    setData(searchData);
    setisSeachNow(false);
  };

  useEffect(() => {
    isSeachNow && handelSearchMember();
  }, [isSeachNow]);

  return (
    <div className=" w-full sm:w-2/5 px-4 xl:px-6 py-2 lg:py-3 rounded-xl border-2 border-[#3333331A] flex items-center justify-between gap-2">
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
        placeholder="Search Members..."
        className="w-11/12 placeholder:text-[#A4A4A4] text-[#464646] font-medium text-sm xl:text-base outline-none"
      />
    </div>
  );
};

const ShowMembersInTable = ({ AllMembers, getAllMemberList, setisLoading }) => {
  const navigate = useNavigate();

  return (
    <>
      {AllMembers && (
        <div div className=" overflow-auto flex-1 min-h-[300px]">
          <table className="min-w-full text-sm text-left ">
            <thead className=" text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#4A4A4A] border-b-[#0000001A] border-b-[1px]  ">
              <tr className="">
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Last Login
                </th>
                <th
                  scope="col"
                  className="px-3 py-4 whitespace-nowrap font-medium "
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {AllMembers.map((Member, idx) => (
                <tr
                  key={idx}
                  onClick={(e) => {
                    navigate(`#`);
                  }}
                  className=" hover:bg-[#e6e6e6c4] cursor-pointer border-b-[#0000001A] border-b-[1px] text-xs md:text-sm xl:text-base 2xl:text-lg"
                >
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    <img
                      alt="user profile image"
                      src={Member.profile_icon_url}
                      className=" w-10 h-10 rounded-full text-xs mr-2 inline-block"
                    />
                    {Member.member_name}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Member.username}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {Member.role}
                  </td>
                  <td className=" whitespace-nowrap px-3 py-4 text-[#4A4A4A] font-medium">
                    {formatISODateToDDMMYYYY(Member.last_login)}
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className={` pr-4 py-4 whitespace-nowrap w-fit ${
                      Member.member_status === "Active"
                        ? "text-[#2ECC71]"
                        : "text-[#FB3748]"
                    } font-medium`}
                  >
                    {/* {Member.member_status} */}
                    <StatusCell
                      member={Member}
                      getAllMemberList={getAllMemberList}
                      setisLoading={setisLoading}
                    />
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

const FilterMembersButton = ({ setData }) => {
  const [allRoles, setallRoles] = useState([]);
  const [isFilterPannelOpen, setisFilterPannelOpen] = useState(false);
  const { allMemberList } = useContext(AddmemberContext);
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
    if (!allMemberList) return;

    const uniqueRoles = Array.from(
      new Set(allMemberList.map((user) => user.role))
    ).map((role) => ({
      name: role,
      value: role,
    }));
    setallRoles(uniqueRoles);
  }, [allMemberList]);

  return (
    <>
      <FilterMembersdata
        setData={setData}
        ref={panelRef}
        isOpen={isFilterPannelOpen}
        allRoles={allRoles}
        setisOpen={setisFilterPannelOpen}
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

const FilterMembersdata = ({ allRoles, setData, isOpen, ref, setisOpen }) => {
  const [lastLogin, setlastLogin] = useState("");
  const [status, setstatus] = useState("All");
  const [role, setrole] = useState("All");
  const { allMemberList } = useContext(AddmemberContext);
  const [isResetFIlter, setisResetFIlter] = useState(false);
  const [isApplyFilter, setisApplyFilter] = useState(false);

  const handelApplyFilter = async () => {
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
      setlastLogin("");
      setstatus("All");
      setrole("All");

      setData(allMemberList);
      setisOpen(false);
    };

    isResetFIlter && handelIsResetFilters();
  }, [isResetFIlter]);

  return (
    <>
      {isOpen && (
        <div className=" fixed top-0 left-0 w-[100dvw] h-[100dvh] bg-[#00000077] backdrop-blur-xs" />
      )}
      <div
        ref={ref}
        className={` bg-white fixed transition-transform duration-400 top-20 overflow-y-auto h-[calc(100dvh-80px)] right-0 
                     border-[3px] border-[#E8E8E8] p-4 xl:p-6 sm:max-w-none w-fit md:min-w-[435px] max-w-xs
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
                name: "All",
                value: "All",
              },
              {
                name: "Active",
                value: "Active",
              },
              {
                name: "Inactive",
                value: "Inactive",
              },
            ]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* role Dropdown */}
        <div className="mb-4">
          <InputField
            value={role}
            setvalue={setrole}
            readOnly={true}
            label={"Member Role"}
            dropDownData={[{ name: "All", value: "All" }, ...(allRoles || [])]}
            placeholder={"All"}
            hasDropDown={true}
          />
        </div>

        {/* last login date Field */}
        <div className="mb-6">
          <InputField
            value={lastLogin}
            setvalue={setlastLogin}
            label={"Last Login"}
            placeholder={"dd-mm-yyyy"}
            icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
            inputType={"date"}
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

const StatusCell = ({ member, getAllMemberList, setisLoading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(member.member_status);
  const dropdownRef = useRef(null);
  const { updateMember } = useContext(AddmemberContext);
  const [isUpdating, setisUpdating] = useState(false);

  const statusOptions = [
    { label: "Inactive", color: "text-[#FB3748]" },
    { label: "Active", color: "text-[#2ECC71]" },
  ];

  const getBgColor = (status = "") => {
    const s = status.toLowerCase();
    if (s === "inactive") return "bg-[#FB37481A] text-[#FB3748]";
    if (s === "active") return "bg-[#1FC16B1A] text-[#2ECC71]";
    return "";
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsEditing(false);
      setSelectedStatus(member.member_status);
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
    setSelectedStatus(member.member_status);
  }, [member]);

  const hasChanged = selectedStatus !== member.member_status;

  return (
    <>
      <ToastContainer />
      <div className=" w-fit" ref={dropdownRef}>
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
                  disabled={isUpdating}
                  className="ml-2 text-sm font-medium cursor-pointer text-gray-100 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-all"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await updateMember(setisUpdating, {
                        ...member,
                        member_status: selectedStatus,
                      });
                      getAllMemberList(setisLoading);
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
          <div className="relative w-fit">
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
    </>
  );
};
