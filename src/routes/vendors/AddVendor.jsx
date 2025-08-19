import React, { useEffect, useMemo, useState, useContext } from "react";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { Loader2, Plus, Upload } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  indianStates,
  PaymentTermsDropDown,
  salutations,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { VendorContext } from "../../context/vendor/VendorContext";
import { useParams } from "react-router-dom";

export const AddVendor = () => {
  const { vendorid } = useParams();
  const { getVendorDetails, vendorDetails } = useContext(VendorContext);
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    setisLoading(true);
    getVendorDetails(vendorid, setisLoading);
  }, [vendorid]);

  return (
    <>
      <ToastContainer />
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5">
        <div>
          <h2 className=" 2xl:text-[40px] xl:text-[32px] lg:text-[28px] md:text-2xl text-xl font-semibold text-[#333333]">
            New Vendor
          </h2>
          <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
            Add a new vendor to the poral
          </p>
        </div>

        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-10 px-4 min-h-[300px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && (
          <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5 rounded-2xl border-[1.5px] border-[#0000001A] ">
            {/* header  */}
            <Header vendorDetails={vendorDetails} />
            <PrimaryContact vendorDetails={vendorDetails} />
            <div className=" grid md:grid-cols-2 grid-cols-1 xl:gap-4 md:gap-2">
              <CompanyName vendorDetails={vendorDetails} />
              <EmailAddress vendorDetails={vendorDetails} />
            </div>
            <PhoneDetails vendorDetails={vendorDetails} />
            <BelowSection vendorDetails={vendorDetails} />
          </div>
        )}
      </div>
    </>
  );
};

const Header = ({ vendorDetails }) => {
  return (
    <div className=" mb-6">
      <h2 className=" mb-6  2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
        Vendor Information
      </h2>
      {/* <div className=" flex items-center gap-4">
        <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm text-[#777777] ">
          Vendor type :
        </p>
        <div>
          <input
            tabIndex={0}
            checked={selected === "Business"}
            type="radio"
            id="add-vendor-business-radio"
            className=" accent-[#2543B1] cursor-pointer"
            onChange={(e) => {
              setselected("Business");
            }}
          />
          <label
            htmlFor="add-vendor-business-radio"
            className={`ml-1 cursor-pointer transition ${
              selected === "Business" ? "text-[#4A4A4A]" : "text-[#777777]"
            }`}
          >
            Business
          </label>
        </div>
        <div>
          <input
            tabIndex={0}
            checked={selected === "Individual"}
            type="radio"
            className=" accent-[#2543B1] cursor-pointer"
            id="add-vendor-individual-radio"
            onChange={(e) => {
              setselected("Individual");
            }}
          />
          <label
            htmlFor="add-vendor-individual-radio"
            className={`ml-1 cursor-pointer transition ${
              selected === "Individual" ? "text-[#4A4A4A]" : "text-[#777777]"
            }`}
          >
            Individual
          </label>
        </div>
      </div> */}
    </div>
  );
};

const PrimaryContact = ({ className = "", vendorDetails }) => {
  const [salutation, setsalutation] = useState(
    vendorDetails?.vendor_name
      ? `${vendorDetails?.vendor_name?.split(".")[0]?.trim()}.`
      : ""
  );
  const [firstName, setfirstName] = useState(
    vendorDetails?.vendor_name?.split(".")[1]?.trim().split(" ")[0]?.trim() ||
      vendorDetails?.vendor_name?.split(" ")[0]?.trim() ||
      ""
  );
  const [lastName, setlastName] = useState(
    vendorDetails?.vendor_name?.split(".")[1]?.trim().split(" ")[1]?.trim() ||
      vendorDetails?.vendor_name?.split(" ")[0]?.trim() ||
      ""
  );

  // reset value when vendor details changes
  useEffect(() => {
    setsalutation(
      vendorDetails?.vendor_name
        ? `${vendorDetails?.vendor_name?.split(".")[0]?.trim()}.`
        : ""
    );
    setfirstName(
      vendorDetails?.vendor_name?.split(".")[1]?.trim().split(" ")[0]?.trim() ||
        vendorDetails?.vendor_name?.split(" ")[0]?.trim() ||
        ""
    );
    setlastName(
      vendorDetails?.vendor_name?.split(".")[1]?.trim().split(" ")[1]?.trim() ||
        vendorDetails?.vendor_name?.split(" ")[0]?.trim() ||
        ""
    );
  }, [vendorDetails]);

  const { handleChange } = useContext(VendorContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "vendorSalutation", salutation);
  }, [salutation]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "vendorFirstName", firstName);
  }, [firstName]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "vendorLastName", lastName);
  }, [lastName]);

  return (
    <>
      <div className={` grid grid-cols-3 2xl:gap-4 gap-2 ${className}`}>
        <div>
          <InputField
            required={true}
            hasDropDown={true}
            readOnly={true}
            value={salutation}
            setvalue={setsalutation}
            label={"Primary Contact"}
            placeholder={"Salutation"}
            dropDownData={salutations}
            dropDownType="default"
          />
        </div>
        <div>
          <InputField
            value={firstName}
            setvalue={setfirstName}
            placeholder={"First name"}
          />
        </div>
        <div>
          <InputField
            value={lastName}
            setvalue={setlastName}
            placeholder={"Last name"}
          />
        </div>
      </div>
    </>
  );
};

const CompanyName = ({ className = "", vendorDetails }) => {
  const { handleChange } = useContext(VendorContext);
  const [company, setcompany] = useState(vendorDetails?.company_name || "");

  useEffect(() => {
    handleChange("UPDATE_FIELD", "companyName", company);
  }, [company]);

  // reset value when vendor details changes
  useEffect(() => {
    setcompany(vendorDetails?.company_name || "");
  }, [vendorDetails]);

  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={company}
        setvalue={setcompany}
        label={"Company name"}
        placeholder={"XYZ Company"}
      />
    </div>
  );
};

const PhoneDetails = ({ className = "", vendorDetails }) => {
  const { handleChange } = useContext(VendorContext);
  const [workPhone, setworkPhone] = useState(vendorDetails?.work_phone || "");
  const [mobile, setmobile] = useState(vendorDetails?.contact_no || "");

  // reset value when vendor details changes
  useEffect(() => {
    setworkPhone(vendorDetails?.work_phone || "");
    setmobile(vendorDetails?.contact_no || "");
  }, [vendorDetails]);

  useEffect(() => {
    handleChange("UPDATE_FIELD", "contactNo", mobile);
  }, [mobile]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "workPhone", workPhone || "N/A");
  }, [workPhone]);

  return (
    <div className={` grid grid-cols-2 xl:gap-4 md:gap-2 ${className}`}>
      <div>
        <InputField
          value={mobile}
          setvalue={setmobile}
          required={true}
          inputType={"tel"}
          maxLength={10}
          label={"Mobile No"}
          autoComplete="off"
          placeholder={"Mobile"}
        />
      </div>
      <div>
        <InputField
          value={workPhone}
          setvalue={setworkPhone}
          inputType={"tel"}
          label={"Work Phone No"}
          placeholder={"Work Phone"}
        />
      </div>
    </div>
  );
};

const EmailAddress = ({ className = "", vendorDetails }) => {
  const [email, setemail] = useState(vendorDetails?.email || "");

  const { handleChange } = useContext(VendorContext);
  // reset value when vendor details changes
  useEffect(() => {
    setemail(vendorDetails?.email || "");
  }, [vendorDetails]);

  useEffect(() => {
    handleChange("UPDATE_FIELD", "email", email);
  }, [email]);
  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={email}
        setvalue={setemail}
        label={"Email address"}
        placeholder={"Enter a valid email address"}
      />
    </div>
  );
};

const BelowSection = ({ className = "", vendorDetails }) => {
  const [navigationType, setnavigationType] = useState("other-details");
  const navigations = useMemo(
    () => [
      {
        name: "Other Details",
        value: "other-details",
      },
      {
        name: "Address",
        value: "address",
      },
      {
        name: "Contact Person",
        value: "contact-person",
      },
      {
        name: "Bank Details",
        value: "bank-details",
      },
      {
        name: "Remarks",
        value: "remarks",
      },
    ],
    []
  );
  const [isLoading, setisLoading] = useState(false);
  const { handleChange, CreateVendor, updateVendor } =
    useContext(VendorContext);
  const { vendorid } = useParams();

  return (
    <div className={`mt-15 space-y-5 ${className}`}>
      {/* navigation buttons  */}
      <div className=" flex flex-wrap xl:gap-15 gap-10 justify-start items-center relative border-b-2 border-b-[#E8E8E8] ">
        {navigations.map((item, index) => {
          const isActive = item.value === navigationType;

          // console.log(isActive);
          return (
            <div
              key={index}
              onClick={() => {
                setnavigationType(item.value);
              }}
              className="relative cursor-pointer w-fit pb-3"
            >
              <button
                className={`${
                  isActive ? "text-[#2543B1]" : "text-[#00000099]"
                } cursor-pointer font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm transition-colors duration-200`}
              >
                {item.name}
              </button>
              <div
                className={`${
                  isActive ? "w-full" : "w-0"
                } cursor-pointer absolute -bottom-0.5 transition-all duration-400 h-0.5 bg-[#2543B1]`}
              ></div>
            </div>
          );
        })}
      </div>

      <OtherDetails
        vendorDetails={vendorDetails}
        className={`${navigationType !== "other-details" ? "hidden" : ""}`}
      />
      <Address
        vendorDetails={vendorDetails}
        className={`${navigationType !== "address" ? "hidden" : ""}`}
      />
      <ContactPerson
        vendorDetails={vendorDetails}
        className={`${navigationType !== "contact-person" ? "hidden" : ""}`}
      />
      <BankDetails
        vendorDetails={vendorDetails}
        className={`${navigationType !== "bank-details" ? "hidden" : ""}`}
      />
      <Remarks
        vendorDetails={vendorDetails}
        className={`${navigationType !== "remarks" ? "hidden" : ""}`}
      />

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={(e) => {
            vendorid?.toLowerCase() === "new" && CreateVendor(e, setisLoading);
            vendorid?.toLowerCase() !== "new" && updateVendor(e, setisLoading);
          }}
          disabled={isLoading}
          className="disabled:cursor-not-allowed 2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            <>
              {vendorid?.toLowerCase() !== "new" ? "Update" : "Add"} Vendor
              <Plus className=" ml-2 w-5 h-5 text-white inline-block" />
            </>
          )}
        </button>
        <button
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            handleChange("RESET");
          }}
          className="disabled:cursor-not-allowed 2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const OtherDetails = ({ className = "", vendorDetails }) => {
  const [gst, setgst] = useState(vendorDetails?.gst_number || "");
  const [panNumber, setpanNumber] = useState(vendorDetails?.pan_number || "");
  const [openingBalance, setopeningBalance] = useState(
    vendorDetails?.opening_balance || ""
  );
  const [paymentTerm, setpaymentTerm] = useState(
    vendorDetails?.payment_term || vendorDetails?.payment_terms || ""
  );
  const [isMSME, setisMSME] = useState(
    vendorDetails?.msme_registered_or_not?.toString().toLowerCase() === "true"
      ? true
      : false
  );
  const [tds, settds] = useState(vendorDetails?.tds || "");
  const [files, setfiles] = useState(
    vendorDetails?.related_documents[0]?.related_doc_url == "N/A"
      ? []
      : [...(vendorDetails?.related_documents || [])]
  );

  const { handleChange } = useContext(VendorContext);

  // reset value when vendor details changes
  useEffect(() => {
    setgst(vendorDetails?.gst_number || "");
    setpanNumber(vendorDetails?.pan_number || "");
    setopeningBalance(vendorDetails?.opening_balance || "");
    setpaymentTerm(
      vendorDetails?.payment_term || vendorDetails?.payment_terms || ""
    );
    setisMSME(
      vendorDetails?.msme_registered_or_not?.toString().toLowerCase() === "true"
    );
    settds(vendorDetails?.tds || "");
    !vendorDetails && setfiles([]);
  }, [vendorDetails]);

  useEffect(() => {
    handleChange("UPDATE_FIELD", "gstNumber", gst);
  }, [gst]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "panNumber", panNumber);
  }, [panNumber]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "openingBalance", openingBalance);
  }, [openingBalance]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "paymentTerms", paymentTerm || "N/A");
  }, [paymentTerm]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "msmeRegisteredOrNot", isMSME);
  }, [isMSME]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "tds", tds);
  }, [tds]);
  useEffect(() => {
    if (!files || files.length == 0) {
      handleChange("UPDATE_FIELD", "relatedDocuments", [
        {
          related_doc_name: "N/A",
          related_doc_url: "N/A",
        },
      ]);
      return;
    }

    const value = [];
    files.forEach((file, index) => {
      value.push({
        fileBlob: file || "N/A",
        fileName: file.name || "N/A",
        related_doc_name: file.related_doc_name || "N/A",
        related_doc_url: file.related_doc_url || "N/A",
      });
    });
    handleChange("UPDATE_FIELD", "relatedDocuments", value);
  }, [files]);

  return (
    <div className={`grid grid-cols-2 gap-x-4 space-y-4 ${className} `}>
      {/* pan  */}
      <div>
        <InputField
          value={panNumber}
          setvalue={setpanNumber}
          label={"PAN"}
          required={true}
          placeholder={"Enter a valid PAN number"}
        />
      </div>

      {/* gst  */}
      <div>
        <InputField
          value={gst}
          setvalue={setgst}
          label={"GST"}
          required={true}
          placeholder={"Enter a valid GST number"}
        />
      </div>

      {/* opening balance  */}
      <div>
        <p className="font-normal text-[#000000] mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs">
          Opening Balance <span className=" text-red-600 ">*</span>
        </p>
        <div className=" flex items-end ">
          <div className="text-[#333333c6] w-fit font-normal 2xl:text-lg md:text-base px-3 py-2 border-[1.5px] border-[#0000001A] rounded-lg mr-3">
            INR
          </div>
          <InputField
            hasLabel={false}
            inputType={"number"}
            className={"inline-block flex-1"}
            value={openingBalance}
            setvalue={setopeningBalance}
            label={""}
            required={true}
            placeholder={"Enter Balance"}
          />
        </div>
      </div>

      {/* Payment Terms */}
      <div>
        <InputField
          value={paymentTerm}
          setvalue={setpaymentTerm}
          placeholder={"Select paymnent term"}
          label={"Payment Terms"}
          hasDropDown
          dropDownData={PaymentTermsDropDown}
          hasCustom={true}
        />
      </div>

      {/* MSME Registered  */}
      <div>
        <p
          className={` mb-4 font-normal text-[#000000] 2xl:text-lg xl:text-base lg:text-sm text-xs`}
        >
          MSME Registered
        </p>
        <input
          type="checkbox"
          id="MSME-Registered"
          value={isMSME}
          onChange={() => {
            setisMSME(!isMSME);
          }}
          className=" accent-[#2543B1] hidden translate-y-0.5 mr-3"
        />
        <label
          htmlFor={`MSME-Registered`}
          className={`font-medium cursor-pointer select-none flex items-center text-[#000000] mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs`}
        >
          <div
            className={`  mr-2 w-4 h-4 rounded-full  ${
              isMSME ? "border-4 border-[#2543B1]" : "border-2 border-gray-500"
            } transition `}
          />
          This Vendor is MSME Registered
        </label>
      </div>

      {/* TDS */}
      <div>
        <InputField
          value={tds}
          required={true}
          setvalue={settds}
          placeholder={"Select a Tax"}
          label={"TDS"}
          hasDropDown={true}
          readOnly={true}
          dropDownData={TDSDropDown}
        />
      </div>

      {/* Attachments Section */}
      <div className=" col-span-2 outline-[#00000029] rounded-lg p-3 border-2 border-[#00000033] border-dashed">
        {files.length > 0 && (
          <div>
            <ShowUploadedFiles files={files} setfiles={setfiles} />
            <div className=" flex flex-col gap-2 items-center my-5">
              <label
                htmlFor="upload-invoice"
                className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
              >
                Choose files
              </label>
              <p className="text-[#00000080] text-xs ">
                Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
              </p>
            </div>
          </div>
        )}

        {files.length === 0 && (
          <label
            tabIndex={0}
            htmlFor="upload-invoice"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className=" w-10 h-8 text-[#000000] mb-3" />
            <p className="font-medium xl:text-base md:text-sm mb-1">
              Upload GST and PAN related documents
            </p>
            <p className="text-[#00000080] text-xs ">
              Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
            </p>
          </label>
        )}

        <input
          type="file"
          accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
          id="upload-invoice"
          multiple
          onChange={(e) => {
            const maxSizeMB = 10;
            const validFiles = [];
            const invalidFiles = [];

            const selectedFiles = Array.from(e.target.files);
            // at max 10 files are allowed
            if (selectedFiles.length > 10) {
              showToast("Maximum 10 files are allowed at a time", 1);
              return;
            }
            selectedFiles.forEach((file) => {
              if (file.size <= maxSizeMB * 1024 * 1024) {
                validFiles.push(file);
              } else {
                invalidFiles.push(file.name);
                showToast(`"${file.name}" is too large. Max size is 10MB.`, 1);
              }
            });

            if (validFiles.length + files.length > 20) {
              showToast("Maximum 20 total files can be upload at a time", 1);
              return;
            }

            // Do something with the valid files (e.g. store them in state)
            setfiles((prev) => {
              const updated = [...prev, ...validFiles];
              return updated;
            });

            // Clear the input to allow re-uploading the same files
            e.target.value = "";
          }}
          className="hidden"
        />
      </div>
    </div>
  );
};

const Address = ({ className = "", vendorDetails }) => {
  return (
    <div className={` grid grid-cols-2 ${className}`}>
      <BillingAddress className={"col-span-2"} vendorDetails={vendorDetails} />
    </div>
  );
};

const BillingAddress = ({ className = "", vendorDetails }) => {
  const len = vendorDetails?.address?.split(",").length;
  const { handleChange } = useContext(VendorContext);
  const [attention, setattention] = useState(vendorDetails?.attention || "");
  const [country, setcountry] = useState("India");
  const [street1, setstreet1] = useState(
    vendorDetails?.address?.split(",")[0]?.trim() || ""
  );
  const [street2, setstreet2] = useState("");
  const [city, setcity] = useState(
    vendorDetails?.address?.split(",")[len - 4]?.trim() || ""
  );
  const [state, setstate] = useState(
    vendorDetails?.address?.split(",")[len - 3]?.trim() || ""
  );
  const [pinCode, setpinCode] = useState(
    vendorDetails?.address?.split(",")[len - 1]?.split("-")[1]?.trim() || ""
  );

  // reset value when vendor details changes
  useEffect(() => {
    setattention(vendorDetails?.attention || "");
    setcountry("India");
    setstreet1(vendorDetails?.address?.split(",")[0]?.trim() || "");
    setstreet2("");
    setcity(vendorDetails?.address?.split(",")[len - 4]?.trim() || "");
    setstate(vendorDetails?.address?.split(",")[len - 3]?.trim() || "");
    setpinCode(
      vendorDetails?.address?.split(",")[len - 1]?.split("-")[1]?.trim() || ""
    );
  }, [vendorDetails]);

  useEffect(() => {
    if (!country || !(street1 || street2) || !city || !state || !pinCode)
      return;

    handleChange(
      "UPDATE_FIELD",
      "address",
      `${street1 || street2}, ${city}, ${state}, ${country}, pin-${pinCode} `
    );
  }, [country, street1, street2, city, state, pinCode]);

  return (
    <div className={`${className}`}>
      <h2 className=" text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg text-base mb-5">
        Billing Address
      </h2>

      <div className=" space-y-4">
        {/* Country/Region* */}
        <div>
          <InputField
            value={country}
            setvalue={setcountry}
            label={"Country/Region"}
            required={true}
            readOnly={true}
            placeholder={""}
          />
        </div>
        {/* Address* */}
        <div>
          <p className=" font-normal text-[#000000] mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs">
            Address <span className=" text-red-600 ">*</span>
          </p>
          <InputField
            isTextArea={"true"}
            minHeight={100}
            value={street1}
            setvalue={setstreet1}
            hasLabel={false}
            required={true}
            placeholder={"Street 1"}
          />
          <InputField
            isTextArea={"true"}
            minHeight={100}
            value={street2}
            setvalue={setstreet2}
            hasLabel={false}
            placeholder={"Street 2"}
          />
        </div>
        {/* City* */}
        <div>
          <InputField
            value={city}
            setvalue={setcity}
            label={"City"}
            required={true}
            placeholder={"Enter City"}
          />
        </div>
        {/* State* */}
        <div>
          <InputField
            value={state}
            setvalue={setstate}
            label={"State"}
            required={true}
            readOnly={true}
            hasDropDown={true}
            placeholder={"Select state"}
            dropDownData={indianStates}
          />
        </div>
        {/* PIN Code* */}
        <div>
          <InputField
            value={pinCode}
            label={"PIN Code"}
            setvalue={setpinCode}
            required={true}
            placeholder={"Enter PIN code"}
          />
        </div>
      </div>
    </div>
  );
};

const ContactPerson = ({ className = "", vendorDetails }) => {
  const [salutation, setsalutation] = useState(
    vendorDetails?.contact_person[0]
      ? `${vendorDetails?.contact_person[0]?.contact_person
          ?.split(".")[0]
          ?.trim()}.`
      : ""
  );
  const [firstName, setfirstName] = useState(
    vendorDetails?.contact_person[0]?.contact_person
      ?.split(".")[1]
      ?.trim()
      .split(" ")[0]
      ?.trim() || ""
  );
  const [lastName, setlastName] = useState(
    vendorDetails?.contact_person[0]?.contact_person
      ?.split(".")[1]
      ?.trim()
      .split(" ")[1]
      ?.trim() || ""
  );
  const [email, setemail] = useState(
    vendorDetails?.contact_person[0]?.email || ""
  );
  const [workPhone, setworkPhone] = useState(
    vendorDetails?.contact_person[0]?.work_phone || ""
  );
  const [mobile, setmobile] = useState(
    vendorDetails?.contact_person[0]?.contact_no || ""
  );

  const { createVendorFormDispatch } = useContext(VendorContext);

  // reset value when vendor details changes
  useEffect(() => {
    setsalutation(
      vendorDetails?.contact_person[0]
        ? `${vendorDetails?.contact_person[0]?.contact_person
            ?.split(".")[0]
            ?.trim()}.`
        : ""
    );
    setfirstName(
      vendorDetails?.contact_person[0]?.contact_person
        ?.split(".")[1]
        ?.trim()
        .split(" ")[0]
        ?.trim() || ""
    );
    setlastName(
      vendorDetails?.contact_person[0]?.contact_person
        ?.split(".")[1]
        ?.trim()
        .split(" ")[1]
        ?.trim() || ""
    );
    setemail(vendorDetails?.contact_person[0]?.email || "");
    setworkPhone(vendorDetails?.contact_person[0]?.work_phone || "");
    setmobile(vendorDetails?.contact_person[0]?.contact_no || "");
  }, [vendorDetails]);

  // change create customer form
  useEffect(() => {
    if (salutation && firstName && lastName) {
      createVendorFormDispatch({
        type: "UPDATE_ARRAY",
        parentField: "contactPerson",
        value: `${salutation} ${firstName} ${lastName}`,
        index: 0,
        field: "contact_person",
      });
    }
  }, [salutation, firstName, lastName]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: mobile,
      index: 0,
      field: "contact_no",
    });
  }, [mobile]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: workPhone || "N/A",
      index: 0,
      field: "work_phone",
    });
  }, [workPhone]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: email,
      index: 0,
      field: "email",
    });
  }, [email]);

  return (
    <div className={` space-y-4 ${className}`}>
      <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1 gap-x-2 space-y-4 ">
        {/* Salutation */}
        <div>
          <InputField
            required={true}
            hasDropDown={true}
            readOnly={true}
            value={salutation}
            setvalue={setsalutation}
            label={"Salutation"}
            placeholder={"Select salutation"}
            dropDownData={salutations}
            dropDownType="default"
          />
        </div>
        {/* First name */}
        <div>
          <InputField
            required={true}
            value={firstName}
            setvalue={setfirstName}
            label={"First name"}
            placeholder={"First name"}
          />
        </div>
        {/* Last name */}
        <div>
          <InputField
            required={true}
            value={lastName}
            setvalue={setlastName}
            label={"Last name"}
            placeholder={"Last name"}
          />
        </div>
        {/* email */}
        <div>
          <InputField
            required={true}
            value={email}
            setvalue={setemail}
            inputType={"email"}
            label={"Email address"}
            placeholder={"Email address"}
          />
        </div>
        {/* Mobile */}
        <div>
          <InputField
            required={true}
            value={mobile}
            setvalue={setmobile}
            maxLength={10}
            inputType={"tel"}
            label={"Mobile"}
            placeholder={"Mobile"}
          />
        </div>
        {/* work phone */}
        <div>
          <InputField
            value={workPhone}
            setvalue={setworkPhone}
            inputType={"tel"}
            label={"Work Phone"}
            placeholder={"Work Phone"}
          />
        </div>
      </div>

      {/* Add Contact Person buttons  */}
      <div className="flex space-x-4 mb-6">
        {/* <button
          tabIndex={0}
          className=" hover:bg-[#00336628] transition px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl opacity-80 text-[#2543B1] bg-[#0033661A] text-sm font-medium"
        >
          <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add Contact Person
        </button> */}
        {/* <button
          tabIndex={0}
          className=" hover:bg-[#00336628] transition px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl opacity-80 text-[#2543B1] bg-[#0033661A] text-base font-medium">
          <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add items in bulk
        </button> */}
      </div>
    </div>
  );
};

const BankDetails = ({ className = "", vendorDetails }) => {
  const [bankName, setbankName] = useState(
    vendorDetails?.bank_details[0]?.bank_name || ""
  );
  const [holder, setholder] = useState(
    vendorDetails?.bank_details[0]?.bank_account_receivers_name || ""
  );
  const [accountNumber, setaccountNumber] = useState(
    vendorDetails?.bank_details[0]?.bank_account_number || ""
  );
  const [reEnterNumber, setreEnterNumber] = useState(
    vendorDetails?.bank_details[0]?.bank_account_number || ""
  );
  const [ifscCode, setifscCode] = useState(
    vendorDetails?.bank_details[0]?.bank_account_IFSC || ""
  );

  const { createVendorFormDispatch } = useContext(VendorContext);

  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "bankDetails",
      value: bankName,
      index: 0,
      field: "bank_name",
    });
  }, [bankName]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "bankDetails",
      value: holder,
      index: 0,
      field: "bank_account_receivers_name",
    });
  }, [holder]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "bankDetails",
      value: accountNumber,
      index: 0,
      field: "bank_account_number",
    });
  }, [accountNumber]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "bankDetails",
      value: reEnterNumber,
      index: 0,
      field: "re_enter_bank_account_number",
    });
  }, [reEnterNumber]);
  useEffect(() => {
    createVendorFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "bankDetails",
      value: ifscCode,
      index: 0,
      field: "bank_account_IFSC",
    });
  }, [ifscCode]);

  // reset value when vendor details changes
  useEffect(() => {
    if (!vendorDetails) {
      setbankName("");
      setholder("");
      setaccountNumber("");
      setreEnterNumber("");
      setifscCode("");
    }
  }, [vendorDetails]);

  return (
    <>
      <div
        className={` grid md:grid-cols-2 grid-cols-1 xl:gap-4 gap-2 space-y-4 ${className}`}
      >
        {/* Account holder name* */}
        <div>
          <InputField
            value={holder}
            setvalue={setholder}
            placeholder={"Enter name"}
            required={true}
            label={"Account holder name"}
          />
        </div>

        {/* Bank name */}
        <div>
          <InputField
            value={bankName}
            setvalue={setbankName}
            placeholder={"Enter bank name"}
            required={true}
            label={"Bank name"}
          />
        </div>

        {/* Account number* */}
        <div>
          <InputField
            autoComplete="off"
            value={accountNumber}
            setvalue={setaccountNumber}
            inputType={"password"}
            placeholder={"Enter account number"}
            required={true}
            label={"Account number"}
          />
        </div>

        {/* Re-enter Account number* */}
        <div>
          <InputField
            autoComplete="off"
            readOnly={!accountNumber}
            value={reEnterNumber}
            setvalue={setreEnterNumber}
            inputType={"password"}
            placeholder={"Re-enter account number"}
            required={true}
            label={"Re-enter Account number"}
          />
        </div>

        {/* IFSC Code* */}
        <div>
          <InputField
            value={ifscCode}
            setvalue={setifscCode}
            placeholder={"Enter IFSC Code"}
            required={true}
            label={"IFSC Code"}
          />
        </div>
      </div>
      {/* Add Bank Account buttons  */}
      {/* <div className="flex space-x-4 mb-6">
        <button
          tabIndex={0}
          className=" hover:bg-[#00336628] transition px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl opacity-80 text-[#2543B1] bg-[#0033661A] text-sm font-medium"
        >
          <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add Bank Account
        </button>
      </div> */}
    </>
  );
};

const Remarks = ({ className, vendorDetails }) => {
  const [remark, setremark] = useState(
    vendorDetails?.remarks || vendorDetails?.remark || ""
  );
  // reset value when vendor details changes
  useEffect(() => {
    setremark(vendorDetails?.remarks || vendorDetails?.remark || "");
  }, [vendorDetails]);

  const { handleChange } = useContext(VendorContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "remarks", remark || "N/A");
  }, [remark]);
  return (
    <div className={`${className}`}>
      <InputField
        value={remark}
        setvalue={setremark}
        isTextArea={true}
        label={"Remarks (For Internal Use)"}
        placeholder={"Enter remarks for the vendor"}
        minHeight={100}
      />
    </div>
  );
};
