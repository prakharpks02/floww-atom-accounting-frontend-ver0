import { useState, useEffect, useRef, useContext, useCallback } from "react";
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
  X,
  Loader2,
} from "lucide-react";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  customersDropDown,
  PaymentTermsDropDown,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { PurchaseOrderContext } from "../../context/purchaseOrder/PurchaseOrderContext";
import { CompanyContext } from "../../context/company/CompanyContext";
import { AnimatePresence, motion } from "framer-motion";
import { ToWords } from "to-words";
import { useNavigate, useParams } from "react-router-dom";
import { VendorContext } from "../../context/vendor/VendorContext";
import { CustomerContext } from "../../context/customer/customerContext";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

export const CreatePurchaseOrder = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { purchaseOrderDetails, getPurchaseOrderDetails } =
    useContext(PurchaseOrderContext);
  const { purchaseorderid } = useParams();
  const [isDataFechting, setisDataFechting] = useState(true);

  useEffect(() => {
    getPurchaseOrderDetails(purchaseorderid, setisDataFechting);
  }, []);
  return (
    <>
      <ToastContainer />
      {isDataFechting && (
        <div className=" flex-1 flex justify-center items-center py-10 px-4 min-h-[300px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}
      {!isDataFechting && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
          {/* Header */}
          <div className="mb-6">
            <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl font-semibold text-[#4A4A4A]">
              Create Purchase Order List
            </h1>
            <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
              Generate a new purchase order list
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
          {activeTab === "create" && (
            <PurchaseOrderForm purchaseOrderDetails={purchaseOrderDetails} />
          )}
          {activeTab === "upload" && (
            <UploadPurchaseOrder purchaseOrderDetails={purchaseOrderDetails} />
          )}
        </div>
      )}
    </>
  );
};

const PurchaseOrderForm = ({ purchaseOrderDetails }) => {
  const [isLoading, setisLoading] = useState(false);
  const {
    createPurchaseOrder,
    createPurchaseOrderForm,
    updatePurchaseOrder,
    createPurchaseOrderFormDispatch,
  } = useContext(PurchaseOrderContext);
  const { purchaseorderid } = useParams();
  const { companyDetails } = useContext(CompanyContext);

  const wrapAndDrawText = useCallback(
    (page, text, x, yStart, maxWidth, fontSize, fontObj) => {
      const lines = [];
      const words = text?.split(" ") || [];
      let line = "";
      for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = fontObj.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth) {
          lines.push(line.trim());
          line = word + " ";
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line.trim());

      lines.forEach((lineText, idx) => {
        page.drawText(lineText, {
          x,
          y: yStart - idx * (fontSize + 2),
          size: fontSize,
          font: fontObj,
          color: rgb(0, 0, 0),
        });
      });
      return lines.length;
    },
    []
  );

  //download invoice
  const downloadPDF = useCallback(
    async (setisLoading) => {
      try {
        setisLoading(true);
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const drawText = (text, x, y, size = 10, isBold = false) => {
          page.drawText(text, {
            x,
            y,
            size,
            font: isBold ? boldFont : font,
            color: rgb(0, 0, 0),
          });
        };

        let y = 800;
        drawText("Purchase Order", 230, y, 18, true);

        // Labels
        y -= 30;
        drawText("From:", 40, y, 11, true);
        drawText("Bill To:", 320, y, 11, true);

        // Addresses
        y -= 15;
        const fromText = `${companyDetails?.company_name ?? ""}, ${
          companyDetails?.company_address ?? ""
        }`;
        const billToText = `${createPurchaseOrderForm?.deliveryAddress ?? ""}`;

        const leftLineCount = wrapAndDrawText(
          page,
          fromText,
          40,
          y,
          250,
          10,
          font
        );
        const rightLineCount = wrapAndDrawText(
          page,
          billToText,
          320,
          y,
          230,
          10,
          font
        );

        y -= Math.max(leftLineCount, rightLineCount) * 12;

        // Dates and GST
        y -= 10;
        drawText(`From: ${createPurchaseOrderForm?.poDate}`, 40, y, 11, true);
        drawText(
          `Delivery Date: ${createPurchaseOrderForm?.deliveryDate}`,
          320,
          y,
          11,
          true
        );

        y -= 20;
        drawText(
          `Phone: +91${createPurchaseOrderForm?.contactNo}`,
          40,
          y,
          11,
          true
        );
        drawText(
          `GST: ${createPurchaseOrderForm?.gstNumber}`,
          320,
          y,
          11,
          true
        );

        // Table headers
        y -= 35;
        const headers = [
          "Description",
          "Rate",
          "Qty",
          "Disc%",
          "GST%",
          "Amount",
        ];
        const colX = [40, 220, 270, 310, 360, 420];
        headers.forEach((text, i) => drawText(text, colX[i], y, 10, true));

        y -= 10;
        page.drawLine({
          start: { x: 40, y },
          end: { x: 550, y },
          thickness: 0.8,
          color: rgb(0.8, 0.8, 0.8),
        });

        // Table items
        const items = createPurchaseOrderForm?.listItems || [];
        y -= 20;
        items.forEach((item) => {
          drawText(item.item_description, colX[0], y);
          drawText(item.base_amount, colX[1], y);
          drawText(String(item.quantity), colX[2], y);
          drawText(`${item.discount}%`, colX[3], y);
          drawText(`${item.gst_amount}%`, colX[4], y);
          drawText(
            `${Number(item.gross_amount).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            colX[5],
            y
          );
          y -= 20;
        });

        // Line after items
        page.drawLine({
          start: { x: 40, y: y + 10 },
          end: { x: 550, y: y + 10 },
          thickness: 1,
          color: rgb(0.7, 0.7, 0.7),
        });

        // Totals
        y -= 10;
        drawText("Subtotal:", 40, y, 11, true);
        drawText(`Rs.${createPurchaseOrderForm?.subTotalAmount}`, 420, y);

        y -= 20;
        drawText(
          `Tax(${createPurchaseOrderForm?.tdsAmount}):`,
          40,
          y,
          11,
          true
        );
        drawText(
          `+Rs.${Number(
            ((Number(createPurchaseOrderForm?.subTotalAmount) || 0) *
              (100 - Number(createPurchaseOrderForm?.discountAmount)) *
              (Number(createPurchaseOrderForm?.tdsAmount?.split("%")[0]) ||
                0)) /
              10000
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 20;
        drawText(
          `Discount(${createPurchaseOrderForm?.discountAmount}%):`,
          40,
          y,
          11,
          true
        );
        drawText(
          `-Rs.${Number(
            ((createPurchaseOrderForm?.subTotalAmount || 0) *
              (createPurchaseOrderForm?.discountAmount || 0)) /
              100
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 25;
        drawText("Total:", 40, y, 12, true);
        drawText(
          `Rs.${createPurchaseOrderForm?.totalAmount}`,
          420,
          y,
          12,
          true
        );

        page.drawLine({
          start: { x: 40, y: y - 10 },
          end: { x: 550, y: y - 10 },
          thickness: 1,
          color: rgb(0.7, 0.7, 0.7),
        });

        // Notes and T&C
        y -= 40;
        drawText(
          `Customer note: ${createPurchaseOrderForm?.notes ?? ""}`,
          40,
          y
        );
        y -= 20;
        drawText(
          `Terms & Conditions: ${
            createPurchaseOrderForm?.listToc?.[0]?.terms_of_service ?? ""
          }`,
          40,
          y
        );

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "Purchase order.pdf");
      } catch (error) {
        console.log(error);
        showToast(error.message || "Download pdf failed", 1);
      } finally {
        setisLoading(false);
      }
    },
    [createPurchaseOrderForm, companyDetails]
  );

  return (
    <>
      <div className=" grid lg:grid-cols-2 grid-cols-1 space-x-2 space-y-2">
        <PurchaseOrderLeftPart purchaseOrderDetails={purchaseOrderDetails} />
        <PurchaseOrderRightPart handelDownloadInvoice={downloadPDF} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          disabled={isLoading}
          onClick={async (e) => {
            try {
              if (purchaseorderid?.toLowerCase() === "new")
                await createPurchaseOrder(e, setisLoading);
              if (purchaseorderid?.toLowerCase() !== "new")
                await updatePurchaseOrder(purchaseorderid, setisLoading);

              await downloadPDF(setisLoading);
              createPurchaseOrderFormDispatch({
                type: "RESET",
              });
            } catch (error) {
              console.log(error);
            }
          }}
          className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            <>
              {purchaseorderid?.toLowerCase() !== "new" ? "Update" : "Create"}{" "}
              Purchase
              <Plus className=" ml-2 w-5 h-5 text-white inline-block" />
            </>
          )}
        </button>
        <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </>
  );
};

const PurchaseOrderLeftPart = ({ purchaseOrderDetails }) => {
  return (
    <>
      <div className=" 2xl:p-8 xl:p-6 p-4 2xl:rounded-2xl xl:rounded-xl rounded-lg border-[1.5px] border-[#E8E8E8] ">
        <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg font-semibold text-[#4A4A4A] mb-5">
          Purchase Order Details
        </h1>
        {/* PurchaseOrder info */}
        <div className=" grid grid-cols-2 gap-x-3 space-y-4 mb-4">
          <VendorNameInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <DeliveryAddressInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <DateInputField
            className={" col-span-1"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <DeliveryDateInputField
            className={" col-span-1"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <PaymentTermsInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <ShipmentPreferenceInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          {/* <PurchaseOrderNoInputField
            className={" col-span-1"}
            purchaseOrderDetails={purchaseOrderDetails}
          /> */}
          <ReferenceInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
          <SubjectInputField
            className={" col-span-2"}
            purchaseOrderDetails={purchaseOrderDetails}
          />
        </div>
        {/* Item Table */}
        <ItemDetails purchaseOrderDetails={purchaseOrderDetails} />

        {/* Totals Section */}
        <SubTotal
          className={"mb-6 "}
          purchaseOrderDetails={purchaseOrderDetails}
        />

        {/* Customer Note */}
        <CustomerNotes purchaseOrderDetails={purchaseOrderDetails} />

        {/* Terms and Conditions */}
        <TermsAndConditions purchaseOrderDetails={purchaseOrderDetails} />
      </div>
    </>
  );
};

const CustomerNotes = ({ className, purchaseOrderDetails }) => {
  const [notes, setnotes] = useState(purchaseOrderDetails?.notes || "");
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "notes",
      value: notes,
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
        <p className="2xl:text-base xl:text-sm md:text-xs font-medium text-[#777777]">
          Will be displayed on the invoice
        </p>
      </div>
    </>
  );
};

const TermsAndConditions = ({ className, purchaseOrderDetails }) => {
  const [toc, settoc] = useState(
    purchaseOrderDetails?.list_toc[0]?.terms_of_service || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "listToc",
      value: [{ terms_of_service: toc }],
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

const ItemDetails = ({ className, purchaseOrderDetails }) => {
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
    purchaseOrderDetails?.list_items || [blankItem]
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  // changes fields for particular item row
  const handleChange = (index, field, value) => {
    // Dispatch to reducer to update the item field
    createPurchaseOrderFormDispatch({
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

      //update gross amount on create purchase form
      createPurchaseOrderFormDispatch({
        type: "UPDATE_ITEM_FIELD",
        index,
        field: "gross_amount",
        value: temp[index].gross_amount,
      });
      setItems(temp);
    }
  };

  // add new row , also add the row to purchase reducer
  const addRow = () => {
    setItems([...items, blankItem]);
    createPurchaseOrderFormDispatch({
      type: "ADD_ITEM",
      item: blankItem,
    });
  };

  // remove a existing row , also remove the row to purchase reducer
  const removeRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    createPurchaseOrderFormDispatch({
      type: "REMOVE_ITEM",
      index,
    });
  };

  // reset state value when no purchase data
  useEffect(() => {
    if (!purchaseOrderDetails) setItems([blankItem]);
  }, [purchaseOrderDetails]);

  //first set all item details to create purchase form
  useEffect(() => {
    if (purchaseOrderDetails?.list_items) {
      createPurchaseOrderFormDispatch({
        type: "UPDATE_FIELD",
        field: "listItems",
        value: purchaseOrderDetails?.list_items,
      });
    }
  }, []);

  return (
    <>
      <div className={`mb-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Item Table</h3>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={index} className=" space-y-3 mb-8">
              <div className=" grid grid-cols-5 gap-3">
                <div className=" overflow-x-hidden col-span-3">
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
                </div>
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
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
              <div className=" grid grid-cols-3 gap-3">
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
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
                <div className=" overflow-x-hidden col-span-1">
                  <InputField
                    autoComplete="off"
                    padding={2}
                    readOnly={true}
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

const PurchaseOrderRightPart = ({
  className,
  handelDownloadInvoice = () => {},
}) => {
  const { createPurchaseOrderForm } = useContext(PurchaseOrderContext);
  const { companyDetails } = useContext(CompanyContext);
  const [taxAmount, settaxAmount] = useState("");
  const [discount, setdiscount] = useState("");
  const [isDownloading, setisDownloading] = useState(false);

  useEffect(() => {
    const tax = Number(createPurchaseOrderForm?.tdsAmount?.split("%")[0]) || 0;
    settaxAmount(
      Number(
        ((Number(createPurchaseOrderForm?.subTotalAmount) || 0) *
          (100 - Number(createPurchaseOrderForm?.discountAmount)) *
          tax) /
          10000
      ).toFixed(2)
    );
  }, [
    createPurchaseOrderForm?.tdsAmount,
    createPurchaseOrderForm?.subTotalAmount,
    createPurchaseOrderForm?.discountAmount,
  ]);

  useEffect(() => {
    setdiscount(
      Number(
        ((createPurchaseOrderForm?.subTotalAmount || 0) *
          (createPurchaseOrderForm?.discountAmount || 0)) /
          100
      ).toFixed(2)
    );
  }, [
    createPurchaseOrderForm?.discountAmount,
    createPurchaseOrderForm?.subTotalAmount,
  ]);

  // console.log(createPurchaseOrderForm);

  return (
    <>
      <div className="py-6 px-4 2xl:rounded-2xl xl:rounded-xl h-fit rounded-lg border-[1.5px] border-[#E8E8E8]">
        {/* header  */}
        <div className="flex gap-3 items-center justify-between mb-10">
          <h1 className=" max-w-1/2 xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#4A4A4A]">
            Purchase Order Review
          </h1>
          <button
            disabled={isDownloading}
            onClick={async (e) => {
              e.preventDefault();
              handelDownloadInvoice(setisDownloading);
            }}
            className="flex whitespace-nowrap items-center gap-2 bg-[#2543B1] text-white px-4 py-3 rounded-xl text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium hover:bg-[#1b34a3] transition"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <div className="2xl:p-8 xl:p-6 p-4 rounded-xl border-2 border-[#E8E8E8] ">
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-center font-semibold text-[#4A4A4A]">
            Purchase Order
          </h2>
          {/* <h3 className="2xl:text-xl xl:text-lg lg:text-base text-sm text-center font-medium text-[#777777] mb-2">
            INV-1749026747109
          </h3> */}

          <div className="my-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {companyDetails.company_name} ,
                  {companyDetails.company_address}
                </p>
              </div>

              <div>
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] mb-1">
                  Bill To:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createPurchaseOrderForm?.deliveryAddress}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  From:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createPurchaseOrderForm?.poDate}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  Delivery Date:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createPurchaseOrderForm?.deliveryDate}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  Phone:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createPurchaseOrderForm?.contactNo &&
                    `+91 ${createPurchaseOrderForm?.contactNo}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  GST:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {createPurchaseOrderForm?.gstNumber}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y gap-4 divide-[#E8E8E8]">
                <thead className="">
                  <tr className=" text-[#4A4A4A]  2xl:text-lg xl:text-base lg:text-sm">
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
                  {createPurchaseOrderForm?.listItems.map((item, ind) => (
                    <tr
                      key={ind}
                      className=" text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm"
                    >
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.item_name}
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.base_amount}
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.quantity}
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.discount && `${item?.discount}%`}
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.gst_amount && `${item?.gst_amount}%`}
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
                ₹
                {Number(
                  createPurchaseOrderForm?.subTotalAmount || 0.0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Tax({createPurchaseOrderForm?.tdsAmount}):
              </span>
              <span className="text-[#4A4A4A] font-medium">
                +₹{taxAmount || 0.0}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Discount({createPurchaseOrderForm?.discountAmount || 0}%):
              </span>
              <span className="text-[#4A4A4A] font-medium">-₹{discount}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#bababa] mt-2">
              <span className="font-medium text-gray-800">Total</span>
              <span className="font-medium text-gray-800">
                ₹{createPurchaseOrderForm?.totalAmount}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-gray-800 text-sm">
            {/* Customer Note */}
            <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm">
              Customer note:{" "}
              <span className="text-[#4A4A4A]">
                {createPurchaseOrderForm?.notes}
              </span>
            </p>

            {/* Terms */}
            <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm  mb-4">
              Terms & Conditions:{" "}
              <span className="text-[#4A4A4A]">
                {createPurchaseOrderForm?.listToc[0]?.terms_of_service}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const DeliveryAddressInputField = ({ className, purchaseOrderDetails }) => {
  const [selectedType, setSelectedType] = useState("organization");
  const [address, setAddress] = useState(
    purchaseOrderDetails?.delivery_address || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "deliveryAddress",
      value: address,
    });
  }, [address]);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "deliveryTerms",
      value: selectedType,
    });
  }, [selectedType]);

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

      {/* organization Address input */}
      {selectedType === "organization" && (
        <InputField
          value={address}
          setvalue={setAddress}
          hasLabel={false}
          placeholder={"Enter address"}
          label={""}
        />
      )}

      {/* customer input */}
      {selectedType === "customer" && (
        <CustomerNameInputField value={address} setvalue={setAddress} />
      )}
    </div>
  );
};

const PurchaseOrderNoInputField = ({ className, purchaseOrderDetails }) => {
  const [orderNo, setorderNo] = useState(purchaseOrderDetails?.po_number || "");
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "poNumber",
      value: orderNo,
    });
  }, [orderNo]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={orderNo}
          setvalue={setorderNo}
          label={"Purchase Order#"}
          placeholder={"QT00001"}
        />
      </div>
    </>
  );
};

const ReferenceInputField = ({ className, purchaseOrderDetails }) => {
  const [referenceNo, setreferenceNo] = useState(
    purchaseOrderDetails?.reference || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "reference",
      value: referenceNo,
    });
  }, [referenceNo]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={referenceNo}
          setvalue={setreferenceNo}
          label={"Reference#"}
          placeholder={""}
        />
      </div>
    </>
  );
};

const SubjectInputField = ({ className, purchaseOrderDetails }) => {
  const [subject, setsubject] = useState(purchaseOrderDetails?.subject || "");
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "subject",
      value: subject,
    });
  }, [subject]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={subject}
          setvalue={setsubject}
          label={"Subject"}
          placeholder={
            "Let your customers know what this purchase order is for"
          }
        />
      </div>
    </>
  );
};

const DateInputField = ({ className, purchaseOrderDetails }) => {
  const [date, setdate] = useState(
    purchaseOrderDetails?.po_date.split("-").reverse().join("-") || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "poDate",
      value: date?.split("-").reverse().join("-"),
    });
  }, [date]);
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

const ShipmentPreferenceInputField = ({ className, purchaseOrderDetails }) => {
  const [preferece, setpreferece] = useState(
    purchaseOrderDetails?.shipment_preference || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "shipmentPreference",
      value: preferece,
    });
  }, [preferece]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={preferece}
          setvalue={setpreferece}
          isTextArea={true}
          minHeight={100}
          label={"Shipment Preference"}
          placeholder={"Type shipment preference"}
        />
      </div>
    </>
  );
};

const PaymentTermsInputField = ({ className, purchaseOrderDetails }) => {
  const [term, setterm] = useState(purchaseOrderDetails?.payment_terms || "");
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "paymentTerms",
      value: term,
    });
  }, [term]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={term}
          setvalue={setterm}
          label={"Payment Terms"}
          placeholder={"Select a option"}
          hasDropDown={true}
          dropDownData={PaymentTermsDropDown}
          hasCustom={true}
        />
      </div>
    </>
  );
};

const DeliveryDateInputField = ({ className, purchaseOrderDetails }) => {
  const [date, setdate] = useState(
    purchaseOrderDetails?.delivery_date?.split("-").reverse().join("-") || ""
  );
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "deliveryDate",
      value: date?.split("-").reverse().join("-"),
    });
  }, [date]);
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

const VendorNameInputField = ({ className, purchaseOrderDetails }) => {
  const [vendor, setvendor] = useState({
    vendor_id: purchaseOrderDetails?.vendor_id || "",
    vendor_name: purchaseOrderDetails?.vendor_name || "",
    email: purchaseOrderDetails?.email || "",
    gst_number: purchaseOrderDetails?.gst_number || "",
    contact_no: purchaseOrderDetails?.contact_no || "",
  });
  const { createPurchaseOrderFormDispatch } = useContext(PurchaseOrderContext);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { AllVendorList, getAllVendors } = useContext(VendorContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "vendorId",
      value: vendor?.vendor_id || "",
    });
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "vendorName",
      value: vendor?.vendor_name || "",
    });
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "email",
      value: vendor?.email || "",
    });
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "gstNumber",
      value: vendor?.gst_number || "",
    });
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "contactNo",
      value: vendor?.contact_no || "",
    });
  }, [vendor]);

  // get all customer list
  useEffect(() => {
    getAllVendors(setisLoading);
  }, []);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={vendor.vendor_name}
          setvalue={setvendor}
          isLoading={isLoading}
          readOnly={true}
          label={"Vendor Name"}
          placeholder={"Select or add vendor"}
          hasDropDown={true}
          dropDownType="usersData"
          dropDownData={AllVendorList || []}
          addnew={"vendor"}
          onClickAddNew={() => {
            navigate("/vendor/addVendors/new");
          }}
        />
      </div>
    </>
  );
};

const CustomerNameInputField = ({ className, value, setvalue }) => {
  const [customer, setcustomer] = useState({});
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { AllCustomersList, getAllCustomers } = useContext(CustomerContext);

  useEffect(() => {
    setvalue(customer?.address);
  }, [customer]);

  // get all customer list
  useEffect(() => {
    getAllCustomers(setisLoading);
  }, []);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={customer.customer_name}
          setvalue={setcustomer}
          isLoading={isLoading}
          readOnly={true}
          hasLabel={false}
          label={""}
          placeholder={"Select or add customer"}
          hasDropDown={true}
          dropDownType="usersData"
          dropDownData={AllCustomersList || []}
          addnew={"vendor"}
          onClickAddNew={() => {
            navigate("/vendor/addVendors/new");
          }}
        />
      </div>
    </>
  );
};

const UploadPurchaseOrder = ({ purchaseOrderDetails }) => {
  const [files, setfiles] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const {
    createPurchaseOrderFormDispatch,
    createPurchaseOrder,
    createPurchaseOrderForm,
  } = useContext(PurchaseOrderContext);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "poUrl",
      value: (files || []).map((item) => {
        return {
          invoice_url: item.name,
        };
      }),
    });
  }, [files]);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "RESET",
    });
  }, []);

  return (
    <>
      <div className="mb-4 outline-[#00000029] rounded-lg px-3 py-6 border-2 border-[#00000033] border-dashed">
        {files && files.length > 0 && (
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
            setfiles((prev) => [...prev, ...validFiles]);

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
              !createPurchaseOrderForm.poUrl ||
              createPurchaseOrderForm.poUrl.length == 0 ||
              createPurchaseOrderForm.poUrl[0]?.invoice_url == "N/A"
            ) {
              showToast("Please select atleast one file", 1);
              return;
            }
            createPurchaseOrder(e, setisLoading);
          }}
          className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer bg-[#2543B1] border-2 border-[#3333331A] text-white hover:bg-[#252eb1]"
        >
          {isLoading ? (
            <Loader2 className=" animate-spin w-5 h-5 text-white" />
          ) : (
            "Create purchase order"
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

const SubTotal = ({ className, purchaseOrderDetails }) => {
  const { createPurchaseOrderFormDispatch, createPurchaseOrderForm } =
    useContext(PurchaseOrderContext);
  const [subtotal, setsubtotal] = useState(
    createPurchaseOrderForm?.subTotalAmount || 0
  );
  const [discount, setdiscount] = useState(
    purchaseOrderDetails?.discount_amount || 0
  );
  const [isAdjustment, setisAdjustment] = useState(
    purchaseOrderDetails?.adjustment_amount?.toString().toLowerCase() === "true"
      ? true
      : false
  );
  const [tds, settds] = useState({
    value: purchaseOrderDetails?.tds_amount || "",
    name: purchaseOrderDetails?.tds_reason || "",
  });
  const [grandTotal, setgrandTotal] = useState(
    purchaseOrderDetails?.total_amount || 0.0
  );
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
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "adjustmentAmount",
      value: isAdjustment,
    });
  }, [isAdjustment]);

  // calculate total when discount and tax changes
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
      createPurchaseOrderForm?.listItems.reduce((acc, item) => {
        return acc + parseFloat(item.gross_amount || 0);
      }, 0) || 0
    );
  }, [createPurchaseOrderForm]);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "discountAmount",
      value: discount,
    });
    setdiscountAmount(((subtotal * discount) / 100).toFixed(2));
  }, [discount, subtotal]);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "subTotalAmount",
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
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "totalAmount",
      value: grandTotal,
    });
  }, [grandTotal]);

  useEffect(() => {
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsAmount",
      value: tds.value,
    });
    createPurchaseOrderFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsReason",
      value: tds.name,
    });
    const tax = Number(tds.value.split("%")[0]);
    settaxableAmount(((subtotal * (100 - discount) * tax) / 10000).toFixed(2));
  }, [tds, discount, subtotal]);

  return (
    <>
      <div
        className={`bg-[#EBEFF3] xl:p-6 md:p-4 rounded-xl border-t-6 border-t-[#2543B1] ${className}`}
        style={{ boxShadow: "0px 4px 10px 0px #00000033" }}
      >
        {/* Subtotal */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base md:text-sm">
          <span className="font-medium ">Sub Total</span>
          <span className="">{subtotal}</span>
        </div>

        {/* Discount */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base md:text-sm">
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
              className=" outline-none max-w-[100px] text-sm placeholder:text-[#8E8E8E] text-[#414141] "
            />
          </div>
          <span>&nbsp; %</span>
          <span className="text-gray-800 ml-auto">-{discountAmount}</span>
        </div>

        {/* Tax Type + Dropdown */}
        <div className="flex items-center justify-between text-[#4A4A4A] gap-3 mb-4">
          {/* Radio buttons */}
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="taxType"
                defaultChecked={true}
                className="accent-[#2543B1]"
              />
              <span className="text-sm font-medium">TDS</span>
            </label>
          </div>

          {/* Tax Dropdown */}
          <TaxDropdown value={tds.value} setvalue={settds} />

          {/* Negative Tax Value */}
          <div className="text-gray-500 text-sm w-12 text-right">
            +{taxableAmount}
          </div>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Total */}
        <div className="flex justify-between  items-center 2xl:text-2xl xl:text-xl lg:text-lg md:text-base font-medium text-[#333333]">
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
          <span>{grandTotal}</span>
        </div>
        <p className=" text-end font-medium 2xl:text-xl xl:text-lg lg:text-base text-xs text-[#606060] ">
          {toWords.convert(Number(grandTotal))} Only
        </p>
      </div>
    </>
  );
};

const TaxDropdown = ({ value, setvalue }) => {
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
    <div ref={dropdownRef} className="relative mx-auto w-full max-w-[200px]">
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          className={`w-full px-2 py-2 cursor-pointer bg-white border rounded-md lg:text-sm text-xs text-gray-700 flex items-center justify-between border-gray-400`}
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
