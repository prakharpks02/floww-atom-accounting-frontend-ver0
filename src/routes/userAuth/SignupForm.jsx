import { useState } from "react";
import { Smartphone, ArrowRight, Upload, UserPlus } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { useNavigate } from "react-router-dom";

export const SignupForm = ({
  onFormSubmit,
  userData,
  setuserData,
  onSwitchToMember,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((userData.mobileNumber || "").length !== 10) {
      showToast("Please enter a valid 10-digit mobile number", 1);
      return;
    }

    if (
      !(userData.email || "").match(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      )
    ) {
      showToast("Please enter a valid email id", 1);
      return;
    }

    onFormSubmit(setIsLoading);
  };

  return (
    <div className="space-y-6">
      {/* profile image  */}
      {/* <div className="flex flex-col items-center text-center">
        <div className="rounded-lg p-4 text-center">
          {userData.imageUrl?.url ? (
            <div className="space-y-2">
              <img
                src={userData.imageUrl.url}
                alt="Preview"
                className="w-24 h-24 mx-auto rounded-full object-cover"
              />
              <div className="flex justify-center gap-8 mt-5">
                <button
                  onClick={() =>
                    document.getElementById("profile-imageInput")?.click()
                  }
                  className="text-blue-800 font-medium cursor-pointer text-sm"
                >
                  Change
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setuserData((prev) => {
                      return {
                        ...prev,
                        imageUrl: {
                          fileBlob: "N/A",
                          fileName: "N/A",
                          url: "/user.png",
                        },
                      };
                    });
                  }}
                  className="text-red-500 font-medium cursor-pointer text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label
              tabIndex={0}
              htmlFor="profile-imageInput"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className=" w-5 h-5" />
              <p className="mt-2 text-sm">Enter profile image</p>
              <p className="text-xs text-gray-400">
                Supported formats: jpeg, JPG, PNG (Max 5MB)
              </p>
            </label>
          )}
        </div>
        <input
          type="file"
          id="profile-imageInput"
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && file.size <= 5 * 1024 * 1024) {
              setuserData((prev) => {
                return {
                  ...prev,
                  imageUrl: {
                    url: URL.createObjectURL(file),
                    fileBlob: file || "N/A",
                    fileName: file.name || "N/A",
                  },
                };
              });
            } else {
              showToast("Maximum size is 5MB", 1);
            }
          }}
        />
      </div> */}

      <div className="flex items-center justify-center gap-2 mb-8">
        <UserPlus className="w-6 h-6 text-purple-500" />
        <h2 className="text-2xl font-medium text-gray-800">
          Create Your Account
        </h2>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 "
            >
              Name
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
                    required
                    id="username"
                    type="text"
                    placeholder="Full name"
                    value={userData.name}
                    onChange={(e) => {
                      setuserData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }));
                    }}
                    disabled={isLoading}
                    className="
            w-full h-10 px-4 
            bg-transparent outline-none 
            text-[#2a2a2a] placeholder-gray-400 
            rounded-xl transition duration-200 xl:text-lg md:text-base text-sm placeholder:xl:text-lg placeholder:md:text-base placeholder:text-sm
          "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div>
            <label
              htmlFor="mobile"
              className="text-sm font-medium text-gray-700 "
            >
              Email
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
                    required
                    id="mobile"
                    type="email"
                    placeholder="Enter email"
                    value={userData.email}
                    onChange={(e) => {
                      setuserData((prev) => ({
                        ...prev,
                        email: e.target.value.trim(),
                      }));
                    }}
                    disabled={isLoading}
                    className="
            w-full h-10 px-4 
            bg-transparent outline-none 
            text-[#2a2a2a] placeholder-gray-400 
            rounded-xl transition duration-200 xl:text-lg md:text-base text-sm placeholder:xl:text-lg placeholder:md:text-base placeholder:text-sm
          "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1">
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
                    required
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={userData.mobileNumber}
                    onChange={(e) => {
                      setuserData((prev) => ({
                        ...prev,
                        mobileNumber: e.target.value.trim(),
                      }));
                    }}
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
          disabled={isLoading || userData?.mobileNumber?.length !== 10}
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
        onClick={() => {
          navigate("/login");
        }}
        className="w-full cursor-pointer h-12 rounded-xl border border-[#D7C9FB] text-[#9C6BFF] font-medium hover:bg-[#7C3BED] hover:text-white transition duration-300 text-sm "
      >
        Already have an account ? Login
      </button>
    </div>
  );
};
