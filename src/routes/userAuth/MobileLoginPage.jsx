import { useState } from "react";
import { Smartphone, ArrowRight } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const MobileLogin = ({ onMobileSubmit, onSwitchToMember }) => {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mobile.length !== 10) {
      showToast("Please enter a valid 10-digit mobile number", 1);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onMobileSubmit(mobile, setIsLoading);
    }, 1000);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value.trim());
  };

  return (
    <>
      <ToastContainer />
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#E8DFFF] rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6 text-[#9C6BFF]" />
          </div>
          <h2 className="md:text-2xl text-xl font-medium text-gray-900">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your mobile number to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div>
              <label
                htmlFor="mobile"
                className="text-sm font-medium text-gray-700 "
              >
                Mobile Number
              </label>
            </div>
            <div className="relative">
              <div
                className={`
    group focus-within:ring-2 focus-within:ring-[#A66BFF] 
    focus-within:ring-offset-2 ring-offset-[#F1EDFF]
    transition-all duration-300 ease-in-out
    rounded-xl
  `}
              >
                <div className="bg-[#FBFAFF] border border-[#e5ddfa] group-focus:border-[#7C3BED] rounded-xl px-1.5 py-1">
                  <div className="relative ">
                    <input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={handleMobileChange}
                      disabled={isLoading}
                      className="
            w-full h-10 pl-14 pr-4 
            bg-transparent outline-none 
            text-[#2a2a2a] placeholder-gray-400 
            rounded-xl transition duration-200 xl:text-lg md:text-base text-sm placeholder:xl:text-lg placeholder:md:text-base placeholder:text-sm
          "
                    />
                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 xl:text-lg md:text-base text-sm">
                      +91
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || mobile.length !== 10}
            className={`w-full cursor-pointer h-12 flex items-center justify-center bg-gradient-to-r from-[#8142EC] to-[#C6A9DE] gap-2 rounded-xl text-white font-medium transition disabled:opacity-70 disabled:cursor-not-allowed `}
          >
            {isLoading ? (
              "Sending OTP..."
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="relative flex justify-center text-xs items-center gap-1">
            <div className="w-full border-t border-[#E3D9FF]" />
            <span className=" px-2 text-gray-400 uppercase">OR</span>
            <div className="w-full border-t border-[#E3D9FF]" />
          </div>
        </div>

        {/* Member Login Button */}
        <button
          onClick={onSwitchToMember}
          className="w-full cursor-pointer h-12 rounded-xl border border-[#D7C9FB] text-[#9C6BFF] font-medium hover:bg-[#7C3BED] hover:text-white transition duration-300 text-sm "
        >
          Login as a member instead?
        </button>

        {/* not have a acount  */}
        <p className=" font-normal text-center text-sm text-violet-600">
          Don't have an account ?{" "}
          <Link to={"/signup"} className=" font-medium underline underline-offset-2">
            Create one
          </Link>
        </p>
      </div>
    </>
  );
};
