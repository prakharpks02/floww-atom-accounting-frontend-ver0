import {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
  useMemo,
} from "react";
// import { UploadInvoice } from "./UploadInvoice";
import {
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  FileText,
  IndianRupee,
  Loader2,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { showToast } from "../../utils/showToast";
import {
  customersDropDown,
  PaymentTermsDropDown,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { CompanyContext } from "../../context/company/CompanyContext";
import { CustomerContext } from "../../context/customer/customerContext";
import { AnimatePresence, motion } from "framer-motion";
import { ToWords } from "to-words";
import { useLocation, useNavigate } from "react-router-dom";
import { InvoiceContext } from "../../context/invoiceContext/InvoiceContext";
import { downloadInvoiceAsPDF } from "../../utils/downloadInvoiceDetails";
import { SalesContext } from "../../context/sales/salesContext";
import {
  PurchaseOrderContext,
  PurchaseOrderContextProvider,
} from "../../context/purchaseOrder/PurchaseOrderContext";

export const CreateInvoice = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <>
      <ToastContainer />
      <div className="p-6 px-3 md:px-4 xl:px-6 2xl:px-8  ">
        {/* Header */}
        <div className="mb-6">
          <h2 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#4A4A4A]">
            Create or Upload Invoice
          </h2>
          <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs font-medium mt-1">
            Manage your invoice for the sales
          </p>
        </div>

        {/* Tabs */}
        {/* <div className=" hidden mb-4 md:flex rounded-lg bg-[#0033661A] overflow-hidden xl:py-2 xl:px-3 p-1 w-full">
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
            Create new invoice
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
            Upload existing invoice
          </button>
        </div> */}

        {/* main content */}
        {activeTab === "create" && <CreateInvoiceForm activeTab={activeTab} />}
        {/* {activeTab === "upload" && <UploadInvoice activeTab={activeTab} />} */}
      </div>
    </>
  );
};

const CreateInvoiceForm = ({ activeTab }) => {
  const [isLoading, setisLoading] = useState(false);
  const { createInvoice, createInvoiceForm } = useContext(InvoiceContext);
  const { companyDetails } = useContext(CompanyContext);

  return (
    <>
      <div className=" grid lg:grid-cols-2 grid-cols-1 gap-x-2 gap-y-4 mb-4">
        <CreateInvoiceLeftPart />
        <CreateInvoiceRightPart handelDownloadInvoice={downloadInvoiceAsPDF} />
      </div>
      {/* Action Buttons */}
      <div className="flex sm:flex-row flex-col sm:items-center gap-4">
        <button
          disabled={isLoading}
          onClick={async (e) => {
            try {
              await createInvoice(e, setisLoading, activeTab);
              await downloadInvoiceAsPDF(
                companyDetails,
                createInvoiceForm,
                setisLoading
              );
            } catch (error) {
              console.log("error");
            }
          }}
          className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            "Create Invoice"
          )}
        </button>
        <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </>
  );
};

const CreateInvoiceLeftPart = () => {
  return (
    <>
      <div className=" 2xl:p-8 xl:p-6 md:p-4 py-4 px-2 2xl:rounded-2xl xl:rounded-xl rounded-lg border-[1.5px] border-[#E8E8E8] ">
        <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold text-[#4A4A4A] mb-5">
          Create Invoice
        </h1>

        {/* Invoice info */}
        <PurchaseOrderContextProvider>
          <div className=" grid md:grid-cols-2 grid-cols-1 gap-3 space-y-4 mb-4 w-full">
            <InvoiceNumberInputField className={" col-span-1"} />
            <InvoiceDateInputField className={" col-span-1"} />
            <TermsInputField className={" col-span-1"} />
            <DueDateInputField className={" col-span-1"} />
            <CustomerNameInputField className={" md:col-span-2 col-span-1"} />
            <SubjectInputField className={" md:col-span-2 col-span-1"} />
            <OrderNumberInputField className={" col-span-2"} />
            <SalesIDInputField className={" col-span-2"} />
          </div>

          {/* Item Table */}
          <ItemDetails />
        </PurchaseOrderContextProvider>

        {/* Totals Section */}
        <SubTotal className={"mb-6"} />

        {/* Customer Note */}
        <CustomerNotes />

        {/* Terms and Conditions */}
        <TermsAndConditions />
      </div>
    </>
  );
};

const CustomerNotes = ({ className }) => {
  const [notes, setnotes] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "notes",
      value: notes || "N/A",
    });
  }, [notes]);

  return (
    <>
      <div className="mb-6">
        <InputField
          value={notes}
          setvalue={setnotes}
          label={"Customer note"}
          isTextArea={true}
          minHeight={96}
          placeholder={"Thankyou for business"}
        />
        <p className="2xl:text-base xl:text-sm text-xs font-medium text-[#777777]">
          Will be displayed on the invoice
        </p>
      </div>
    </>
  );
};

const TermsAndConditions = ({ className }) => {
  const [toc, settoc] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "listToc",
      value: [{ terms_of_service: toc || "N/A" }],
    });
  }, [toc]);

  return (
    <>
      <div className="mb-6">
        <InputField
          value={toc}
          setvalue={settoc}
          label={"Terms and Conditions"}
          isTextArea={true}
          minHeight={119}
          placeholder={
            "Enter Terms and Conditions of your business for the transaction"
          }
        />
      </div>
    </>
  );
};

const CreateInvoiceRightPart = ({
  className,
  handelDownloadInvoice = () => {},
}) => {
  const { createInvoiceForm } = useContext(InvoiceContext);
  const { companyDetails } = useContext(CompanyContext);
  const [taxAmount, settaxAmount] = useState("");
  const [discount, setdiscount] = useState("");
  const [isDownloading, setisDownloading] = useState(false);

  useEffect(() => {
    const tax = Number(createInvoiceForm?.tdsAmount?.split("%")[0]) || 0;
    settaxAmount(
      Number(
        ((Number(createInvoiceForm?.subtotalAmount) || 0) *
          (100 - Number(createInvoiceForm?.discountAmount)) *
          tax) /
          10000
      ).toFixed(2)
    );
  }, [
    createInvoiceForm?.tdsAmount,
    createInvoiceForm?.subtotalAmount,
    createInvoiceForm?.discountAmount,
  ]);

  // console.log(createInvoiceForm?.tdsAmount);

  useEffect(() => {
    setdiscount(
      Number(
        ((createInvoiceForm?.subtotalAmount || 0) *
          (createInvoiceForm?.discountAmount || 0)) /
          100
      ).toFixed(2)
    );
  }, [createInvoiceForm?.discountAmount, createInvoiceForm?.subtotalAmount]);

  return (
    <>
      <div
        className={`py-6 px-2 sm:px-4 px 2xl:rounded-2xl xl:rounded-xl h-fit rounded-lg border-[1.5px] border-[#E8E8E8] ${className}`}
      >
        {/* header  */}
        <div className="flex sm:flex-row flex-col gap-3 sm:items-center justify-between mb-10">
          <h1
            style={{ color: "#4A4A4A" }}
            className=" xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold "
          >
            Invoice review
          </h1>
          <button
            disabled={isDownloading}
            onClick={async (e) => {
              e.preventDefault();
              handelDownloadInvoice(
                companyDetails,
                createInvoiceForm,
                setisDownloading
              );
            }}
            aria-label="download invoice as pdf"
            className="flex disabled:cursor-progress cursor-pointer items-center justify-center gap-2 bg-[#2543B1] text-white px-4 py-3 sm:rounded-xl rounded-lg text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium hover:bg-[#1b34a3] transition"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <div className="2xl:p-6 md:p-4 p-3 rounded-xl border-2 border-[#E8E8E8] ">
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-center font-semibold text-[#4A4A4A]">
            Invoice review
          </h2>
          {/* {createInvoiceForm?.invoiceId && (
            <h3 className="2xl:text-xl xl:text-lg lg:text-base text-sm text-center font-medium text-[#777777] mb-2">
              {createInvoiceForm?.invoiceId}
            </h3>
          )} */}

          <div className="my-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {companyDetails?.company_name},{" "}
                  {companyDetails?.company_address}
                </p>
              </div>

              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  Bill To:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createInvoiceForm?.customerName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createInvoiceForm?.invoiceDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  Due Date:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createInvoiceForm?.invoiceDueBy}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  Phone:
                </h4>
                <p className="text-[#777777] whitespace-nowrap font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  +91{createInvoiceForm?.contactNo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  GST:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createInvoiceForm?.gstNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y gap-4 divide-[#E8E8E8]">
                <thead className="">
                  <tr className=" text-[#4A4A4A]  2xl:text-lg xl:text-base lg:text-sm text-xs ">
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Description
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Rate
                    </th>
                    <th className="pr-4 py-3 whitespace-nowrap font-medium text-left ">
                      Qty
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
                  {createInvoiceForm?.listItems?.map((item, index) => (
                    <tr
                      key={index}
                      className=" text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm text-xs"
                    >
                      <td className="pr-4 py-4 font-medium text-left">
                        {item.item_description}
                      </td>

                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item.base_amount && (
                          <>
                            <IndianRupee className=" w-3.5 h-3.5 inline-block" />
                            {`${item?.base_amount}`}
                          </>
                        )}
                      </td>

                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item.quantity}
                      </td>

                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item.discount && `${item.discount}%`}
                      </td>

                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item.gst_amount && `${item.gst_amount}%`}
                      </td>

                      <td className=" py-4 whitespace-nowrap font-medium text-left">
                        {item.gross_amount
                          ? `₹${Number(item.gross_amount).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}`
                          : ""}
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
              <span className="text-[#4A4A4A] font-medium">
                ₹{createInvoiceForm?.subtotalAmount}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Tax({createInvoiceForm?.tdsAmount}):
              </span>
              <span className="text-[#4A4A4A] font-medium">
                +₹{taxAmount || 0.0}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Discount({createInvoiceForm?.discountAmount}%):
              </span>
              <span className="text-[#4A4A4A] font-medium">-₹{discount}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#cdcdcd] mt-2">
              <span className="font-medium text-gray-800">Total</span>
              <span className="font-medium text-gray-800">
                ₹{createInvoiceForm?.totalAmount}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-gray-800 text-sm">
            {/* Customer Note */}
            {createInvoiceForm?.notes && (
              <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm">
                Customer note:{" "}
                <span className="text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm text-xs">
                  {createInvoiceForm?.notes}
                </span>
              </p>
            )}

            {/* Terms */}
            {createInvoiceForm?.listToc[0]?.terms_of_service && (
              <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm  mb-4">
                Terms & Conditions:{" "}
                <span className="text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm text-xs">
                  {createInvoiceForm?.listToc[0]?.terms_of_service}
                </span>
              </p>
            )}

            <div className="grid grid-cols-2 gap-6 text-sm">
              {/* Left Column */}
              {/* <div className="space-y-4">
                <div>
                  <p className="font-medium text-[#4A4A4A] 2xl:text-xl xl:text-lg lg:text-base text-sm">
                    Account Holder
                  </p>
                  <p className="text-[#777777] 2xl:text-base lg:text-sm text-xs">
                    {
                      createInvoiceForm?.paymentNameList[0]
                        ?.bank_account_receivers_name
                    }
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#4A4A4A] 2xl:text-xl xl:text-lg lg:text-base text-sm">
                    Account number :
                  </p>
                  <p className="text-[#777777] 2xl:text-base lg:text-sm text-xs">
                    {createInvoiceForm?.paymentNameList[0]?.bank_account_number}
                  </p>
                </div>
              </div> */}

              {/* Right Column */}
              {/* <div className="space-y-4">
                <div>
                  <p className="font-medium text-[#4A4A4A] 2xl:text-xl xl:text-lg lg:text-base text-sm">
                    Bank name
                  </p>
                  <p className="text-[#777777] 2xl:text-base lg:text-sm text-xs">
                    {createInvoiceForm?.paymentNameList[0]?.bank_name}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-[#4A4A4A] 2xl:text-xl xl:text-lg lg:text-base text-sm">
                    IFSC Code:
                  </p>
                  <p className="text-[#777777] 2xl:text-base lg:text-sm text-xs">
                    {createInvoiceForm?.paymentNameList[0]?.bank_account_IFSC}
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemDetails = ({ className }) => {
  const { saleDetails } = useContext(SalesContext);
  const { purchaseOrderDetails } = useContext(PurchaseOrderContext);
  const blankItem = {
    item_description: "",
    unit_price: "",
    quantity: "",
    gross_amount: "",
    gst_amount: "",
    discount: "",
    hsn_code: "N/A",
  };
  const [items, setItems] = useState(
    [
      ...(saleDetails?.list_items || []),
      ...(purchaseOrderDetails?.list_items || []),
    ] || [blankItem]
  );
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  const { pathname } = useLocation();

  // changes fields for particular item row
  const handleChange = (index, field, value) => {
    // Dispatch to reducer to update the item field
    createInvoiceDispatch({
      type: "UPDATE_ITEM_FIELD",
      index,
      field,
      value,
    });

    // Update local items state
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    // update total amount
    if (
      items[index].unit_price &&
      items[index].quantity &&
      items[index].discount &&
      items[index].gst_amount
    ) {
      const temp = items;
      temp[index].gross_amount = (
        (Number(items[index].unit_price) *
          Number(items[index].quantity) *
          (100 - Number(items[index].discount)) *
          (100 + Number(items[index].gst_amount))) /
        10000
      ).toFixed(2);

      //update gross amount on create salea form
      createInvoiceDispatch({
        type: "UPDATE_ITEM_FIELD",
        index,
        field: "gross_amount",
        value: temp[index].gross_amount,
      });
      setItems(temp);
    }
  };

  // add new row , also add the row to sales reducer
  const addRow = () => {
    setItems([...items, blankItem]);
    createInvoiceDispatch({
      type: "ADD_ITEM",
      item: blankItem,
    });
  };

  // remove a existing row , also remove the row to sales reducer
  const removeRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    createInvoiceDispatch({
      type: "REMOVE_ITEM",
      index,
    });
  };

  useEffect(() => {
    if (!saleDetails && !purchaseOrderDetails) {
      setItems([blankItem]);
      return;
    }
    setItems(
      [
        ...(saleDetails?.list_items || []),
        ...(purchaseOrderDetails?.list_items || []),
      ] || [blankItem]
    );
  }, [saleDetails, purchaseOrderDetails]);

useEffect(() => {
  
}, [items])


  // reset the create sale form to intial value when not in addSales page
  useEffect(() => {
    !pathname.toLowerCase() != "/sales/createInvoice" && setItems([blankItem]);
  }, [pathname]);

  return (
    <>
      <div className={`mb-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Table</h3>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className=" space-y-3 mb-8">
              <div className=" grid md:grid-cols-5 grid-cols-2 gap-3">
                <div className=" overflow-x-hidden md:col-span-3 col-span-2">
                  <InputField
                    required={true}
                    autoComplete="off"
                    value={item.item_description}
                    setvalue={(val) => {
                      handleChange(index, "item_name", val);
                      handleChange(index, "item_description", val);
                    }}
                    label={"Item Details"}
                    placeholder={"Enter Item name"}
                  />
                </div>
                {/* <div className=" overflow-x-hidden col-span-3">
                  <InputField
                    autoComplete="off"
                    value={item.item_description}
                    setvalue={(val) => {
                      handleChange(index, "item_name", val);
                      handleChange(index, "item_description", val);
                    }}
                    label={"Item Details"}
                    placeholder={"Enter Item name"}
                  />
                </div> */}
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
                    required={true}
                    autoComplete="off"
                    padding={2}
                    value={item.unit_price}
                    setvalue={(val) => {
                      handleChange(index, "unit_price", val);
                      handleChange(index, "base_amount", val);
                    }}
                    label={"Rate"}
                    placeholder={"0"}
                    icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                    inputType={"rupee"}
                  />
                </div>
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
                    required={true}
                    autoComplete="off"
                    padding={2}
                    value={item.quantity}
                    setvalue={(val) => handleChange(index, "quantity", val)}
                    label={"Qnty"}
                    placeholder={"0.00"}
                    inputType={"number"}
                  />
                </div>
              </div>
              <div className=" grid md:grid-cols-3 grid-cols-2 gap-3">
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
                    required={true}
                    autoComplete="off"
                    max={100}
                    min={0}
                    value={item.discount}
                    setvalue={(val) => handleChange(index, "discount", val)}
                    label={"Discount %"}
                    placeholder={"0"}
                    inputType={"number"}
                  />
                </div>
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
                    required={true}
                    autoComplete="off"
                    max={100}
                    min={0}
                    value={item.gst_amount}
                    setvalue={(val) => handleChange(index, "gst_amount", val)}
                    label={"GST %"}
                    placeholder={"0"}
                    inputType={"number"}
                  />
                </div>
                <div className=" overflow-x-hidden md:col-span-1 col-span-2">
                  <InputField
                    required={true}
                    readOnly={true}
                    autoComplete="off"
                    padding={2}
                    value={item.gross_amount}
                    setvalue={(val) => handleChange(index, "gross_amount", val)}
                    label={"Amount"}
                    placeholder={"0.00"}
                    icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                    inputType={"rupee"}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6 w-full">
                {isLast && (
                  <button
                    tabIndex={0}
                    onClick={addRow}
                    className="hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium"
                  >
                    <div className="p-0.5 rounded-full flex items-center bg-[#2543B1]">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                    Add new row
                  </button>
                )}
                {items.length > 1 && (
                  <button
                    tabIndex={0}
                    onClick={() => removeRow(index)}
                    className="hover:bg-red-100 transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-red-600 bg-red-50 text-base font-medium"
                  >
                    <div className="p-0.5 rounded-full flex items-center bg-red-600">
                      <X className="w-4 h-4 text-white" />
                    </div>
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const InvoiceNumberInputField = ({ className }) => {
  const [invoiceNumber, setinvoiceNumber] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceNumber",
      value: invoiceNumber,
    });
  }, [invoiceNumber]);

  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={invoiceNumber}
          setvalue={setinvoiceNumber}
          label={"Invoice Number"}
          placeholder={"Enter invoice number"}
        />
      </div>
    </>
  );
};

const OrderNumberInputField = ({ className }) => {
  const [orderNumber, setorderNumber] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isCustomPOId, setisCustomPOId] = useState(true);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [query, setquery] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  const { getPurchaseOrderList, purchaseOrderList, setpurchaseOrderDetails } =
    useContext(PurchaseOrderContext);
  const containerRef = useRef();
  const dropDownRef = useRef();

  const filteredData = useMemo(() => {
    if (!query) return purchaseOrderList;
    return (purchaseOrderList || []).filter((item) => {
      console.log(item.po_number);
      return item.po_number.toLowerCase().includes(query);
    });
  }, [query, purchaseOrderList]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "orderNumber",
      value: orderNumber ? orderNumber : "N/A",
    });
  }, [orderNumber]);

  useEffect(() => {
    getPurchaseOrderList(setisLoading);
  }, []);

  useEffect(() => {
    const handelClickOutside = (e) => {
      if (
        containerRef.current &&
        dropDownRef.current &&
        !containerRef.current.contains(e.target) &&
        !dropDownRef.current.contains(e.target)
      ) {
        setisDropdownOpen(false);
      }
    };

    window.addEventListener("pointerdown", handelClickOutside);

    return () => {
      window.removeEventListener("pointerdown", handelClickOutside);
    };
  }, [containerRef.current, dropDownRef.current]);

  console.log(filteredData);

  return (
    <>
      <div
        className={`flex flex-col overflow-y-visible relative w-full ${className}`}
      >
        <label className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1">
          Enter Order number(Optional)
        </label>

        {/* radio buttons for switch saels id type  */}
        <div className="mb-3 mt-1 flex items-center gap-8">
          {/* radio button for custom input  */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="salesIdType"
              value={isCustomPOId}
              checked={isCustomPOId}
              onChange={(e) => {
                setorderNumber("");
                setpurchaseOrderDetails(null);
                setisCustomPOId(true);
              }}
              className="sr-only"
            />
            {/* custom styled circle */}
            <div
              className={`w-4 h-4 rounded-full border-[2.5px] flex items-center justify-center ${
                isCustomPOId ? "border-blue-800" : "border-gray-400"
              }`}
            >
              {isCustomPOId && (
                <div className="w-2 h-2 bg-blue-800 rounded-full" />
              )}
            </div>
            <span className="text-sm font-medium capitalize">Custom</span>
          </label>

          {/* radio button for select dropdown input  */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="salesIdType"
              value={isCustomPOId}
              checked={!isCustomPOId}
              onChange={(e) => {
                setisCustomPOId(false);
              }}
              className="sr-only"
            />
            {/* custom styled circle */}
            <div
              className={`w-4 h-4 rounded-full border-[2.5px] flex items-center justify-center ${
                !isCustomPOId ? "border-blue-800" : "border-gray-400"
              }`}
            >
              {!isCustomPOId && (
                <div className="w-2 h-2 bg-blue-800 rounded-full" />
              )}
            </div>
            <span className="text-sm font-medium capitalize">Select</span>
          </label>
        </div>

        {isCustomPOId && (
          <InputField
            value={orderNumber}
            setvalue={setorderNumber}
            label={"Order number"}
            hasLabel={false}
            placeholder={"Enter Order number"}
          />
        )}

        {!isCustomPOId && (
          <>
            {/* input area  */}
            <div
              ref={containerRef}
              className="rounded-xl border-[#0000001A] border-[1.5px] px-4
                py-3 flex items-center"
            >
              <input
                autoComplete
                required
                readOnly
                onClick={() => {
                  setisDropdownOpen(!isDropdownOpen);
                }}
                tabIndex={0}
                placeholder={"Select Sales ID"}
                value={orderNumber}
                className={`w-full relative items-center outline-none 2xl:text-lg xl:text-base 
                lg:text-sm text-xs font-normal placeholder:text-[#00000080]
                text-[#343434] cursor-default `}
              />
              <button
                aria-label="toggle drop down"
                className=" outline-none cursor-pointer"
                onClick={() => {
                  setisDropdownOpen(!isDropdownOpen);
                }}
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#000000B2] transition-transform ${
                    isDropdownOpen ? "-rotate-180" : ""
                  } `}
                />
              </button>
            </div>

            {/* dropdown sales list  */}
            {purchaseOrderList && purchaseOrderList.length > 0 && (
              <div
                ref={dropDownRef}
                className={`absolute top-[105%] left-0 w-full ${
                  isDropdownOpen
                    ? `  overflow-auto border-[1.5px]`
                    : "h-0 overflow-x-hidden border-0 "
                }
              bg-white z-5 rounded-xl border-[#0000001A]`}
                style={{ maxHeight: `250px` }}
              >
                {isLoading && (
                  <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
                    <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
                  </div>
                )}

                {/* search bar  */}
                <input
                  value={query}
                  onChange={(e) => {
                    setquery(e.target.value);
                  }}
                  type="text"
                  placeholder="Search sales ID"
                  className=" rounded-t-xl rounded-b-md w-full text-sm text-gray-700 px-4 py-3 outline-none bg-gray-200/50 border-1 border-gray-300 "
                />

                {!isLoading && (
                  <ul className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal placeholder:text-[#00000080] text-[#000000a1]">
                    {filteredData?.map((item, index) => {
                      if (item.list_items[0].item_name) {
                        return (
                          <li
                            tabIndex={0}
                            key={index}
                            onClick={(e) => {
                              console.log(item.list_items);
                              setorderNumber(item.po_number);
                              setpurchaseOrderDetails(item);
                              setisDropdownOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                          >
                            {item.po_number}{" "}
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
              </div>
            )}

            {/* no data found  */}
            {(!purchaseOrderList || purchaseOrderList.length == 0) && (
              <>
                <p className=" text-base text-gray-600 font-medium">
                  No data found
                </p>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

const SalesIDInputField = ({ className }) => {
  const [salesId, setsalesId] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isCustomSalesId, setisCustomSalesId] = useState(true);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [query, setquery] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  const { getAllSales, AllSalesList, setsaleDetails } =
    useContext(SalesContext);
  const dropDownRef = useRef();
  const containerRef = useRef();

  const filteredData = useMemo(() => {
    if (!query) return AllSalesList;
    return (AllSalesList || []).filter((item) => {
      return item.sales_id.toLowerCase().includes(query);
    });
  }, [query, AllSalesList]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "salesId",
      value: salesId,
    });
  }, [salesId]);

  useEffect(() => {
    getAllSales(setisLoading);
  }, []);

  useEffect(() => {
    const handelClickOutside = (e) => {
      if (
        containerRef.current &&
        dropDownRef.current &&
        !containerRef.current.contains(e.target) &&
        !dropDownRef.current.contains(e.target)
      ) {
        setisDropdownOpen(false);
      }
    };

    window.addEventListener("pointerdown", handelClickOutside);

    return () => {
      window.removeEventListener("pointerdown", handelClickOutside);
    };
  }, [containerRef.current, dropDownRef.current]);
  console.log(AllSalesList);

  return (
    <>
      <div
        className={`flex flex-col overflow-y-visible relative w-full ${className}`}
      >
        <label className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1">
          Sales ID <span className=" text-red-600 ">*</span>
        </label>

        {/* radio buttons for switch saels id type  */}
        <div className="mb-3 mt-1 flex items-center gap-8">
          {/* radio button for custom input  */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="salesIdType"
              value={isCustomSalesId}
              checked={isCustomSalesId}
              onChange={(e) => {
                setsalesId("");
                setsaleDetails(null);
                setisCustomSalesId(true);
              }}
              className="sr-only"
            />
            {/* custom styled circle */}
            <div
              className={`w-4 h-4 rounded-full border-[2.5px] flex items-center justify-center ${
                isCustomSalesId ? "border-blue-800" : "border-gray-400"
              }`}
            >
              {isCustomSalesId && (
                <div className="w-2 h-2 bg-blue-800 rounded-full" />
              )}
            </div>
            <span className="text-sm font-medium capitalize">Custom</span>
          </label>

          {/* radio button for select dropdown input  */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name="salesIdType"
              value={isCustomSalesId}
              checked={!isCustomSalesId}
              onChange={(e) => setisCustomSalesId(false)}
              className="sr-only"
            />
            {/* custom styled circle */}
            <div
              className={`w-4 h-4 rounded-full border-[2.5px] flex items-center justify-center ${
                !isCustomSalesId ? "border-blue-800" : "border-gray-400"
              }`}
            >
              {!isCustomSalesId && (
                <div className="w-2 h-2 bg-blue-800 rounded-full" />
              )}
            </div>
            <span className="text-sm font-medium capitalize">Select</span>
          </label>
        </div>

        {isCustomSalesId && (
          <InputField
            value={salesId}
            setvalue={setsalesId}
            label={"Sales ID"}
            hasLabel={false}
            placeholder={"Enter Sales ID"}
          />
        )}

        {!isCustomSalesId && (
          <>
            {/* input area  */}
            <div
              ref={containerRef}
              className="rounded-xl border-[#0000001A] border-[1.5px] px-4
                py-3 flex items-center"
            >
              <input
                autoComplete
                required
                readOnly
                onClick={() => {
                  setisDropdownOpen(!isDropdownOpen);
                }}
                tabIndex={0}
                placeholder={"Select Sales ID"}
                value={salesId}
                className={`w-full relative items-center outline-none 2xl:text-lg xl:text-base 
                lg:text-sm text-xs font-normal placeholder:text-[#00000080]
                text-[#343434] cursor-default `}
              />
              <button
                aria-label="toggle drop down"
                className=" outline-none cursor-pointer"
                onClick={() => {
                  setisDropdownOpen(!isDropdownOpen);
                }}
              >
                <ChevronDown
                  className={`w-5 h-5 text-[#000000B2] transition-transform ${
                    isDropdownOpen ? "-rotate-180" : ""
                  } `}
                />
              </button>
            </div>

            {/* dropdown sales list  */}
            <div
              ref={dropDownRef}
              className={`absolute top-[105%] left-0 w-full ${
                isDropdownOpen
                  ? `  overflow-auto border-[1.5px]`
                  : "h-0 overflow-x-hidden border-0 "
              }
              bg-white z-5 rounded-xl border-[#0000001A]`}
              style={{ maxHeight: `250px` }}
            >
              {isLoading && (
                <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
                  <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
                </div>
              )}

              {/* search bar  */}
              <input
                value={query}
                onChange={(e) => {
                  setquery(e.target.value);
                }}
                type="text"
                placeholder="Search sales ID"
                className=" rounded-t-xl rounded-b-md w-full text-sm text-gray-700 px-4 py-3 outline-none bg-gray-200/50 border-1 border-gray-300 "
              />

              {!isLoading && (
                <ul className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal placeholder:text-[#00000080] text-[#000000a1]">
                  {filteredData?.map((item, index) => {
                    if (item.list_items[0].item_name) {
                      return (
                        <li
                          tabIndex={0}
                          key={index}
                          onClick={(e) => {
                            console.log(item.list_items);
                            setsalesId(item.sales_id);
                            setsaleDetails(item);
                            setisDropdownOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        >
                          {item.sales_id}{" "}
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const SubjectInputField = ({ className }) => {
  const [subject, setsubject] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceSubject",
      value: subject,
    });
  }, [subject]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={subject}
          setvalue={setsubject}
          label={"Subject"}
          placeholder={"Let your Customers know what this Invoice is for"}
        />
      </div>
    </>
  );
};

const InvoiceDateInputField = ({ className }) => {
  const [invoiceDate, setinvoiceDate] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceDate",
      value: invoiceDate.split("-").reverse().join("-"),
    });
  }, [invoiceDate]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={invoiceDate}
          setvalue={setinvoiceDate}
          label={"Invoice Date"}
          placeholder={"dd-mm-yyyy"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const TermsInputField = ({ className }) => {
  const [terms, setterms] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "terms",
      value: terms || "N/A",
    });
  }, [terms]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={terms}
          setvalue={setterms}
          label={"Terms"}
          placeholder={"Select terms"}
          hasCustom={true}
          hasDropDown={true}
          dropDownData={PaymentTermsDropDown}
        />
      </div>
    </>
  );
};

const DueDateInputField = ({ className }) => {
  const [dueDate, setdueDate] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceDueBy",
      value: dueDate.split("-").reverse().join("-"),
    });
  }, [dueDate]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={dueDate}
          setvalue={setdueDate}
          label={"Due Date"}
          placeholder={"dd-mm-yyyy"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const CustomerNameInputField = ({ className }) => {
  const [customer, setcustomer] = useState({});
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  const [isLoading, setisLoading] = useState(true);
  const { AllCustomersList, getAllCustomers } = useContext(CustomerContext);
  const navigate = useNavigate();

  // get all customer list
  useEffect(() => {
    getAllCustomers(setisLoading);
  }, []);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "customerId",
      value: customer.customer_id || "",
    });
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "gstNumber",
      value: customer.gst_number || "",
    });
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "contactNo",
      value: customer.contact_no || "",
    });

    createInvoiceDispatch({
      type: "UPDATE_BANK",
      field: "bank_account_receivers_name",
      value: customer.customer_name || "",
    });

    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "customerName",
      value: customer.customer_name || "",
    });
  }, [customer]);

  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={customer.customer_name}
          isLoading={isLoading}
          setvalue={setcustomer}
          label={"Customer name"}
          placeholder={"Select or add Customer"}
          hasDropDown={true}
          dropDownType="usersData"
          dropDownData={AllCustomersList || []}
          addnew={"customer"}
          onClickAddNew={() => {
            navigate("/customer/addCustomer/new");
          }}
        />
      </div>
    </>
  );
};

const UploadInvoice = () => {
  const [files, setfiles] = useState([]);
  const { createInvoiceDispatch, createInvoice, createInvoiceForm } =
    useContext(InvoiceContext);
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    if (!files || files.length == 0) {
      createInvoiceDispatch({
        type: "UPDATE_FIELD",
        field: "invoiceUrl",
        value: {
          invoice_url: "N/A",
        },
      });
      return;
    }
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceUrl",
      value: (files || []).map((item) => {
        return {
          fileBlob: item || "N/A",
          fileName: item.name || "N/A",
          invoice_url: item.related_doc_url || "N/A",
        };
      }),
    });
  }, [files]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "RESET",
    });
  }, []);

  return (
    <>
      <div className=" mb-6 outline-[#00000029] rounded-lg px-3 py-6 border-2 border-[#00000033] border-dashed">
        {files && files.length > 0 && (
          <div>
            <ShowUploadedFiles files={files} setfiles={setfiles} />
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

        {(!files || files.length == 0) && (
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

      {/* Action Buttons */}
      <div className="flex sm:flex-row flex-col sm:items-center gap-4">
        <button
          disabled={isLoading}
          onClick={(e) => {
            if (
              !createInvoiceForm.invoiceUrl ||
              createInvoiceForm.invoiceUrl.length == 0 ||
              !createInvoiceForm.invoiceUrl[0]?.fileBlob
            ) {
              showToast("Please select atleast one file", 1);
              return;
            }
            createInvoice(e, setisLoading, "upload");
          }}
          className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            "Create Invoice"
          )}
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setfiles([]);
          }}
          className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

const SubTotal = ({ className }) => {
  const { createInvoiceForm, createInvoiceDispatch } =
    useContext(InvoiceContext);
  const [subtotal, setsubtotal] = useState(
    Number(createInvoiceForm?.subtotalAmount).toFixed(2) || 0
  );
  const [isTdsEnable, setisTdsEnable] = useState(true);
  const [discount, setdiscount] = useState(0);
  const [isAdjustment, setisAdjustment] = useState(false);
  const [tds, settds] = useState({
    value: "0%",
    name: "N/A",
  });
  const [grandTotal, setgrandTotal] = useState(0.0);
  const [discountAmount, setdiscountAmount] = useState(0);
  const [taxableAmount, settaxableAmount] = useState(0);

  //amount to words
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "adjustmentAmount",
      value: isAdjustment,
    });
  }, [isAdjustment]);

  // calculate total when discount changes
  useEffect(() => {
    if (!tds.value) return;
    const tax = Number(tds.value.split("%")[0]);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [discount, tds, subtotal]);

  useEffect(() => {
    //calculate subtotal
    setsubtotal(
      createInvoiceForm?.listItems.reduce((acc, item) => {
        return acc + Number(item.gross_amount || 0);
      }, 0)
    );
  }, [createInvoiceForm]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "discountAmount",
      value: discount,
    });
    setdiscountAmount(((subtotal * discount) / 100).toFixed(2));
  }, [discount, discount]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "subtotalAmount",
      value: subtotal,
    });
    if (!tds) return;
    const tax = Number(tds.value.split("%")[0]);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [subtotal, discount, tds]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "totalAmount",
      value: isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal,
    });
  }, [grandTotal, isAdjustment]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "tdsAmount",
      value: tds.value,
    });
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "tds_reason",
      value: tds.name,
    });
    const tax = Number(tds.value.split("%")[0]);
    settaxableAmount(((subtotal * (100 - discount) * tax) / 10000).toFixed(2));
  }, [tds, discount, subtotal]);

  return (
    <>
      <div
        className={`bg-[#EBEFF3] xl:p-6 md:p-4 p-3 rounded-xl border-t-6 border-t-[#2543B1] ${className}`}
        style={{ boxShadow: "0px 4px 10px 0px #00000033" }}
      >
        {/* Subtotal */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base text-sm ">
          <span className="font-medium ">Sub Total</span>
          <span className="">{subtotal}</span>
        </div>

        {/* Discount */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base text-sm">
          <span htmlFor="discount" className=" font-normal ">
            Discount
          </span>
          <div className="px-3 py-2 w-fit rounded-lg border-[1px] ml-auto border-[#D2D2D2]">
            <input
              id="discount"
              type="number"
              placeholder={0}
              value={discount}
              onChange={(e) => {
                setdiscount(e.target.value);
              }}
              className=" outline-none md:max-w-[100px] max-w-[50px] text-sm placeholder:text-[#8E8E8E] text-[#414141] "
            />
          </div>
          <span>&nbsp; %</span>
          <span className="text-gray-800 ml-auto">-{discountAmount}</span>
        </div>

        {/* Tax Type + Dropdown */}
        <div className="flex items-center justify-between text-[#4A4A4A] gap-3 mb-4">
          {/* Radio buttons */}
          <div className=" flex items-center gap-2 cursor-pointer">
            <label
              htmlFor="toggle tds"
              className=" md:text-sm text-xs font-medium flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A]"
            >
              <div
                className={` border-4 w-3.5 2xl:w-5 h-3.5 2xl:h-5 rounded-full transition ${
                  isTdsEnable ? "border-[#2543B1]" : "border-[#777777]"
                }`}
              />
              TDS
            </label>
            <input
              id="toggle tds"
              type="checkbox"
              value={isTdsEnable}
              onChange={() => {
                setisTdsEnable(!isTdsEnable);
              }}
              className=" cursor-pointer hidden"
            />
          </div>

          {/* Tax Dropdown */}
          <TaxDropdown
            value={tds.value}
            setvalue={settds}
            isDisabled={!isTdsEnable}
          />

          {/* Negative Tax Value */}
          <div className="text-gray-500 text-sm w-12 text-right">
            +{taxableAmount}
          </div>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Total */}
        <div className="flex justify-between  items-center 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm font-medium text-[#333333]">
          <div className=" flex items-center gap-4">
            <span>Total</span>
            <div className=" flex items-center gap-2 cursor-pointer">
              <label
                htmlFor="toggle adjustment"
                className=" text-sm font-medium flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A]"
              >
                <div
                  className={` border-4 w-3.5 2xl:w-5 h-3.5 2xl:h-5 rounded-full transition ${
                    isAdjustment ? "border-[#2543B1]" : "border-[#777777]"
                  }`}
                />
                Adjustment
              </label>
              <input
                id="toggle adjustment"
                type="checkbox"
                value={isAdjustment}
                onChange={() => {
                  setisAdjustment(!isAdjustment);
                }}
                className=" cursor-pointer hidden"
              />
            </div>
          </div>
          <span>
            {isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal}
          </span>
        </div>
        <p className=" text-end font-medium 2xl:text-xl xl:text-lg lg:text-base text-xs text-[#606060] ">
          {toWords.convert(
            Number(isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal)
          )}{" "}
          Only
        </p>
      </div>
    </>
  );
};

const TaxDropdown = ({ value, setvalue, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(-1);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (ind) => {
    setSelectedOption(ind);
    setvalue(TDSDropDown[ind]);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative mx-auto w-full max-w-[200px] ${
        isDisabled ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          className={`w-full px-2 py-2 ${
            isDisabled ? "bg-gray-500/30" : "bg-white"
          } cursor-pointer border rounded-md lg:text-sm text-xs text-gray-700 flex items-center justify-between border-gray-400`}
          whileHover={{
            borderColor: "#9CA3AF",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
          }}
          onClick={toggleDropdown}
        >
          {selectedOption >= 0
            ? TDSDropDown[selectedOption].value
            : value
            ? value
            : "Select an option"}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="text-gray-500 w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className="absolute left-1/2 -translate-x-1/2 z-10 w-full max-h-[200px] overflow-auto mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {(TDSDropDown || []).map((option, ind) => (
                <motion.li
                  key={ind}
                  className={`px-4 py-2 cursor-pointer text-sm text-gray-700 ${
                    selectedOption === ind ? "bg-[#e8e8e8]" : "bg-white"
                  } hover:bg-[#F3F4F6] cursor-pointer`}
                  onClick={() => handleOptionClick(ind)}
                >
                  {option.name}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
