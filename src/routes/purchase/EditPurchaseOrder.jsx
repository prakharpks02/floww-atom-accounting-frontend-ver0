import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Pencil,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  Plus,
  PencilLine,
  IndianRupee,
  Upload,
} from "lucide-react";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { SubTotal } from "../../component/subTotal/SubTotal";
import { customersDropDown, PaymentTermsDropDown } from "../../utils/dropdownFields";


export const EditPurchaseOrder = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <>
      <ToastContainer />
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
        {/* Header */}
        <div className="mb-6">
          <h2 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl font-semibold text-[#4A4A4A]">
            Edit Purchase Order List
          </h2>
          <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
            Edit purchase order list
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-4 flex rounded-lg bg-[#0033661A] overflow-hidden xl:py-2 xl:px-3 p-1 w-full">
          <button
            tabIndex={0}
            className={`w-1/2 cursor-pointer py-2 rounded-lg 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium transition-all 
               ${
                 activeTab === "create"
                   ? "bg-white text-black"
                   : "text-[#777777]"
               }`}
            onClick={() => setActiveTab("create")}
          >
            Create new purchase order
          </button>
          <button
            tabIndex={0}
            className={`w-1/2 cursor-pointer py-2 rounded-lg 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium transition-all
               ${
                 activeTab === "upload"
                   ? "bg-white text-black"
                   : "text-[#777777]"
               }`}
            onClick={() => setActiveTab("upload")}
          >
            Upload existing purchase order
          </button>
        </div>

        {/* main content */}
        {activeTab === "create" && <PurchaseOrderForm />}
        {activeTab === "upload" && <UploadPurchaseOrder />}
      </div>
    </>
  );
};

const PurchaseOrderForm = () => {
  return (
    <div className=" grid lg:grid-cols-2 grid-cols-1 space-x-2 space-y-2">
      <PurchaseOrderLeftPart />
      <PurchaseOrderRightPart />
    </div>
  );
};

const PurchaseOrderLeftPart = () => {
  return (
    <>
      <div className=" 2xl:p-8 xl:p-6 p-4 2xl:rounded-2xl xl:rounded-xl rounded-lg border-[1.5px] border-[#E8E8E8] ">
        <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg font-semibold text-[#4A4A4A] mb-5">
          Purchase Order Details
        </h1>

        {/* PurchaseOrder info */}
        <div className=" grid grid-cols-2 gap-x-3 space-y-4 mb-4">
          <VendorNameInputField className={" col-span-2"} />
          <DeliveryAddressInputField className={" col-span-2"} />
          <DateInputField className={" col-span-1"} />
          <DeliveryDateInputField className={" col-span-1"} />
          <PaymentTermsInputField className={" col-span-2"} />
          <ShipmentPreferenceInputField className={" col-span-2"} />
          <PurchaseNoInputField className={" col-span-1"} />
          <ReferenceInputField className={" col-span-1"} />
          <SubjectInputField className={" col-span-2"} />
        </div>

        {/* Item Table */}
        <ItemDetails />

        {/* Totals Section */}
        <SubTotal className={"mb-6"} />

        {/* Customer Note */}
        <div className="mb-6">
          <InputField
            label={"Customer note"}
            isTextArea={true}
            minHeight={96}
            placeholder={"Thankyou for business"}
          />
          <p className="2xl:text-base xl:text-sm md:text-xs font-medium text-[#777777]">
            Will be displayed on the Purchase Order
          </p>
        </div>

        {/* Terms and Conditions */}
        <div className="mb-6">
          <InputField
            label={"Terms and Conditions"}
            isTextArea={true}
            minHeight={119}
            placeholder={
              "Enter Terms and Conditions of your business for the transaction"
            }
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]">
            Edit Purchase
          </button>
          <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

const ItemDetails = ({ className }) => {
  const [itemDesc, setitemDesc] = useState("");
  const [rate, setrate] = useState("");
  const [quantity, setquantity] = useState("");
  const [amount, setamount] = useState("");
  const [gst, setgst] = useState("");
  const [discount, setdiscount] = useState("")

  return (
    <>
      <div className={`mb-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Table</h3>

        <div className=" space-y-3 mb-8">
          <div className=" grid grid-cols-5 gap-3">
            <div className=" overflow-x-hidden col-span-3">
              <InputField
                value={itemDesc}
                setvalue={setitemDesc}
                label={"Item Details"}
                placeholder={"Enter Item name"}
              />
            </div>
            <div className=" overflow-x-hidden col-span-1">
              <InputField
                padding={2}
                value={quantity}
                setvalue={setquantity}
                label={"Qnty"}
                placeholder={"0.00"}
                inputType={"number"}
              />
            </div>
             <div className=" overflow-x-hidden col-span-1">
              <InputField
                padding={2}
                value={rate}
                setvalue={setrate}
                label={"Rate"}
                placeholder={"0"}
                icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                inputType={"rupee"}
              />
            </div>
          </div>
          <div className=" grid grid-cols-3 gap-3">
           
            <div className=" overflow-x-hidden col-span-1">
              <InputField
                padding={2}
                value={amount}
                setvalue={setamount}
                label={"Amount"}
                placeholder={"0.00"}
                icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                inputType={"rupee"}
              />
            </div>
            <div className=" overflow-x-hidden col-span-1">
              <InputField
                value={discount}
                setvalue={setdiscount}
                label={"Discount %"}
                placeholder={"0"}
                inputType={"number"}
              />
            </div>
            <div className=" overflow-x-hidden col-span-1">
              <InputField
                value={gst}
                setvalue={setgst}
                label={"GST %"}
                placeholder={"0"}
                inputType={"number"}
              />
            </div>
          </div>
        </div>
      </div>

      {/* add new row buttons  */}
      <div className="flex space-x-4 mb-6">
        <button
          tabIndex={0}
          className=" hover:bg-[#00336628] transition px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl opacity-80 text-[#2543B1] bg-[#0033661A] text-base font-medium"
        >
          <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add new row
        </button>
        {/* <button
          tabIndex={0}
          className=" hover:bg-[#00336628] transition px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl opacity-80 text-[#2543B1] bg-[#0033661A] text-base font-medium">
          <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
            <Plus className="w-4 h-4 text-white" />
          </div>
          Add items in bulk
        </button> */}
      </div>
    </>
  );
};

const PurchaseOrderRightPart = () => {
    return (
    <>
      <div className="py-6 px-4 2xl:rounded-2xl xl:rounded-xl h-fit rounded-lg border-[1.5px] border-[#E8E8E8]">
        {/* header  */}
        <div className="flex gap-3 items-center justify-between mb-10">
          <h1 className=" max-w-1/2 xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#4A4A4A]">
            Purchase Order Review
          </h1>
          <button className="flex whitespace-nowrap items-center gap-2 bg-[#2543B1] text-white px-4 py-3 rounded-xl text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium hover:bg-[#1b34a3] transition">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <div className="2xl:p-8 xl:p-6 p-4 rounded-xl border-2 border-[#E8E8E8] ">
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-center font-semibold text-[#4A4A4A]">
            Purchase Order
          </h2>
          <h3 className="2xl:text-xl xl:text-lg lg:text-base text-sm text-center font-medium text-[#777777] mb-2">
            INV-1749026747109
          </h3>

          <div className="my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  Your Company name 123 Business Street City, State 12345
                </p>
              </div>

              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  Bill To:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  Customer Name
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  04-06-2025
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  Due Date:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  Not Set
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  Phone:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  +91 98293 29898
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  GST:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  1234567890
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y gap-4 divide-[#E8E8E8]">
                <thead className="">
                  <tr className=" text-[#4A4A4A]  2xl:text-xl xl:text-lg lg:text-base md:text-sm">
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Description
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Qty
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Rate
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Disc%
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      GST%
                    </th>
                    <th className=" py-3 whitespace-nowrap font-medium text-left ">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#E8E8E8]">
                  {[1, 2, 3, 4].map((item) => (
                    <tr
                      key={item}
                      className=" text-[#4A4A4A] xl:text-base lg:text-sm text-xs"
                    >
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        Item Description
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        1
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        10%
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        10%
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        ₹0.00
                      </td>
                      <td className=" py-4 whitespace-nowrap font-medium text-left">
                        ₹
                        {Number("0.002545").toLocaleString("en-IN", {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="2xl:text-xl xl:text-lg lg:text-base text-sm mb-6">
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">Subtotal:</span>
              <span className="text-[#4A4A4A] font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">Tax(10%):</span>
              <span className="text-[#4A4A4A] font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">Discount(20%):</span>
              <span className="text-[#4A4A4A] font-medium">₹0.00</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#E8E8E8] mt-2">
              <span className="font-medium text-gray-800">Total</span>
              <span className="font-medium text-gray-800">₹0.00</span>
            </div>
          </div>

          <div className="space-y-3 text-gray-800 text-sm">
            {/* Customer Note */}
            <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm">
              Customer note:{" "}
              <span className="text-[#4A4A4A]">Thankyou for business</span>
            </p>

            {/* Terms */}
            <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm  mb-4">
              Terms & Conditions:{" "}
              <span className="text-[#4A4A4A]">Something random</span>
            </p>

          </div>
        </div>
      </div>
    </>
  );
};



const DeliveryAddressInputField = ({ className }) => {
  const [selectedType, setSelectedType] = useState("organization");
  const [address, setAddress] = useState("Mumbai, Maharashtra");

  return (
    <div className={`w-full  ${className}`}>
      <p className="font-normal mb-3 text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm md:text-xs ">
        Delivery address
      </p>

      {/* Radio buttons */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              value="organization"
              checked={selectedType === "organization"}
              onChange={() => setSelectedType("organization")}
              className="accent-[#2543B1]"
            />
            <span className="font-medium text-sm text-[#4A4A4A]">
              Organization
            </span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="radio"
              name="addressType"
              value="customer"
              checked={selectedType === "customer"}
              onChange={() => setSelectedType("customer")}
              className="accent-[#2543B1]"
            />
            <span className="text-[#777777] font-medium text-sm">Customer</span>
          </label>
        </div>
      </div>

      {/* Address input */}
      <InputField
        value={address}
        setvalue={setAddress}
        hasLabel={false}
        placeholder={"Mumbai, Maharashtra"}
        label={""}
      />
    </div>
  );
};

const PurchaseNoInputField = ({ className }) => {
  const [orderno, setorderno] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={orderno}
          setvalue={setorderno}
          label={"Purchase Order#"}
          placeholder={"QT00001"}
        />
      </div>
    </>
  );
};

const ReferenceInputField = ({ className }) => {
  const [referenceId, setreferenceId] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={referenceId}
          setvalue={setreferenceId}
          label={"Reference#"}
          placeholder={""}
        />
      </div>
    </>
  );
};

const SubjectInputField = ({ className }) => {
  const [subject, setsubject] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={subject}
          setvalue={setsubject}
          label={"Subject"}
          placeholder={"Let your customers know what this quote is for"}
        />
      </div>
    </>
  );
};

const DateInputField = ({ className }) => {
  const [date, setdate] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={date}
          setvalue={setdate}
          placeholder={new Date(Date.now()).toLocaleDateString()}
          label={"Date"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const ShipmentPreferenceInputField = ({ className }) => {
  const [preference, setpreference] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={preference}
          setvalue={setpreference}
          isTextArea={true}
          minHeight={80}
          label={"Shipment Preference"}
          placeholder={"Type shipment preference "}
        />
      </div>
    </>
  );
};

const PaymentTermsInputField = ({ className }) => {
  const [terms, setterms] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={terms}
          setvalue={setterms}
          label={"Payment Terms"}
          placeholder={"Due on reciept"}
          hasDropDown={true}
          dropDownData={PaymentTermsDropDown}
        />
      </div>
    </>
  );
};

const DeliveryDateInputField = ({ className }) => {
  const [date, setdate] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={date}
          setvalue={setdate}
          label={"Delivery Date"}
          placeholder={"dd-mm-yyyy"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const VendorNameInputField = ({ className }) => {
  const [vendorName, setvendorName] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={vendorName}
          setvalue={setvendorName}
          readOnly={true}
          label={"Vendor Name"}
          placeholder={"Select or add vendor"}
          hasDropDown={true}
          dropDownData={customersDropDown}
        />
      </div>
    </>
  );
};

const UploadPurchaseOrder = () => {
  const [files, setfiles] = useState(null);

  return (
    <div className=" outline-[#00000029] rounded-lg px-3 py-6 border-2 border-[#00000033] border-dashed">
      {files && (
        <div>
          <ShowUploadedFiles files={files} />
          <div className=" flex flex-col gap-2 items-center my-5">
            <label
              htmlFor="upload-invoice"
              className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
            >
              Browse files
            </label>
            <p className="text-[#00000080] text-xs ">
              Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {!files && (
        <label
          tabIndex={0}
          htmlFor="upload-invoice"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className=" w-10 h-8 text-[#000000] mb-3" />
          <p className="font-medium xl:text-base md:text-sm mb-1">
            Upload invoices, receipts, or related documents
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
        onChange={(e) => {
          const maxSizeMB = 10;
          const validFiles = [];
          const invalidFiles = [];

          const files = Array.from(e.target.files);

          files.forEach((file) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
              showToast(`"${file.name}" is too large. Max size is 10MB.`, 1);
            }
          });

          // Do something with the valid files (e.g. store them in state)
          console.log("Valid files:", validFiles);
          setfiles(validFiles);

          // Clear the input to allow re-uploading the same files
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};