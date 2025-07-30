import { useContext, useState } from "react";
import { showToast } from "../../utils/showToast";
import { MobileLogin } from "./MobileLoginPage";
import { OTPVerification } from "./OtpVerification";
import { MemberLogin } from "./MemberLoginPage";
import {
  UserContext,
  UserContextProvider,
} from "../../context/userContext/UserContext";

export const UserLoginPage = () => {
  const [currentState, setCurrentState] = useState("mobile");
  const [mobileNumber, setMobileNumber] = useState("");

  const { sendOtp, loginMember } = useContext(UserContext);

  // send otp to mobile number
  const handleMobileSubmit = async (mobile, setisLoading) => {
    setMobileNumber(mobile);
    try {
      await sendOtp(mobile, setisLoading);
      setCurrentState("otp");
    } catch (error) {
      console.log(error);
    }
    // showToast(`Verification code sent to +91 ${mobile}`);
  };

  const handleMemberLogin = (username, password) => {
    showToast("Welcome to Atom Books!");
  };

  const handleBack = () => {
    setCurrentState("mobile");
  };

  const renderLoginForm = () => {
    switch (currentState) {
      case "mobile":
        return (
          <MobileLogin
            onMobileSubmit={handleMobileSubmit}
            onSwitchToMember={() => setCurrentState("member")}
          />
        );
      case "otp":
        return <OTPVerification mobile={mobileNumber} onBack={handleBack} type="login" />;
      case "member":
        return (
          <MemberLogin
            onMemberLogin={handleMemberLogin}
            onBack={handleBack}
            loginMember={loginMember}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FBFAFF]">
      {/* Left Side: Gradient + Illustration + Text */}
      <div className="hidden relative lg:flex w-1/2 bg-gradient-to-br from-[#7B5FFF] to-[#E3B3FF] text-white items-center justify-center overflow-hidden ">
        <div className="z-10 text-center absolute w-full px-4 top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <h1 className="text-5xl font-medium mb-4">Atom Books</h1>
          <p className="text-xl font-medium mb-2">by gofloww</p>
          <p className="text-base max-w-md mx-auto">
            Where technology meets finance. Discover a smarter way to manage and
            grow your accounts.
          </p>
        </div>
        <img
          src="/loginPageimg.webp" // Replace with actual image path (like the one in your screenshot)
          alt="Hero"
          className="w-full h-full object-cover pointer-events-none"
        />
        {/* overlay  */}
        <div className=" absolute w-full h-full top-0 left-0 bg-black/76" />
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="bg-gradient-to-b from-transparent to-[#F0EFF6]  rounded-2xl w-[88%] px-8 py-8 sm:px-6">
          {renderLoginForm()}
        </div>
      </div>
    </div>
  );
};
