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
  Loader2,
  X,
} from "lucide-react";
// import { UploadQuotation } from "./UploadQuotation";
import { InputField } from "../../utils/ui/InputField";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  customersDropDown,
  PaymentTermsDropDown,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { QuotationContext } from "../../context/quotation/QuotationContext";
import { ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { CompanyContext } from "../../context/company/CompanyContext";
import { showToast } from "../../utils/showToast";
import { CustomerContext } from "../../context/customer/customerContext";
import { AnimatePresence, motion } from "framer-motion";
import { ToWords } from "to-words";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

export const CreateQuotation = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { getQuotationDetails, quotationDetails } =
    useContext(QuotationContext);
  const [isDataFechting, setisDataFechting] = useState(true);
  const { quotationid } = useParams();

  useEffect(() => {
    getQuotationDetails(quotationid, setisDataFechting);
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
            <h2 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl font-semibold text-[#4A4A4A]">
              Create Quotation
            </h2>
            <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
              Prepare a new quotation for your customer
            </p>
          </div>

          {/* Tabs */}
          {/* {quotationid == "new" && (
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
                Create new Quotation
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
                Upload new Quotation
              </button>
            </div>
          )} */}

          {/* main content */}
          {activeTab === "create" && (
            <QuotationForm quotationDetails={quotationDetails} />
          )}
          {quotationid == "new" && activeTab === "upload" && (
            <UploadQuotation quotationDetails={quotationDetails} />
          )}
        </div>
      )}
    </>
  );
};

const QuotationForm = ({ quotationDetails }) => {
  const {
    createQuotation,
    updateQuotation,
    createQuotationForm,
    createQuotationFormDispatch,
  } = useContext(QuotationContext);
  const [isLoading, setisLoading] = useState(false);
  const { quotationid } = useParams();
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
        drawText("QUOTATION ORDER", 230, y, 18, true);

        // Labels
        y -= 30;
        drawText("From:", 40, y, 11, true);
        drawText("Bill To:", 320, y, 11, true);

        // Addresses
        y -= 15;
        const fromText = `${companyDetails?.company_name ?? ""}, ${
          companyDetails?.company_address ?? ""
        }`;
        const billToText = `${createQuotationForm?.customerName ?? ""}`;

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

        //phone and gst
        y -= 20;
        drawText(
          `Phone: +91${createQuotationForm?.contactNo}`,
          40,
          y,
          11,
          true
        );
        drawText(`GST: ${companyDetails?.company_GSTIN}`, 320, y, 11, true);

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
        const items = createQuotationForm?.listItems || [];
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
        drawText(`Rs.${createQuotationForm?.subtotalAmount}`, 420, y);

        y -= 20;
        drawText(`Tax(${createQuotationForm?.tdsAmount}):`, 40, y, 11, true);
        drawText(
          `+Rs.${Number(
            ((Number(createQuotationForm?.subtotalAmount) || 0) *
              (100 - Number(createQuotationForm?.discountAmount)) *
              (Number(createQuotationForm?.tdsAmount?.split("%")[0]) || 0)) /
              10000
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 20;
        drawText(
          `Discount(${createQuotationForm?.discountAmount})%:`,
          40,
          y,
          11,
          true
        );
        drawText(
          `-Rs.${Number(
            ((createQuotationForm?.subtotalAmount || 0) *
              (createQuotationForm?.discountAmount || 0)) /
              100
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 25;
        drawText("Total:", 40, y, 12, true);
        drawText(`Rs.${createQuotationForm?.totalAmount}`, 420, y, 12, true);

        page.drawLine({
          start: { x: 40, y: y - 10 },
          end: { x: 550, y: y - 10 },
          thickness: 1,
          color: rgb(0.7, 0.7, 0.7),
        });

        // Notes and T&C
        y -= 20;
        drawText(
          `Terms & Conditions: ${
            createQuotationForm?.listToc?.[0]?.terms_of_service ?? ""
          }`,
          40,
          y
        );

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "quotation.pdf");
      } catch (error) {
        console.log(error);
        showToast(error.message || "Download pdf failed", 1);
      } finally {
        setisLoading(false);
      }
    },
    [createQuotationForm, companyDetails]
  );

  return (
    <>
      <div className=" grid lg:grid-cols-2 grid-cols-1 space-x-2 space-y-2">
        <QuotationLeftPart quotationDetails={quotationDetails} />
        <QuotationRightPart handelDownloadInvoice={downloadPDF} />
      </div>
      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          disabled={isLoading}
          onClick={async (e) => {
            try {
              if (quotationid?.toLowerCase() === "new")
                await createQuotation(e, setisLoading);
              if (quotationid?.toLowerCase() !== "new")
                await updateQuotation(quotationid, setisLoading);

              await downloadPDF(setisLoading);
              createQuotationFormDispatch({
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
              {quotationid?.toLowerCase() !== "new" ? "Update" : "Save"}{" "}
              Quotation
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

const QuotationLeftPart = ({ quotationDetails }) => {
  return (
    <>
      <div className=" 2xl:p-8 xl:p-6 p-4 2xl:rounded-2xl xl:rounded-xl rounded-lg border-[1.5px] border-[#E8E8E8] ">
        <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg font-semibold text-[#4A4A4A] mb-5">
          Quotation Details
        </h1>

        {/* Quotation info */}
        <div className=" grid grid-cols-2 space-y-5 gap-x-3 mb-4">
          <QuoteDateInputField
            className={" col-span-1"}
            quotationDetails={quotationDetails}
          />
          <ExpiryDateInputField
            className={" col-span-1"}
            quotationDetails={quotationDetails}
          />
          <CustomerNameInputField
            className={" col-span-2"}
            quotationDetails={quotationDetails}
          />
          {/* <SalespersonInputField className={" col-span-2"} /> */}
          <ProjectNameInputField
            className={" col-span-2"}
            quotationDetails={quotationDetails}
          />
          {/* <QuoteInputField className={" col-span-1"} /> */}
          <ReferenceInputField
            className={" col-span-2"}
            quotationDetails={quotationDetails}
          />
          <SubjectInputField
            className={" col-span-2"}
            quotationDetails={quotationDetails}
          />
        </div>

        {/* Item Table */}
        <ItemDetails quotationDetails={quotationDetails} />

        {/* Totals Section */}
        <SubTotal className={" mb-6"} quotationDetails={quotationDetails} />

        {/* Terms and Conditions */}
        <TermsAndConditions quotationDetails={quotationDetails} />
      </div>
    </>
  );
};

const TermsAndConditions = ({ quotationDetails }) => {
  const [toc, settoc] = useState(
    quotationDetails?.list_toc[0]?.terms_of_service || ""
  );
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "listToc",
      value: [
        {
          terms_of_service: toc || "N/A",
        },
      ],
    });
  }, [toc]);

  return (
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
  );
};

const QuotationRightPart = ({ handelDownloadInvoice }) => {
  const { createQuotationForm } = useContext(QuotationContext);
  const { companyDetails } = useContext(CompanyContext);
  const [isDownloading, setisDownloading] = useState(false);
  const [taxAmount, settaxAmount] = useState("");
  const [discount, setdiscount] = useState("");

  useEffect(() => {
    const tax = Number(createQuotationForm?.tdsAmount?.split("%")[0]) || 0;
    settaxAmount(
      Number(
        ((Number(createQuotationForm?.subtotalAmount) || 0) *
          (100 - Number(createQuotationForm?.discountAmount)) *
          tax) /
          10000
      ).toFixed(2)
    );
  }, [
    createQuotationForm?.tdsAmount,
    createQuotationForm?.subtotalAmount,
    createQuotationForm?.discountAmount,
  ]);

  useEffect(() => {
    setdiscount(
      Number(
        ((createQuotationForm?.subtotalAmount || 0) *
          (createQuotationForm?.discountAmount || 0)) /
          100
      ).toFixed(2)
    );
  }, [
    createQuotationForm?.discountAmount,
    createQuotationForm?.subtotalAmount,
  ]);

  if (!companyDetails) {
    showToast("Company details not found", 1);
    return;
  }
  return (
    <>
      <div className="py-6 px-4 2xl:rounded-2xl xl:rounded-xl h-fit rounded-lg border-[1.5px] border-[#E8E8E8]">
        {/* header  */}
        <div className="flex items-center gap-5 justify-between mb-10">
          <h1 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold text-[#4A4A4A]">
            Quotation Preview
          </h1>
          <button
            disabled={isDownloading}
            onClick={async (e) => {
              e.preventDefault();
              handelDownloadInvoice(setisDownloading);
            }}
            className=" whitespace-nowrap flex items-center gap-2 bg-[#2543B1] text-white px-4 py-3 rounded-xl text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl font-medium hover:bg-[#1b34a3] transition"
          >
            <Download className="w-5 h-5 inline-block mr-1 -translate-y-0.5" />
            Download PDF
          </button>
        </div>

        <div className="2xl:p-8 xl:p-6 p-4 rounded-xl border-2 border-[#E8E8E8] ">
          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-center font-semibold text-[#4A4A4A]">
            QUOTATION ORDER
          </h2>
          {/* <h3 className="2xl:text-xl xl:text-lg lg:text-base text-sm text-center font-medium text-[#777777] mb-2">
            PO-1749471694769
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
                  {createQuotationForm?.customerName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                  Phone:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  +91 {companyDetails.company_mobile_no}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A]">
                  GST:
                </h4>
                <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                  {companyDetails.company_GSTIN}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <h4 className="2xl:text-xl xl:text-lg lg:text-base text-sm font-medium text-[#4A4A4A] ">
                Project:
              </h4>
              <p className="text-[#777777] font-medium 2xl:text-lg xl:text-base lg:text-sm text-xs  ">
                {createQuotationForm?.projectName}
              </p>
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
                  {createQuotationForm?.listItems?.map((item, index) => (
                    <tr
                      key={index}
                      className=" text-[#4A4A4A] 2xl:text-lg xl:text-base lg:text-sm"
                    >
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.item_name}
                      </td>
                      <td className="pr-4 py-4 whitespace-nowrap font-medium text-left">
                        {item?.base_amount && (
                          <>
                            <IndianRupee className=" w-4 h-4 inline-block" />
                            {`${item?.base_amount}`}
                          </>
                        )}
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
                  createQuotationForm?.subtotalAmount || 0.0
                ).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Tax({createQuotationForm?.tdsAmount}):
              </span>
              <span className="text-[#4A4A4A] font-medium">
                +₹{taxAmount || 0.0}
              </span>
            </div>
            <div className="flex justify-between py-2 ">
              <span className="text-[#8E8E8E] font-medium">
                Discount({createQuotationForm?.discountAmount || 0}%):
              </span>
              <span className="text-[#4A4A4A] font-medium">-₹{discount}</span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#bebebe] mt-2">
              <span className="font-medium text-gray-800">Total</span>
              <span className="font-medium text-gray-800">
                {" "}
                ₹{createQuotationForm?.totalAmount}
              </span>
            </div>
          </div>

          <div className="space-y-3 text-gray-800 text-sm">
            {/* Customer Note */}
            {/* <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm">
              Customer note:
              <span className="text-[#4A4A4A]">
                {createQuotationForm?.notes}
              </span>
            </p> */}

            {/* Terms */}
            <p className="font-medium text-[#606060] 2xl:text-xl xl:text-lg lg:text-base text-sm  mb-4">
              Terms & Conditions:{" "}
              <span className="text-[#4A4A4A]">
                {createQuotationForm?.listToc[0]?.terms_of_service}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const ItemDetails = ({ className, quotationDetails }) => {
  const blankItem = {
    item_description: "",
    unit_price: "",
    quantity: "",
    gross_amount: "",
    gst_amount: "",
    discount: "",
    hsn_code: "",
  };
  const [items, setItems] = useState(
    quotationDetails?.list_items || [blankItem]
  );
  const { createQuotationFormDispatch } = useContext(QuotationContext);

  // changes fields for particular item row
  const handleChange = (index, field, value) => {
    // Dispatch to reducer to update the item field
    createQuotationFormDispatch({
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
      createQuotationFormDispatch({
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
    createQuotationFormDispatch({
      type: "ADD_ITEM",
      item: blankItem,
    });
  };

  // remove a existing row , also remove the row to purchase reducer
  const removeRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    createQuotationFormDispatch({
      type: "REMOVE_ITEM",
      index,
    });
  };

  // reset state value when no purchase data
  useEffect(() => {
    if (!quotationDetails) setItems([blankItem]);
  }, [quotationDetails]);

  //first set all item details to create purchase form
  useEffect(() => {
    if (quotationDetails?.list_items) {
      createQuotationFormDispatch({
        type: "UPDATE_FIELD",
        field: "listItems",
        value: quotationDetails?.list_items,
      });
    }
  }, []);

  return (
    <>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className=" space-y-3 mb-8">
            <div className={`mb-6 ${className}`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Item Table
              </h3>

              <div className=" space-y-3 mb-8">
                <div className=" grid grid-cols-5 gap-3">
                  <div className=" overflow-x-hidden col-span-2">
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
                  <div className=" overflow-x-hidden col-span-2">
                    <InputField
                      required={true}
                      autoComplete="off"
                      value={item.hsn_code}
                      setvalue={(val) => {
                        handleChange(index, "hsn_code", val);
                      }}
                      label={"HSN Code"}
                      placeholder={"Hsn Code"}
                    />
                  </div>
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
                </div>
                <div className=" grid grid-cols-4 gap-3">
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
                  <div className=" overflow-x-hidden col-span-1">
                    <InputField
                      required={true}
                      autoComplete="off"
                      padding={2}
                      readOnly={true}
                      value={item.gross_amount}
                      setvalue={(val) =>
                        handleChange(index, "gross_amount", val)
                      }
                      label={"Amount"}
                      placeholder={"0.00"}
                      icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                      inputType={"rupee"}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* add new row buttons  */}
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
    </>
  );
};

const QuoteInputField = ({ className }) => {
  const [id, setid] = useState("");
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={id}
          setvalue={setid}
          label={"Quote#"}
          placeholder={"QT00001"}
        />
      </div>
    </>
  );
};

const ReferenceInputField = ({ className, quotationDetails }) => {
  const [reference, setreference] = useState(quotationDetails?.refrence || "");
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "refrence",
      value: reference || "N/A",
    });
  }, [reference]);

  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={reference}
          setvalue={setreference}
          label={"Reference#"}
          placeholder={""}
        />
      </div>
    </>
  );
};

const SubjectInputField = ({ className, quotationDetails }) => {
  const [subject, setsubject] = useState(quotationDetails?.subject || "");
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "subject",
      value: subject || "N/A",
    });
  }, [subject]);
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

const QuoteDateInputField = ({ className, quotationDetails }) => {
  const [date, setdate] = useState(
    quotationDetails?.quotation_date?.split("-").reverse().join("-") || ""
  );
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "quotationDate",
      value: date?.split("-").reverse().join("-"),
    });
  }, [date]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={date}
          setvalue={setdate}
          placeholder={new Date(Date.now()).toLocaleDateString()}
          label={"Quote Date"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const ProjectNameInputField = ({ className, quotationDetails }) => {
  const [project, setproject] = useState(quotationDetails?.project_name || "");
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "projectName",
      value: project || "N/A",
    });
  }, [project]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={project}
          setvalue={setproject}
          label={"Project name"}
          placeholder={"Type a project name"}
        />
        <p className=" 2xl:text-lg xl:text-base lg:text-sm text-xs font-normal text-[#8E8E8E] ">
          Enter a project to associate a project
        </p>
      </div>
    </>
  );
};

const ExpiryDateInputField = ({ className, quotationDetails }) => {
  const [date, setdate] = useState(
    quotationDetails?.expiry_date?.split("-").reverse().join("-") || ""
  );
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "expiryDate",
      value: date?.split("-").reverse().join("-"),
    });
  }, [date]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={date}
          setvalue={setdate}
          label={"Expiry Date"}
          placeholder={"dd-mm-yyyy"}
          inputType={"date"}
          icon={<CalendarDays className="w-5 h-5 text-[#777777] " />}
        />
      </div>
    </>
  );
};

const CustomerNameInputField = ({ className, quotationDetails }) => {
  const [customer, setcustomer] = useState({
    customer_name: quotationDetails?.customer_name || "",
    email: quotationDetails?.email || "",
    contact_no: quotationDetails?.contact_no || "",
    customer_id: quotationDetails?.customer_id || "",
  });
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { createQuotationFormDispatch } = useContext(QuotationContext);
  const { getAllCustomers, AllCustomersList } = useContext(CustomerContext);
  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "customerId",
      value: customer?.customer_id || "",
    });
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "customerName",
      value: customer?.customer_name || "",
    });
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "email",
      value: customer?.email || "",
    });
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "contactNo",
      value: customer?.contact_no || "",
    });
  }, [customer]);

  // get all customer list
  useEffect(() => {
    getAllCustomers(setisLoading);
  }, []);

  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          required={true}
          value={customer.customer_name}
          setvalue={setcustomer}
          readOnly={true}
          isLoading={isLoading}
          label={"Customer Name"}
          placeholder={"Select or add customer"}
          hasDropDown={true}
          dropDownData={AllCustomersList}
          dropDownType="usersData"
          addnew={"customer"}
          onClickAddNew={() => {
            navigate("/customer/addCustomer/new");
          }}
        />
      </div>
    </>
  );
};

const UploadQuotation = ({ quotationDetails }) => {
  const [files, setfiles] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const { createQuotation, createQuotationFormDispatch } =
    useContext(QuotationContext);

  useEffect(() => {
    // if (!files || files.length == 0) {
    //   createQuotationFormDispatch({
    //     type: "RESET",
    //   });
    // }

    createQuotationFormDispatch({
      type: "RESET",
    });
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "quotationUrl",
      value:
        files && files.length > 0
          ? (files || []).map((item) => {
              return {
                fileBlob: item || "N/A",
                fileName: item.name || "N/A",
                invoice_url: item.related_doc_url || "N/A",
              };
            })
          : [
              {
                invoice_url: "N/A",
              },
            ],
    });
  }, [files]);

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
          multiple
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

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        <button
          disabled={isLoading}
          onClick={async (e) => {
            if (!files || files.length == 0) {
              showToast("Select atleast 1 file", 1);
              return;
            }
            try {
              await createQuotation(e, setisLoading);
              createQuotationFormDispatch({
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
            "Save Quotation"
          )}
        </button>
        <button className="2xl:text-xl xl:text-lg lg:text-base md:text-sm xl:rounded-2xl md:rounded-xl xl:px-6 px-4 xl:py-4 py-3 cursor-pointer border-2 border-[#3333331A] text-[#4A4A4A] hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </>
  );
};

const SubTotal = ({ className, quotationDetails }) => {
  const { createQuotationFormDispatch, createQuotationForm } =
    useContext(QuotationContext);
  const [subtotal, setsubtotal] = useState(
    Number(createQuotationForm?.subtotalAmount || 0)
  );
  const [discount, setdiscount] = useState(
    quotationDetails?.discount_amount || 0
  );
  const [isAdjustment, setisAdjustment] = useState(
    quotationDetails?.adjustment_amount?.toString().toLowerCase() === "true"
      ? true
      : false
  );
  const [isTdsEnable, setisTdsEnable] = useState(true);
  const [tds, settds] = useState({
    value: quotationDetails?.tds_amount || "0%",
    name: quotationDetails?.tds_reason || "N/A",
  });
  const [grandTotal, setgrandTotal] = useState(
    quotationDetails?.total_amount || 0.0
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
    createQuotationFormDispatch({
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
      Number(
        createQuotationForm?.listItems.reduce((acc, item) => {
          return acc + parseFloat(item.gross_amount || 0);
        }, 0) || 0
      ).toFixed(2)
    );
  }, [createQuotationForm]);

  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "discountAmount",
      value: Number(discount).toFixed(2),
    });
    setdiscountAmount(((subtotal * discount) / 100).toFixed(2));
  }, [discount, subtotal]);

  useEffect(() => {
    createQuotationFormDispatch({
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
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "totalAmount",
      value: isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal,
    });
  }, [grandTotal, isAdjustment]);

  useEffect(() => {
    createQuotationFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsAmount",
      value: tds.value,
    });
    createQuotationFormDispatch({
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
          <span className="">{Number(subtotal).toFixed(2)}</span>
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
          <span>
            {isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal}
          </span>
        </div>
        <p className=" text-end font-medium 2xl:text-xl xl:text-lg lg:text-base text-xs text-[#606060] ">
          {toWords.convert(
            Number(isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal)
          )}
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
      className={`relative mx-auto w-full max-w-[200px]  ${
        isDisabled ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          className={`w-full px-2 py-2  ${
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
