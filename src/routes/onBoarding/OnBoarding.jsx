import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showToast } from "../../utils/showToast";
import { InputField } from "../../utils/ui/InputField";
import { useContext, useEffect, useState } from "react";
import { AlertCircle, Loader2, Upload, User } from "lucide-react";
import { CompanyContext } from "../../context/company/CompanyContext";
import { indianStates } from "../../utils/dropdownFields";

export const OnBoardingPage = () => {
  const { createCompany, isLoading } = useContext(CompanyContext);

  return (
    <>
      <ToastContainer />
      <div className="md:p-6 px-2 py-6">
        <h1 className=" text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-[#4A4A4A] mb-1">
          Company Onboarding
        </h1>
        <p className=" text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4] font-medium mb-6">
          Fill in necessary details to onboard your company
        </p>

        <div className="p-3 md:p-4 lg:p-6 xl:p-7 2xl:p-8 border-[1.5px] border-[#0000001A] rounded-2xl ">
          {/* form heading  */}
          <h2 className="2xl:mb-8 xl:mb-7 lg:mb-6 md:mb-5 mb-4 text-[#4A4A4A] font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ">
            Company Information
          </h2>
          {/* form content  */}
          <div className=" space-y-4">
            <NameAndProfileImg />
            <StreetAddress className={" mb-6"} />
            <div className=" grid md:grid-cols-3 grid-cols-1 space-y-5 gap-x-2 mb-8">
              <ZipCode />
              <State />
              <LandMark />
            </div>
            <div className=" grid md:grid-cols-2 grid-cols-1 gap-3 space-y-5 mb-5">
              <ContactNumber />
              <CompanyWebsite />
              <GstNumber />
              <PanNumber />
              <EmailAddress />
              <CinNumber />
            </div>
          </div>

          {/* submit form  */}
          <div className=" flex justify-end gap-3">
            <button
              disabled={isLoading}
              onClick={createCompany}
              className="sm:w-auto w-[70%] disabled:cursor-not-allowed 2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
            >
              {isLoading ? (
                <Loader2 className=" w-5 h-5 text-white animate-spin mx-auto" />
              ) : (
                "Add Company"
              )}
            </button>
            <button
              disabled={isLoading}
              onClick={createCompany}
              className="sm:w-auto w-[30%] disabled:cursor-not-allowed 2xl:text-xl hover:bg-gray-50 transition xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A]  "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const NameAndProfileImg = ({ className }) => {
  const [companyName, setcompanyName] = useState("");
  const [selectedFile, setselectedFile] = useState(null);
  const [previewUrl, setpreviewUrl] = useState("");

  const { handleChange, errors } = useContext(CompanyContext);

  useEffect(() => {
    if (!selectedFile) return;

    const url = URL.createObjectURL(selectedFile);
    setpreviewUrl(url);
  }, [selectedFile]);

  useEffect(() => {
    companyName && handleChange("companyName", companyName);
  }, [companyName]);

  useEffect(() => {
    selectedFile &&
      handleChange("companyLogo", {
        fileBlob: selectedFile || "N/A",
        fileName: selectedFile.name || "N/A",
      });
  }, [selectedFile]);

  return (
    <div className={`grid gap-5 lg:grid-cols-5 ${className}`}>
      {/* company name */}
      <div className="col-span-full lg:col-span-2 relative h-fit">
        <InputField
          required={true}
          className={""}
          value={companyName}
          setvalue={setcompanyName}
          label={`Company Name`}
          placeholder={"Enter name of your company"}
        />
        {/* error message  */}
        {errors["companyName"] && (
          <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
            <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
            * Company name is required *
          </p>
        )}
      </div>

      {/* profile image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 col-span-full lg:col-span-3 relative">
        <div className="grid grid-cols-10 items-center gap-2">
          {/* file name */}
          <p className="col-span-7 text-xs sm:text-sm md:text-base lg:text-sm xl:text-base 2xl:text-lg font-normal overflow-x-auto whitespace-nowrap">
            {selectedFile ? selectedFile.name : "No image selected"}
          </p>

          {/* image */}
          <div className="col-span-3 flex justify-center">
            {previewUrl ? (
              <img
                loading="lazy"
                alt="profile image"
                className="w-8 h-8 sm:w-15 sm:h-15 lg:w-15 lg:h-15 rounded-full object-cover"
                src={previewUrl}
              />
            ) : (
              <div className="border-2 border-gray-700 p-2 sm:p-3 w-fit h-fit rounded-full flex justify-center items-center">
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-full lg:max-w-10 text-gray-700" />
              </div>
            )}
          </div>
        </div>

        {/* input */}
        <div className="text-center border-2 border-dashed border-[#00000033] py-3 px-2 rounded-lg ">
          <label
            tabIndex={0}
            htmlFor="upload-profile-image"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className=" text-[#2c2c2c] " />
            <p className="font-medium xl:text-base lg:text-sm text-xs">
              Click to upload or drag & drop
            </p>
            <p className="text-[#00000080] xl:text-sm lg:text-xs text-[10px]">
              Supported: .jpg, .jpeg, .png
            </p>
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            id="upload-profile-image"
            multiple={false}
            onChange={(e) => {
              const maxSizeMB = 25;
              const file = e.target.files[0];
              if (file.size > maxSizeMB * 1024 * 1024) {
                showToast(
                  `"${file.name}" is too large. Max size is ${maxSizeMB}MB.`,
                  1
                );
                return;
              }

              setselectedFile(file);

              // Clear the input to allow re-uploading the same file
              e.target.value = "";
            }}
            className="hidden"
          />
        </div>
        {/* error message  */}
        {errors["companyLogo"] && (
          <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
            <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
            * Company logo is required *
          </p>
        )}
      </div>
    </div>
  );
};

const StreetAddress = ({ className }) => {
  const [address, setaddress] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    address && handleChange("companyStreet", address);
  }, [address]);

  console.log(errors);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={address}
        setvalue={setaddress}
        label={"Street Address"}
        placeholder={"Enter name of your company"}
      />
      {/* error message  */}
      {errors["companyStreet"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * Street address is required *
        </p>
      )}
    </div>
  );
};

const ZipCode = ({ className }) => {
  const [zipCode, setzipCode] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    zipCode && handleChange("companyZIP", zipCode);
  }, [zipCode]);
  return (
    <div className={`relative ${className}`}>
      <InputField
        required={true}
        value={zipCode}
        setvalue={setzipCode}
        label={"ZIP Code"}
        placeholder={"Enter ZIP"}
      />
      {/* error message  */}
      {errors["companyZIP"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * ZIP code is required *
        </p>
      )}
    </div>
  );
};

const State = ({ className }) => {
  const [state, setstate] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    state && handleChange("companyState", state);
  }, [state]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={state}
        setvalue={setstate}
        label={"State"}
        placeholder={"Enter state"}
        hasDropDown={true}
        dropDownData={indianStates}
        readOnly={true}
      />
      {/* error message  */}
      {errors["companyState"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * State is required *
        </p>
      )}
    </div>
  );
};

const LandMark = ({ className }) => {
  const [landMark, setlandMark] = useState("");
  const { handleChange } = useContext(CompanyContext);
  useEffect(() => {
    landMark && handleChange("companyLandmark", landMark);
  }, [landMark]);
  return (
    <div className={` ${className}`}>
      <InputField
        value={landMark}
        setvalue={setlandMark}
        label={"Landmark (optional)"}
        placeholder={"Enter Landmark"}
      />
    </div>
  );
};

const CompanyWebsite = ({ className }) => {
  const [website, setwebsite] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    website && handleChange("companyWebsite", website);
  }, [website]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={website}
        setvalue={setwebsite}
        label={"Company website"}
        placeholder={"Enter website url"}
      />
      {/* error message  */}
      {errors["companyWebsite"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * Company website is required *
        </p>
      )}
    </div>
  );
};

const GstNumber = ({ className }) => {
  const [gst, setgst] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    gst && handleChange("companyGSTIN", gst);
  }, [gst]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={gst}
        setvalue={(val) => {
          setgst(val.toUpperCase());
        }}
        label={"GSTIN Number"}
        placeholder={"07ABCDE1234F2Z5"}
      />
      {/* error message  */}
      {errors["companyGSTIN"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * GST number is required *
        </p>
      )}
    </div>
  );
};

const PanNumber = ({ className }) => {
  const [pan, setpan] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    pan && handleChange("companyPAN", pan);
  }, [pan]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        value={pan}
        required={true}
        setvalue={(val) => {
          setpan(val.toUpperCase());
        }}
        label={"PAN Number"}
        placeholder={"AFZPK7190K"}
      />
      {/* error message  */}
      {errors["companyPAN"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * PAN number is required *
        </p>
      )}
    </div>
  );
};

const EmailAddress = ({ className }) => {
  const [email, setemail] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    email && handleChange("companyEmail", email);
  }, [email]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={email}
        setvalue={setemail}
        inputType={"email"}
        label={"Email address"}
        placeholder={"abc@gmail.com"}
      />
      {/* error message  */}
      {errors["companyEmail"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * Email is required *
        </p>
      )}
    </div>
  );
};

const CinNumber = ({ className }) => {
  const [cin, setcin] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    cin && handleChange("companyCIN", cin);
  }, [cin]);
  return (
    <div className={` relative ${className}`}>
      <InputField
        required={true}
        value={cin}
        setvalue={(val) => {
          setcin(val.toUpperCase());
        }}
        label={"CIN number"}
        placeholder={"U12345MH2023PTC012345"}
      />
      {/* error message  */}
      {errors["companyCIN"] && (
        <p className="mt-1 absolute text-red-600 text-xs -bottom-1 left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * CIN is required *
        </p>
      )}
    </div>
  );
};

const ContactNumber = ({ className }) => {
  const [number, setnumber] = useState("");
  const { handleChange, errors } = useContext(CompanyContext);
  useEffect(() => {
    number && handleChange("companyMobileNo", number);
  }, [number]);

  return (
    <div className=" relative">
      <p
        className={`font-normal text-[#000000] mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs ${className}`}
      >
        Contact number <span className=" text-red-600 ">*</span>
      </p>
      <div className=" flex items-end ">
        <div className="text-[#333333c6] w-fit font-normal 2xl:text-lg md:text-base px-3 py-2 border-[1.5px] border-[#0000001A] rounded-lg mr-3">
          +91
        </div>
        <InputField
          autoComplete="off"
          hasLabel={false}
          inputType={"tel"}
          maxLength={10}
          className={"inline-block flex-1"}
          value={number}
          setvalue={setnumber}
          label={""}
          required={true}
          placeholder={"Enter a 10-digit number"}
        />
      </div>
      {errors["companyMobileNo"] && (
        <p className="mt-1 absolute text-red-600 text-xs top-full left-0">
          <AlertCircle className=" inline-block w-3 h-3 mr-1 -translate-y-0.25" />
          * Mobile no is required *
        </p>
      )}
    </div>
  );
};
