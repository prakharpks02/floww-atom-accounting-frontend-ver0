import { useEffect, useReducer, useRef, useState } from "react";
import {
  Plus,
  Upload,
  FilePlus,
  ChevronDown,
  Calendar,
  CalendarDays,
  PlusCircle,
  PencilLine,
  IndianRupee,
  Trash2,
} from "lucide-react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { showToast } from "../../utils/showToast";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import {SubTotal} from "../../component/subTotal/SubTotal"
import { customersDropDown, StatusFieldsDropDown } from "../../utils/dropdownFields";

// Initial State
const initialState = {
  Vendor: "",
  Purchasesperson: "",
  date: "",
  paymentMethod: "",
  status: "Pending",
  quotationId: "",
  gst: "",
  pan: "",
  notes: "",
  items: [
    {
      name: "",
      description: "",
      qty: 1,
      unit: "pcs",
      rate: 0,
      discount: 0,
      tax: 0,
    },
  ],
};

// Reducer Function
function reducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };

    case "UPDATE_ITEM":
      const updatedItems = state.items.map((item, index) =>
        index === action.index
          ? { ...item, [action.field]: action.value }
          : item
      );
      return { ...state, items: updatedItems };

    case "ADD_ITEM":
      return {
        ...state,
        items: [
          ...state.items,
          {
            name: "",
            description: "",
            qty: 1,
            unit: "pcs",
            rate: 0,
            discount: 0,
            tax: 0,
          },
        ],
      };

    default:
      return state;
  }
}

export const EditPurchase = () => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  return (
    <>
      <ToastContainer />
      <div className=" p-6 md:px-4 xl:px-6 2xl:px-8 ">
        <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#4A4A4A] font-semibold mb-1">
          Edit Purchase
        </h1>
        <p className="mb-6 font-medium md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4]">
          Edit your purchase information
        </p>

        {/* add Purchase details */}
        <div className=" mb-6 md:p-4 lg:p-6 xl:p-7 2xl:p-8 border-[1.5px] border-[#0000001A] rounded-2xl ">
          {/* form heading  */}
          <h2 className="2xl:mb-8 xl:mb-7 lg:mb-6 md:mb-5 text-[#4A4A4A] font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ">
            Purchase Information
          </h2>

          {/* Purchases info */}
          <div className="grid grid-cols-1 md:grid-cols-2 space-x-4 space-y-8">
            <VendorNameInputField className={"col-span-2"} />
            <SelectStatusInputField />
            <PurchaseDateInputField />
            <VendorEmailInputField />
            <VendorMobileInputField />
            <GSTNumberInputField />
            <PANNumberInputField />
          </div>

          {/* Items info */}
          <ItemDetails />

          {/* Attachments Section */}
          <UploadAttachment />

          {/* save Purchases Entry Button */}
          <div className="flex items-center space-x-4 2xl:text-xl xl:text-lg lg:text-base md:text-sm">
            <button
              tabIndex={0}
              className=" cursor-pointer flex items-center gap-2 bg-[#2543B1] hover:bg-[#252eb1] text-white font-medium px-6 py-4 rounded-xl transition-all duration-200"
            >
              Edit Purchase
            </button>
            <button
              tabIndex={0}
              className=" cursor-pointer text-[#4A4A4A] font-medium px-6 py-4 rounded-xl border-2 border-[#3333331A] hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemDetails = () => {
  const [itemDesc, setitemDesc] = useState("");
  const [rate, setrate] = useState("");
  const [quantity, setquantity] = useState("");
  const [amount, setamount] = useState("");
  const [gst, setgst] = useState("");
  const [discount, setdiscount] = useState("")

  return (
    <>
      <div className=" grid grid-cols-22 space-x-2 mb-8">
        <div className=" overflow-x-hidden col-span-7">
          <InputField
            value={itemDesc}
            setvalue={setitemDesc}
            label={"Item Details"}
            placeholder={"Enter Item name"}
          />
        </div>
        <div className=" overflow-x-hidden col-span-3">
          <InputField
            padding={2}
            value={rate}
            setvalue={setrate}
            label={"Rate"}
            placeholder={"0.00"}
            icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
            inputType={"rupee"}
          />
        </div>
        <div className=" overflow-x-hidden col-span-3">
          <InputField
            value={quantity}
            setvalue={setquantity}
            label={"Qnty"}
            placeholder={"0"}
            inputType={"number"}
          />
        </div>
        <div className=" overflow-x-hidden col-span-3">
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
        <div className=" overflow-x-hidden col-span-3">
          <InputField
            value={discount}
            setvalue={setdiscount}
            label={"Discount %"}
            placeholder={"0.00"}
            inputType={"number"}
          />
        </div>
        <div className=" overflow-x-hidden col-span-3">
          <InputField
            value={gst}
            setvalue={setgst}
            label={"GST %"}
            placeholder={"0.00"}
            inputType={"number"}
          />
        </div>
      </div>
      <div className=" grid grid-cols-2 gap-3 mb-6">
        <div>
          {/* add sales button  */}
          <div className="flex gap-4 mb-6">
            <button
              tabIndex={0}
              className=" hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium"
            >
              <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Add new row
            </button>
            {/* <button
            tabIndex={0}
            className=" hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium">
            <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Add items in bulk
          </button> */}
          </div>
          {/* Additional Notes Section */}
          <AdditionalNotes />
        </div>
        <SubTotal />
      </div>
    </>
  );
};

const AdditionalNotes = ({ className }) => {
  const [notes, setnotes] = useState("");
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor="add-sales-additional-notes"
        className="2xl:text-lg xl:text-base lg:text-sm md:text-xs font-normal mb-1"
      >
        Notes*
      </label>
      <textarea
        value={notes}
        onChange={(e) => {
          setnotes(e.target.value);
        }}
        required
        tabIndex={0}
        placeholder="Additional notes or description"
        name="additional notes"
        id="add-sales-additional-notes"
        className=" text-[#000000c9] placeholder:text-[#00000080] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm md:text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};


const UploadAttachment = ({ className }) => {
  const MAX_SIZE_MB = 10;
  const [file, setFile] = useState({ name: "/icons/floww.pdf" });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const fileSizeInMB = selectedFile.size / (1024 * 1024);
    if (fileSizeInMB > MAX_SIZE_MB) {
      showToast("File size must be less than 10MB.", 1);
      return;
    }

    setFile(selectedFile);
  };

  const removeFile = () => {
    setFile(null);
  };

  const getExtension = (filename) => filename?.split(".").pop().toLowerCase();

  return (
    <div className="flex flex-col gap-2 mb-6">
      <span className="text-xs text-gray-600">
        Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
      </span>

      <div className="flex items-center gap-4 flex-wrap">
        {file && (
          <div className="flex items-center gap-4 border-1 border-[#0000003b] rounded-lg p-3 bg-white">
            <div className="w-6 h-6">
              <FileIcon
                extension={getExtension(file.name)}
                {...defaultStyles[getExtension(file.name)]}
              />
            </div>
            <span className="text-sm text-gray-800 truncate max-w-[180px]">
              {file.name}
            </span>
            <Trash2
              size={16}
              className="text-red-500 cursor-pointer"
              onClick={removeFile}
            />
          </div>
        )}

        <label className="flex items-center gap-1 cursor-pointer bg-[#0033661A] hover:bg-gray-200 transition px-6 py-3 rounded-lg text-blue-900 text-sm font-medium">
          <Upload size={16} />
          Upload new
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

const VendorNameInputField = ({ className }) => {
  const [vendorName, setvendorName] = useState("");
  return (
    <>
      <div className={`flex flex-col overflow-y-visible relative ${className}`}>
        <InputField
          value={vendorName}
          setvalue={setvendorName}
          label={"Vendor Name"}
          placeholder={"Select or Create a vendor"}
          hasDropDown={true}
          dropDownData={customersDropDown}
          dropDownType="usersData"
        />
      </div>
    </>
  );
};

const VendorEmailInputField = () => {
  const [vendorEmail, setvendorEmail] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={vendorEmail}
          setvalue={setvendorEmail}
          label={"Vendor email address*"}
          required={true}
          placeholder={"Enter email"}
          inputType={"email"}
        />
      </div>
    </>
  );
};

const VendorMobileInputField = () => {
  const [vendorMobile, setvendorMobile] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={vendorMobile}
          setvalue={setvendorMobile}
          label={"Vendor phone number*"}
          placeholder={"Enter mobile no."}
          inputType={"tel"}
          required={true}
        />
      </div>
    </>
  );
};

const SelectStatusInputField = () => {
  const [status, setstatus] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={status}
          setvalue={setstatus}
          required={true}
          label={"Status*"}
          placeholder={"Select status"}
          hasDropDown={true}
          dropDownData={StatusFieldsDropDown}
        />
      </div>
    </>
  );
};

const PurchaseDateInputField = () => {
  const [date, setdate] = useState("");
  return (
    <>
      <div className=" relative">
        <InputField
          value={date}
          setvalue={setdate}
          required={true}
          label={"Purchase Date"}
          placeholder={"dd-mm-yyyy"}
          inputType="date"
          icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
        />
      </div>
    </>
  );
};

const GSTNumberInputField = () => {
  const [gst, setgst] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={gst}
          setvalue={setgst}
          label={"GSTIN Number"}
          placeholder={"ABCDE1234F"}
        />
      </div>
    </>
  );
};

const PANNumberInputField = () => {
  const [pan, setpan] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={pan}
          setvalue={setpan}
          label={"PAN Number"}
          placeholder={"AFZPK7190K"}
        />
      </div>
    </>
  );
};
