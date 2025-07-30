import { useState, useRef, useEffect, useContext } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { UserContext } from "../../context/userContext/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export const OTPVerification = ({ userData, mobile, onBack, type = "" }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [firebaseToken, setfirebaseToken] = useState(null);
  const [countdown, setCountdown] = useState(30);
  const inputRefs = useRef([]);
  const { verifyOtp, userLogin, createUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showToast("Please enter a valid 6-digit OTP", 1);
      return;
    }
    try {
      const token = await verifyOtp(mobile, otpString, setIsLoading);
      setfirebaseToken(token);
      console.log(token);
      setCountdown(0);
      type.toLowerCase().includes("login") &&
        userLogin(
          {
            firebaseToken: token,
            mobileNumber: `+91${mobile}`,
          },
          setIsLoading
        );
      type.toLowerCase().includes("signup") &&
        createUser({ ...userData, firebaseToken: token }, setIsLoading);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(["", "", "", "", "", ""]);
    showToast("A new OTP has been sent to your mobile number");
  };

  return (
    <>
      <ToastContainer />
      <div className=" relative text-center">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-0 cursor-pointer p-2 rounded-full hover:bg-violet-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Icon + Heading */}
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 bg-[#E8DFFF] rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-[#9C6BFF]" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-500">
            Enter the 6-digit code sent to +91 {mobile}
          </p>
        </div>

        {/* OTP Input Fields */}
        <div className="flex justify-center gap-3 mt-6 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 border-[#E0D3FF] focus:border-[#9C6BFF] focus:outline-none"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.includes("")}
          className={`w-full cursor-pointer h-12 rounded-xl font-medium text-white transition ${
            isLoading || otp.includes("")
              ? "bg-[#D7C9FB] cursor-not-allowed"
              : "bg-gradient-to-r from-[#BFA2FF] to-[#9C6BFF] hover:from-[#A58DFF] hover:to-[#855DFF]"
          }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend Option */}
        <div className="text-center text-sm text-gray-500 mt-4">
          {countdown > 0 ? (
            <>Resend OTP in {countdown}s</>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#9C6BFF] hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </>
  );
};
