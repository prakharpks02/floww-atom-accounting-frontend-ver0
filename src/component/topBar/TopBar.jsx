import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function TopBar() {
  const navigate = useNavigate();
  const { userDetails, userLogout } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname } = useLocation();
  const toggleDropdown = () => setOpen(!open);
  const [isLoggingOut, setisLoggingOut] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    !(
      pathname.toLowerCase().includes("login") ||
      pathname.toLowerCase().includes("signup")
    ) && (
      <header
        className={`hidden relative w-full z-10  h-20 border-b-[3px] bg-white border-[#0000001A] md:px-3 lg:px-6 xl:px-10 py-3 md:flex justify-between items-center`}
      >
        <button
          tabIndex={0}
          onClick={() => {
            navigate("/");
          }}
          className="text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-black poppins w-auto "
        >
          Atom Books Dashboard
        </button>

        {/* user icon  */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={toggleDropdown}
          >
            <img
              loading="lazy"
              src={userDetails.image}
              alt="Profile image"
              className="w-10 h-10 text-xs rounded-full object-cover"
            />
            <div className="text-left poppins font-normal flex flex-col justify-between">
              <p className="text-xs font-medium text-[#4A4A4A]">
                {userDetails.name}
              </p>
              <p className="text-xs text-[#8E8E8E]">
                {userDetails.email?.toLowerCase().includes("n/a")
                  ? "Member"
                  : userDetails.email}
              </p>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-fit bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50"
              >
                <button
                  onClick={() => {
                    navigate("/onBoarding");
                    setOpen(false);
                  }}
                  className="w-full whitespace-nowrap cursor-pointer text-left text-sm px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Create company
                </button>
                <button
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full cursor-pointer text-left text-sm px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    // add your logout logic here
                    userLogout(setisLoggingOut);
                  }}
                  className="w-full cursor-pointer text-left text-sm px-3 py-2 hover:bg-gray-100 rounded text-red-600"
                >
                  {isLoggingOut ? (
                    <Loader2 className=" w-5 animate-spin text-gray-600 mx-auto" />
                  ) : (
                    "Logout"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    )
  );
}
