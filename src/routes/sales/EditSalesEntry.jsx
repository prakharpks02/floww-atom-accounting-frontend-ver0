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
} from "lucide-react";
import { showToast } from "../../utils/showToast";
import { useNavigate } from "react-router-dom";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { SubTotal } from "../../component/subTotal/SubTotal";
import { customersDropDown, PaymentMethodDropDown, StatusFieldsDropDown } from "../../utils/dropdownFields";

// Initial State
const initialState = {
  customer: "",
  salesperson: "",
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

export const EditSalesEntry = () => {
  const [formState, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();

  return (
    <>
      <ToastContainer />
      <div className=" p-6 md:px-4 xl:px-6 2xl:px-8   ">
        <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#4A4A4A] font-semibold mb-1">
          Edit Sales Entry
        </h1>
        <p className="mb-6 font-medium md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4]">
          Create a new sales record
        </p>

        {/* add sale details */}
        <div className=" md:p-4 lg:p-6 xl:p-7 2xl:p-8 border-[1.5px] border-[#0000001A] rounded-2xl ">
          {/* form heading  */}
          <h2 className="2xl:mb-8 xl:mb-7 lg:mb-6 md:mb-5 text-[#4A4A4A] font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ">
            Sales Information
          </h2>

          {/* sales info */}
          <div className="grid grid-cols-1 md:grid-cols-2 space-x-4 space-y-8">
            <CustomerNameInputField className="col-span-2" />
            {/* <SalesPersonInputField /> */}
            <CustomerEmailInputField />
            <CustomerMobileInputField />
            <SaleDateInputField />
            <PaymentMethodInputField />
            <SelectStatusInputField />
            <QuotationIDInputField />
            <GSTNumberInputField />
            <PANNumberInputField />
          </div>

          {/* Items info */}
          <ItemDetails />

          {/* Attachments Section */}
          <div className="mb-8 flex flex-col">
            <span className="2xl:text-lg xl:text-base lg:text-sm md:text-xs font-normal mb-1">
              Attachments
            </span>

            <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                tabIndex={0}
                onClick={() => {
                  navigate("/sales/createInvoice");
                }}
                className="outline-[#00000029] h-fit rounded-lg p-3 border-[1.5px] border-[#0000001A] flex flex-col items-center justify-center cursor-pointer"
              >
                <PencilLine className=" w-10 h-8 text-[#4A4A4A] mb-3" />
                <p className="font-medium xl:text-base md:text-sm mb-1 text-[#000000CC]">
                  Create Invoice
                </p>
                <p className="text-[#00000080] text-xs">
                  You can create your invoice here itself
                </p>
              </div>

              <UploadDocuments />
            </div>
          </div>

          {/* edit Sales Button */}
          <EditSalesButtons />
        </div>
      </div>
    </>
  );
};

const UploadDocuments = () => {
  const [files, setfiles] = useState(null);

  return (
    <div className=" outline-[#00000029] rounded-lg p-3 border-2 border-[#00000033] border-dashed">
      {files && (
        <div>
          <ShowUploadedFiles files={files} />
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
        multiple
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
        tabindex={0}
        placeholder="Additional notes or description"
        name="additional notes"
        id="add-sales-additional-notes"
        className=" text-[#000000c9] placeholder:text-[#00000080] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm md:text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};

const CustomerNameInputField = ({ className }) => {
  const [customerName, setcustomerName] = useState("");
  return (
    <>
      <div className={`flex flex-col overflow-y-visible relative ${className}`}>
        <InputField
          value={customerName}
          setvalue={setcustomerName}
          label={"Customer Name"}
          placeholder={"Select or type a customer name"}
          hasDropDown={true}
          dropDownData={customersDropDown}
          dropDownType="usersData"
        />
      </div>
    </>
  );
};

const CustomerEmailInputField = () => {
  const [customerEmail, setcustomerEmail] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={customerEmail}
          setvalue={setcustomerEmail}
          label={"Customer email address"}
          placeholder={"xyz@gmail.com"}
          inputType={"email"}
        />
      </div>
    </>
  );
};

const CustomerMobileInputField = () => {
  const [mobile, setmobile] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={mobile}
          setvalue={setmobile}
          label={"Customer phone number"}
          placeholder={"Enter phone no."}
          inputType={"tel"}
        />
      </div>
    </>
  );
};

const PaymentMethodInputField = () => {
  const [paymentMethod, setpaymentMethod] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={paymentMethod}
          setvalue={setpaymentMethod}
          label={"Payment Method"}
          placeholder={"Select Payment method"}
          hasDropDown={true}
          dropDownData={PaymentMethodDropDown}
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
          label={"Status"}
          placeholder={"Select status"}
          hasDropDown={true}
          dropDownData={StatusFieldsDropDown}
        />
      </div>
    </>
  );
};

const SaleDateInputField = () => {
  const [date, setdate] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={date}
          setvalue={setdate}
          label={"Sale Date"}
          placeholder={"dd-mm-yyyy"}
          inputType="date"
          icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
        />
      </div>
    </>
  );
};

const QuotationIDInputField = () => {
  const [qutotationID, setqutotationID] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={qutotationID}
          setvalue={setqutotationID}
          label={"Quotation ID (Optional)"}
          placeholder={"Enter Quotation ID"}
        />
      </div>
    </>
  );
};

const GSTNumberInputField = () => {
  const [gstNo, setgstNo] = useState("");
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={gstNo}
          setvalue={setgstNo}
          label={"GSTIN Number"}
          placeholder={"ABCDE1234F"}
        />
      </div>
    </>
  );
};

const PANNumberInputField = () => {
  const [panNo, setpanNo] = useState("");

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={panNo}
          setvalue={setpanNo}
          label={"PAN Number"}
          placeholder={"AFZPK7190K"}
        />
      </div>
    </>
  );
};

const EditSalesButtons = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  return (
    <>
      <EditInvoiceInfoModal isOpen={isModalOpen} setisOpen={setisModalOpen} />
      <div className="flex items-center space-x-4 2xl:text-xl xl:text-lg lg:text-base md:text-sm">
        <button
          tabIndex={0}
          onClick={() => {
            setisModalOpen(true);
          }}
          className=" cursor-pointer flex items-center gap-2 bg-[#2543B1] hover:bg-[#252eb1] text-white font-medium px-6 py-4 rounded-xl transition-all duration-200"
        >
          Edit Sales Entry
          <Plus className="w-5 h-5" />
        </button>
        <button
          tabIndex={0}
          className=" cursor-pointer text-[#4A4A4A] font-medium px-6 py-4 rounded-xl border-2 border-[#3333331A] hover:bg-gray-50 shadow-sm transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

const EditInvoiceInfoModal = ({ isOpen, setisOpen }) => {
  const [action, setaction] = useState("");
  const [isConfirm, setisConfirm] = useState(false);
  const [files, setfiles] = useState(null);

  const handleSubmit = () => {
    if (!action) {
      showToast("Select a option", 1);
      return;
    }
    setisConfirm(true);
  };

  const handelClose = () => {
    setaction("");
    setisConfirm(false);
    setisOpen(false);
    setfiles(null)
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed w-[100dvw] top-0 left-0 h-[100dvh] min-h-[350px] overflow-y-auto z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">
        <div className="bg-white rounded-xl w-[90%] max-w-md shadow-lg p-6 animate-slideDown">
          {/* header  */}
          <div className=" mb-6">
            <h2 className=" mb-3 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold">
              Edit Invoice Information
            </h2>
            <p className=" text-[#777777] font-medium xl:text-base md:text-sm text-xs">
              Choose how to handle the invoice after editing:
            </p>
          </div>
          {/* input  */}
          {!isConfirm && (
            <div className=" mb-6">
              <InputField
                value={action}
                setvalue={setaction}
                hasLabel={false}
                placeholder={"Select one type"}
                dropDownData={[
                  {
                    name: "Generate new invoice",
                    value: "Generate new invoice",
                  },
                  {
                    name: "Upload existing invoice",
                    value: "Upload existing invoice",
                  },
                ]}
                hasDropDown={true}
              />
            </div>
          )}

          {/* upload document  */}
          {isConfirm && action === "Upload existing invoice" && (
            <>
            {files && <ShowUploadedFiles files={files}/>}
              <label 
              htmlFor="upload-previous-invoice"
              className=" cursor-pointer border-[1.5px] border-[#00000026] rounded-xl flex justify-center border-dashed p-3">
                <Upload className=" inline-block w-5 h-5 text-[#2543B1] " />
                <span className=" text-[#4A4A4A] 2xl:text-lg xl:text-base md:text-sm text-xs">
                  Upload Invoice
                </span>
              </label>
              <input
              // multiple={true}
                onChange={(e) => {
                  console.log(e.target.files)
                  setfiles(Array.from(e.target.files));
                }}
                type="file"
                id="upload-previous-invoice"
                className=" hidden"
              />
            </>
          )}

          {/* buttons  */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={handelClose}
              className="col-span-1 py-2 border-2 border-[#3333331A] rounded-xl hover:bg-gray-100 transition cursor-pointer text-[#777777] "
            >
              Cancel
            </button>
            <button
              aria-label="Add Member"
              onClick={handleSubmit}
              className=" col-span-1 cursor-pointer flex items-center justify-center px-3 lg:px-5 py-1 lg:py-3 bg-[#2543B1] transition hover:bg-blue-900 border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              <span className="">Confirm</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
