import React, { useContext, useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { Loader2, Plus, Upload } from "lucide-react";
import { showToast } from "../../utils/showToast";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  indianStates,
  PaymentTermsDropDown,
  salutations,
} from "../../utils/dropdownFields";
import { CustomerContext } from "../../context/customer/customerContext";
import { useLocation, useParams } from "react-router-dom";

export const AddCustomer = () => {
  const { customerid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const { getCustomerDetails, customerDetails } = useContext(CustomerContext);

  useEffect(() => {
    getCustomerDetails(customerid, setisLoading);
  }, [customerid]);

  return (
    <>
      <ToastContainer />
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5">
        <div>
          <h1 className=" 2xl:text-[40px] xl:text-[32px] lg:text-[28px] md:text-2xl text-xl  font-semibold text-[#333333]">
            New Customer
          </h1>
          <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
            Add a new customer
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
            <Header customerDetails={customerDetails} />
            <PrimaryContact customerDetails={customerDetails} />
            <div className=" grid md:grid-cols-2 grid-cols-1 xl:gap-4 md:gap-2">
              <CompanyName customerDetails={customerDetails} />
              <PhoneDetails customerDetails={customerDetails} />
            </div>
            <div className=" grid grid-cols-2 xl:gap-4 md:gap-2">
              <DisplayName customerDetails={customerDetails} />
              <EmailAddress customerDetails={customerDetails} />
            </div>
            <BelowSection customerDetails={customerDetails} />
          </div>
        )}
      </div>
    </>
  );
};

const Header = ({ customerDetails }) => {
  const [selected, setselected] = useState(
    customerDetails?.customer_type || "Business"
  );
  const { handleChange } = useContext(CustomerContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "customerType", selected);
  }, [selected]);

  return (
    <div className=" mb-6">
      <h2 className=" mb-6  2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
        Customer Information
      </h2>
      <div className=" flex items-center gap-4">
        <p className=" font-medium 2xl:text-xl xl:text-lg lg:text-base text-sm text-[#777777] ">
          Customer type :
        </p>
        <div>
          <input
            tabIndex={0}
            checked={selected.toLowerCase() === "business"}
            type="radio"
            id="add-customer-business-radio"
            className=" accent-[#2543B1] cursor-pointer"
            onChange={(e) => {
              setselected("Business");
            }}
          />
          <label
            htmlFor="add-customer-business-radio"
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
            checked={selected.toLowerCase() === "individual"}
            type="radio"
            className=" accent-[#2543B1] cursor-pointer"
            id="add-customer-individual-radio"
            onChange={(e) => {
              setselected("Individual");
            }}
          />
          <label
            htmlFor="add-customer-individual-radio"
            className={`ml-1 cursor-pointer transition ${
              selected === "Individual" ? "text-[#4A4A4A]" : "text-[#777777]"
            }`}
          >
            Individual
          </label>
        </div>
      </div>
    </div>
  );
};

const PrimaryContact = ({ className, customerDetails }) => {
  const [salutation, setsalutation] = useState(
    customerDetails?.customer_name?.split(".")[0]
      ? `${customerDetails?.customer_name?.split(".")[0]?.trim()}.`
      : ""
  );
  const [firstName, setfirstName] = useState(
    customerDetails?.customer_name
      ?.split(".")[1]
      ?.trim()
      .split(" ")[0]
      ?.trim() ||
      customerDetails?.customer_name?.split(" ")[0]?.trim() ||
      ""
  );
  const [lastName, setlastName] = useState(
    customerDetails?.customer_name
      ?.split(".")[1]
      ?.trim()
      .split(" ")[1]
      ?.trim() ||
      customerDetails?.customer_name?.split(" ")[0]?.trim() ||
      ""
  );
  const { handleChange } = useContext(CustomerContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "customerSalutation", salutation);
  }, [salutation]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "customerFirstName", firstName);
  }, [firstName]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "customerLastName", lastName);
  }, [lastName]);

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setfirstName("");
      setsalutation("");
      setlastName("");
    }
  }, [customerDetails]);

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
            label={""}
            placeholder={"First name"}
          />
        </div>
        <div>
          <InputField
            value={lastName}
            setvalue={setlastName}
            label={""}
            placeholder={"Last name"}
          />
        </div>
      </div>
    </>
  );
};

const CompanyName = ({ className, customerDetails }) => {
  const { handleChange } = useContext(CustomerContext);
  const [company, setcompany] = useState(customerDetails?.company_name || "");

  useEffect(() => {
    handleChange("UPDATE_FIELD", "companyName", company);
  }, [company]);

  useEffect(() => {
    if (!customerDetails) setcompany("");
  }, [customerDetails]);

  return (
    <div className={`${className}`}>
      <InputField
        required={true}
        value={company}
        setvalue={setcompany}
        label={"Company name (as per gst and other documents)"}
        placeholder={"eg: XYZ pvt.ltd"}
      />
    </div>
  );
};

const PhoneDetails = ({ className, customerDetails }) => {
  const { handleChange, createCustomerForm } = useContext(CustomerContext);
  const [workPhone, setworkPhone] = useState(customerDetails?.work_phone || "");
  const [mobile, setmobile] = useState(
    customerDetails?.contact_no || createCustomerForm["contactNo"] || ""
  );
  useEffect(() => {
    handleChange("UPDATE_FIELD", "contactNo", mobile);
  }, [mobile]);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "workPhone", workPhone);
  }, [workPhone]);

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setworkPhone("");
      setmobile("");
    }
  }, [customerDetails]);

  return (
    <div className={` grid grid-cols-2 gap-2 ${className}`}>
      <div>
        <InputField
          value={mobile}
          autoComplete="off"
          setvalue={setmobile}
          required={true}
          inputType={"tel"}
          label={"Mobile No"}
          maxLength={10}
          placeholder={"Mobile"}
        />
      </div>
      <div>
        <InputField
          autoComplete="off"
          value={workPhone}
          setvalue={setworkPhone}
          inputType={"tel"}
          label={"Work phone"}
          placeholder={"Work Phone"}
        />
      </div>
    </div>
  );
};

const DisplayName = ({ className, customerDetails }) => {
  const [displayName, setdisplayName] = useState(
    customerDetails?.display_name || ""
  );
  const { handleChange } = useContext(CustomerContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "displayName", displayName || "N/A");
  }, [displayName]);

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setdisplayName("");
    }
  }, [customerDetails]);

  return (
    <div className={`${className}`}>
      <InputField
        value={displayName}
        setvalue={setdisplayName}
        label={"Display name"}
        placeholder={"Type a display name"}
        isTextArea={true}
        minHeight={50}
      />
    </div>
  );
};

const EmailAddress = ({ className, customerDetails }) => {
  const [email, setemail] = useState(customerDetails?.email || "");
  const { handleChange } = useContext(CustomerContext);
  useEffect(() => {
    handleChange("UPDATE_FIELD", "email", email);
  }, [email]);
  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setemail("");
    }
  }, [customerDetails]);
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

const BelowSection = ({ className, customerDetails }) => {
  const [navigationType, setnavigationType] = useState("other-details");
  const [isLoading, setisLoading] = useState(false);
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
        name: "Remarks",
        value: "remarks",
      },
    ],
    []
  );
  const { CreateCustomer, updateCustomer, handleChange } =
    useContext(CustomerContext);
  const { customerid } = useParams();

  return (
    <div className="mt-15 space-y-5">
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
        customerDetails={customerDetails}
        className={`${navigationType !== "other-details" ? "hidden" : ""}`}
      />
      <Address
        customerDetails={customerDetails}
        className={`${navigationType !== "address" ? "hidden" : ""}`}
      />
      <ContactPerson
        customerDetails={customerDetails}
        className={`${navigationType !== "contact-person" ? "hidden" : ""}`}
      />
      <Remarks
        customerDetails={customerDetails}
        className={`${navigationType !== "remarks" ? "hidden" : ""}`}
      />

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={(e) => {
            customerid?.toLowerCase() === "new" &&
              CreateCustomer(e, setisLoading);
            customerid?.toLowerCase() !== "new" &&
              updateCustomer(e, setisLoading);
          }}
          disabled={isLoading}
          className=" disabled:cursor-not-allowed 2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            <>
              {customerid?.toLowerCase() !== "new" ? "Update" : "Add"} Customer
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

const OtherDetails = ({ className, customerDetails }) => {
  const [gst, setgst] = useState(customerDetails?.gst_number || "");
  const [panNumber, setpanNumber] = useState(customerDetails?.pan_number || "");
  const [openingBalance, setopeningBalance] = useState(
    customerDetails?.opening_balance || ""
  );
  const [paymentTerm, setpaymentTerm] = useState(
    customerDetails?.payment_term || customerDetails?.payment_terms || ""
  );
  const [files, setfiles] = useState(customerDetails?.related_documents[0]?.related_doc_url == "N/A" ? [] : [...(customerDetails?.related_documents || [])]);

  const { handleChange, createCustomerForm } = useContext(CustomerContext);
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

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setgst("");
      setpanNumber("");
      setopeningBalance("");
      setpaymentTerm("");
    }
  }, [customerDetails]);

  console.log(files);

  return (
    <div
      className={`grid grid-cols-2 xl:gap-x-4 md:gap-x-2 space-y-4 ${className} `}
    >
      {/* pan  */}
      <div>
        <InputField
          additionalNote={
            createCustomerForm.customerType == "Business"
              ? "Company PAN number"
              : "Customer PAN number"
          }
          value={panNumber}
          setvalue={setpanNumber}
          label={"PAN*"}
          required={true}
          placeholder={"Enter a valid PAN number"}
        />
      </div>

      {/* gst  */}
      <div>
        <InputField
          additionalNote={
            createCustomerForm.customerType == "Business"
              ? "Company GST number"
              : "Customer GST number"
          }
          value={gst}
          setvalue={setgst}
          label={"GST*"}
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
          placeholder={"Select a option"}
          label={"Payment Terms"}
          hasDropDown={true}
          readOnly={true}
          dropDownData={PaymentTermsDropDown}
          hasCustom={true}
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
              showToast("Maximum 10 files can be selected at a time", 1);
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
            console.log("Valid files:", validFiles);
            setfiles((prev) => {
              const updated = [...prev, ...validFiles];
              console.log("Updated files:", updated);
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

const Address = ({ className, customerDetails }) => {
  return (
    <div className={` grid grid-cols-2 ${className}`}>
      <BillingAddress
        className={"col-span-2"}
        customerDetails={customerDetails}
      />
    </div>
  );
};

const BillingAddress = ({ className, customerDetails }) => {
  const { handleChange, createCustomerForm } = useContext(CustomerContext);
  const len = customerDetails?.address?.split(",").length;

  const [country, setcountry] = useState("India");
  const [street1, setstreet1] = useState(
    customerDetails?.address?.split(",")[0]?.trim() || ""
  );
  const [street2, setstreet2] = useState("");
  const [city, setcity] = useState(
    customerDetails?.address?.split(",")[len - 4]?.trim() || ""
  );
  const [state, setstate] = useState(
    customerDetails?.address?.split(",")[len - 3]?.trim() || ""
  );
  const [pinCode, setpinCode] = useState(
    customerDetails?.address?.split(",")[len - 1]?.split("-")[1]?.trim() || ""
  );

  useEffect(() => {
    if (!country || !(street1 || street2) || !city || !state || !pinCode)
      return;

    handleChange(
      "UPDATE_FIELD",
      "address",
      `${street1 || street2}, ${city}, ${state}, ${country}, pin-${pinCode} `
    );
  }, [country, street1, street2, city, state, pinCode]);

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setstreet1("");
      setstreet2("");
      setcity("");
      setstate("");
      setpinCode("");
    }
  }, [customerDetails]);

  return (
    <div className={`${className}`}>
      <h2 className=" text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg text-base mb-5">
        Billing Address
      </h2>

      <div className=" space-y-4">
        {/* Attention* */}
        {/* <div>
          <InputField
            value={attention}
            setvalue={setattention}
            label={"Attention*"}
            required={true}
            placeholder={""}
          />
        </div> */}
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
            dropDownData={indianStates || []}
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

const ContactPerson = ({ className, customerDetails }) => {
  const { handleChange, createCustomerFormDispatch } =
    useContext(CustomerContext);
  const [salutation, setsalutation] = useState(
    `${customerDetails?.contact_person[0]?.contact_person
      ?.split(".")[0]
      ?.trim()}.` || ""
  );
  const [firstName, setfirstName] = useState(
    customerDetails?.contact_person[0]?.contact_person
      ?.split(".")[1]
      ?.trim()
      .split(" ")[0]
      ?.trim() || ""
  );
  const [lastName, setlastName] = useState(
    customerDetails?.contact_person[0]?.contact_person
      ?.split(".")[1]
      ?.trim()
      .split(" ")[1]
      ?.trim() || ""
  );
  const [email, setemail] = useState(
    customerDetails?.contact_person[0]?.email || ""
  );
  const [mobile, setmobile] = useState(
    customerDetails?.contact_person[0]?.contact_no || ""
  );
  const [workPhone, setworkPhone] = useState(
    customerDetails?.contact_person[0]?.work_phone || ""
  );

  // change create customer form
  useEffect(() => {
    if (salutation && firstName && lastName) {
      createCustomerFormDispatch({
        type: "UPDATE_ARRAY",
        parentField: "contactPerson",
        value: `${salutation} ${firstName} ${lastName}`,
        index: 0,
        field: "contact_person",
      });
    }
  }, [salutation, firstName, lastName]);
  useEffect(() => {
    createCustomerFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: mobile,
      index: 0,
      field: "contact_no",
    });
  }, [mobile]);
  useEffect(() => {
    createCustomerFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: email,
      index: 0,
      field: "email",
    });
  }, [email]);
  useEffect(() => {
    createCustomerFormDispatch({
      type: "UPDATE_ARRAY",
      parentField: "contactPerson",
      value: workPhone||"N/A",
      index: 0,
      field: "work_phone",
    });
  }, [workPhone]);

  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setsalutation("");
      setfirstName("");
      setlastName("");
      setemail("");
      setmobile("");
    }
  }, [customerDetails]);

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
            dropDownData={salutations || []}
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
            value={email}
            required={true}
            setvalue={setemail}
            inputType={"email"}
            label={"Email address"}
            placeholder={"Email address"}
          />
        </div>
        {/* work phone */}
        <div>
          <InputField
            autoComplete="off"
            value={workPhone}
            setvalue={setworkPhone}
            inputType={"tel"}
            label={"Work Phone"}
            placeholder={"Work Phone"}
          />
        </div>
        {/* Mobile */}
        <div>
          <InputField
            required={true}
            autoComplete="off"
            value={mobile}
            setvalue={setmobile}
            maxLength={10}
            inputType={"tel"}
            label={"Mobile"}
            placeholder={"Mobile"}
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

const Remarks = ({ className, customerDetails }) => {
  const { handleChange, createCustomerForm } = useContext(CustomerContext);
  const [remark, setremark] = useState(
    customerDetails?.remarks || customerDetails?.remark || ""
  );
  useEffect(() => {
    handleChange("UPDATE_FIELD", "remarks", remark || "N/A");
  }, [remark]);
  // clear values when no customer details found
  useEffect(() => {
    if (!customerDetails) {
      setremark("");
    }
  }, [customerDetails]);
  return (
    <div className={`${className}`}>
      <InputField
        value={remark}
        setvalue={setremark}
        isTextArea={true}
        label={"Remarks (For Internal Use)"}
        placeholder={"Enter remarks for the customer"}
        minHeight={100}
      />
    </div>
  );
};
