import { useState, useEffect, useRef, useContext, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import { InvoiceContext } from "../../context/invoiceContext/InvoiceContext";

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
        <div className=" hidden mb-4 md:flex rounded-lg bg-[#0033661A] overflow-hidden xl:py-2 xl:px-3 p-1 w-full">
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
        </div>

        {/* main content */}
        {activeTab === "create" && <CreateInvoiceForm activeTab={activeTab} />}
        {activeTab === "upload" && <UploadInvoice activeTab={activeTab} />}
      </div>
    </>
  );
};
const CreateInvoiceForm = ({ activeTab }) => {
  const [isLoading, setisLoading] = useState(false);
  const { createInvoice, createInvoiceForm } = useContext(InvoiceContext);
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
        drawText("Invoice Review", 230, y, 18, true);

        // Labels
        y -= 30;
        drawText("From:", 40, y, 11, true);
        drawText("Bill To:", 320, y, 11, true);

        // Addresses
        y -= 15;
        const fromText = `${companyDetails?.company_name ?? ""}, ${
          companyDetails?.company_address ?? ""
        }`;
        const billToText = `${
          createInvoiceForm?.paymentNameList?.[0]
            ?.bank_account_receivers_name ?? ""
        }`;

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
        drawText(`From: ${createInvoiceForm?.invoiceDate}`, 40, y, 11, true);
        drawText(
          `Due Date: ${createInvoiceForm?.invoiceDueBy}`,
          320,
          y,
          11,
          true
        );

        y -= 20;
        drawText(`Phone: +91${createInvoiceForm?.contactNo}`, 40, y, 11, true);
        drawText(`GST: ${createInvoiceForm?.gstNumber}`, 320, y, 11, true);

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
        const items = createInvoiceForm?.listItems || [];
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
        drawText(`Rs.${createInvoiceForm?.subtotalAmount}`, 420, y);

        y -= 20;
        drawText(`Tax(${createInvoiceForm?.tdsAmount}):`, 40, y, 11, true);
        drawText(
          `+Rs.${Number(
            ((Number(createInvoiceForm?.subtotalAmount) || 0) *
              (100 - Number(createInvoiceForm?.discountAmount)) *
              (Number(createInvoiceForm?.tdsAmount?.split("%")[0]) || 0)) /
              10000
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 20;
        drawText(
          `Discount(${createInvoiceForm?.discountAmount}%):`,
          40,
          y,
          11,
          true
        );
        drawText(
          `-Rs.${Number(
            ((createInvoiceForm?.subtotalAmount || 0) *
              (createInvoiceForm?.discountAmount || 0)) /
              100
          ).toFixed(2)}`,
          420,
          y
        );

        y -= 25;
        drawText("Total:", 40, y, 12, true);
        drawText(`Rs.${createInvoiceForm?.totalAmount}`, 420, y, 12, true);

        page.drawLine({
          start: { x: 40, y: y - 10 },
          end: { x: 550, y: y - 10 },
          thickness: 1,
          color: rgb(0.7, 0.7, 0.7),
        });

        // Notes and T&C
        y -= 40;
        drawText(`Customer note: ${createInvoiceForm?.notes ?? ""}`, 40, y);
        y -= 20;
        drawText(
          `Terms & Conditions: ${
            createInvoiceForm?.listToc?.[0]?.terms_of_service ?? ""
          }`,
          40,
          y
        );

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        saveAs(blob, "invoice.pdf");
      } catch (error) {
        console.log(error);
        showToast(error.message || "Download pdf failed", 1);
      } finally {
        setisLoading(false);
      }
    },
    [createInvoiceForm, companyDetails]
  );

  return (
    <>
      <div className=" grid lg:grid-cols-2 grid-cols-1 gap-x-2 gap-y-4 mb-4">
        <CreateInvoiceLeftPart />
        <CreateInvoiceRightPart handelDownloadInvoice={downloadPDF} />
      </div>
      {/* Action Buttons */}
      <div className="flex sm:flex-row flex-col sm:items-center gap-4">
        <button
          disabled={isLoading}
          onClick={(e) => {
            try {
              createInvoice(e, setisLoading, activeTab);
              downloadPDF(setisLoading);
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
        <div className=" grid md:grid-cols-2 grid-cols-1 gap-3 space-y-4 mb-4 w-full">
          <InvoiceNumberInputField className={" col-span-1"} />
          <InvoiceDateInputField className={" col-span-1"} />
          <TermsInputField className={" col-span-1"} />
          <DueDateInputField className={" col-span-1"} />
          <CustomerNameInputField className={" md:col-span-2 col-span-1"} />
          <SubjectInputField className={" md:col-span-2 col-span-1"} />
          <OrderNumberInputField className={" col-span-1"} />
          <SalesIDInputField className={" col-span-1"} />
        </div>

        {/* Item Table */}
        <ItemDetails />

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
              handelDownloadInvoice(setisDownloading);
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
                  {
                    createInvoiceForm?.paymentNameList[0]
                      ?.bank_account_receivers_name
                  }
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
  const blankItem = {
    item_description: "",
    unit_price: "",
    quantity: "",
    gross_amount: "",
    gst_amount: "",
    discount: "",
    hsn_code: "",
  };
  const [items, setItems] = useState([blankItem]);
  const { createInvoiceDispatch } = useContext(InvoiceContext);

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
              <div className=" grid md:grid-cols-3 grid-cols-2 gap-3">
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
                <div className=" overflow-x-hidden md:col-span-1 col-span-2">
                  <InputField
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
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "orderNumber",
      value: orderNumber,
    });
  }, [orderNumber]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={orderNumber}
          setvalue={setorderNumber}
          label={"Order number"}
          placeholder={"Enter Order number"}
        />
      </div>
    </>
  );
};

const SalesIDInputField = ({ className }) => {
  const [salesId, setsalesId] = useState("");
  const { createInvoiceDispatch } = useContext(InvoiceContext);
  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "salesId",
      value: salesId,
    });
  }, [salesId]);
  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
          value={salesId}
          setvalue={setsalesId}
          label={"Sales ID"}
          placeholder={"Enter Sales ID"}
        />
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
      value: terms,
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
  }, [customer]);

  return (
    <>
      <div className={`${className} w-full`}>
        <InputField
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
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceUrl",
      value: (files || []).map((item) => {
        return {
          invoice_url: item.name,
        };
      }),
    });
  }, [files]);

  useEffect(() => {
    createInvoiceDispatch({
      type: "UPDATE_FIELD",
      field: "RESET",
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
              createInvoiceForm.invoiceUrl[0]?.invoice_url == "N/A"
            ) {
              showToast("Please select atleast one file", 1);
              return;
            }
            createInvoice(e, setisLoading);
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
  const [discount, setdiscount] = useState(0);
  const [isAdjustment, setisAdjustment] = useState(false);
  const [tds, settds] = useState({
    value: "",
    name: "",
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
      value: grandTotal,
    });
  }, [grandTotal]);

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
