import {
  BadgeCheck,
  Building2,
  CheckCircle,
  Clock,
  Download,
  Edit,
  FileText,
  History,
  Mail,
  MapPin,
  PencilLine,
  PenLine,
  Phone,
  Send,
  Upload,
  UserCircle,
  UserCircle2,
  XCircle,
  Loader2,
  IndianRupee,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { downloadAsZip } from "../../utils/downloadAsZip";
import { showToast } from "../../utils/showToast";
import { InputField } from "../../utils/ui/InputField";
import { ItemDetailsTable } from "../../component/ItemDetailsTable";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { ToastContainer } from "react-toastify";
import { SalesContext } from "../../context/sales/salesContext";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import axios from "axios";
import { UserContext } from "../../context/userContext/UserContext";
import { CompanyContext } from "../../context/company/CompanyContext";

export const SaleInfo = () => {
  const navigate = useNavigate();
  const { saleid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const { getSaleDetails, saleDetails } = useContext(SalesContext);

  useEffect(() => {
    getSaleDetails(saleid, setisLoading);
  }, []);

  if (isLoading) {
    return (
      <div className=" py-8 px-3 flex justify-center">
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  if (!saleDetails) return;

  console.log(saleDetails);

  return (
    <>
      <ToastContainer />
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
        {/* header  */}
        <div className=" mb-6">
          <div className="flex justify-between items-end mb-1">
            <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
              Sales Information
            </h1>
            <button
              onClick={() => {
                navigate(`/sales/addSales/${saleDetails?.sales_id}`);
              }}
              className="px-4 py-3 flex items-center justify-center gap-2 font-medium 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition-colors"
            >
              <Edit className="w-5 h-5" /> Edit Sales
            </button>
          </div>

          <div className="mb-8  flex justify-between items-center  xl:text-base md:text-sm  text-xs">
            <p className=" text-[#A4A4A4] font-medium ">
              Detailed information for sale - {saleDetails?.sales_id}
            </p>
            <p className="text-[#A4A4A4] lg:max-w-none max-w-[50%] font-medium ">
              Note: Edit can only be done once the invoice has been uploaded
            </p>
          </div>
        </div>

        {/* sales info  */}
        <div className=" grid lg:grid-cols-10 grid-cols-1 gap-3">
          <SaleInfoLeftPart
            className={"lg:col-span-6 col-span-1"}
            saleDetails={saleDetails}
          />
          <SaleInfoRightPart
            setisLoading={setisLoading}
            getSaleDetails={getSaleDetails}
            className={"lg:col-span-4 col-span-1"}
            saleDetails={saleDetails}
          />
        </div>
      </div>
    </>
  );
};

const SaleInfoLeftPart = ({ className, saleDetails }) => {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <SaleDetails saleDetails={saleDetails} />
      <ClientDetails saleDetails={saleDetails} />
      <ItemDetailsTable dataList={saleDetails} />
      <RelatedDocuments saleDetails={saleDetails} />
      <Description saleDetails={saleDetails} />
    </div>
  );
};

const SaleInfoRightPart = ({
  className,
  saleDetails,
  setisLoading,
  getSaleDetails,
}) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [amountPaid, setamountPaid] = useState(
    Number(saleDetails.total_amount)
  );
  const iconMap = {
    Approved: <CheckCircle size={18} />,
    Sent: <Send size={18} />,
    Creation: <FileText size={18} />,
    "Partial Pay": <Clock size={18} />,
    Cancel: <XCircle size={18} />,
  };

  const getFileExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase();
  };

  const isImage = useCallback((ext) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  }, []);

  const getFilePreview = (file, ext) => {
    if (isImage(ext)) {
      return (
        <img
          src={file?.related_doc_url || "document image"}
          alt={`preview ${file?.related_doc_name}`}
          className="object-contain w-full text-[10px]"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="w-12 h-12">
            <FileIcon
              extension={ext}
              {...(defaultStyles[ext] || defaultStyles.doc)}
            />
          </div>
        </div>
      );
    }
  };

  useEffect(() => {
    const totalAmount = saleDetails.payment_transactions_list?.reduce(
      (sum, txn) => {
        return sum + parseFloat(txn.amount || "0");
      },
      0
    );
    setamountPaid(totalAmount);
  }, [saleDetails]);

  return (
    <>
      <UpdateTimeLineModal
        amountPaid={amountPaid}
        setisSaleDetailLoading={setisLoading}
        getSaleDetails={getSaleDetails}
        saleDetails={saleDetails}
        isOpen={isModalOpen}
        setisOpen={setisModalOpen}
      />
      <div
        className={`h-fit w-full grid lg:grid-cols-1 grid-cols-2 gap-4 ${className}`}
      >
        {/* amount pie chart  */}
        <AmountPieChart
          className={" h-fit"}
          totalAmount={Number(saleDetails.total_amount)}
          amountPaid={amountPaid}
        />
        <div
          className={`rounded-lg w-full h-fit 2xl:p-8 xl:p-6 md:p-4 p-2 border-[1.5px] border-[#E8E8E8] `}
        >
          <h2 className="mb-4 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold text-[#4A4A4A]">
            Timeline
          </h2>
          <div className=" mb-6 flex flex-wrap justify-between items-center">
            <button
              onClick={() => {
                setisModalOpen(true);
              }}
              className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs 
          bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition-colors"
            >
              Update Timeline <History className="w-5 h-5 rotate-y-180" />
            </button>
            {/* <button
              onClick={() => {
                setisModalOpen(true);
              }}
              className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs 
          border-[#2543B1] border-2 text-[#2543B1] rounded-xl cursor-pointer transition-colors"
            >
              Update TDS
            </button> */}
          </div>
          <div className="space-y-4">
            {saleDetails?.payment_transactions_list?.map((item, idx) => {
              const ext = getFileExtension(item?.transaction_url);
              return (
                <div
                  key={idx}
                  className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2 overflow-x-auto"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${item.statusColor}`}
                    >
                      {/* {iconMap[item.status]} */}
                      <CheckCircle size={18} />
                    </div>
                    <p className="text-[#777777] font-medium xl:text-base md:text-sm text-xs">
                      {item.remark}
                    </p>
                  </div>

                  {/* File box if present */}
                  {item.transaction_url &&
                    item.transaction_url.toLowerCase() != "n/a" && (
                      <div className="ml-11 bg-white border-[#0000001A] border-1  shadow-sm rounded-lg flex items-center gap-3 px-2 py-2 w-fit text-sm">
                        <div className=" text-white w-15 px-2 py-2 rounded text-xs font-semibold">
                          {getFilePreview(item?.transaction_url, ext)}
                        </div>
                        <span className="text-[#606060] font-medium xl:text-base md:text-sm text-xs">
                          {item.transaction_url}
                        </span>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

const UpdateTimeLineModal = ({
  amountPaid,
  isOpen,
  setisOpen,
  saleDetails,
  setisSaleDetailLoading,
  getSaleDetails,
}) => {
  const [formData, setformData] = useState({
    transaction_id: "N/A",
    timestamp: Date.now(),
    amount: "",
    remark: "",
    transaction_url: "",
  });
  const { userDetails } = useContext(UserContext);
  const { companyDetails } = useContext(CompanyContext);
  const [isLoading, setisLoading] = useState(false);
  const { saleid } = useParams();

  const handleSubmit = async () => {
    await updateTimeLine();
  };

  const handelClose = () => {
    setisOpen(false);
  };

  const updateTimeLine = useCallback(async () => {
    // const userId = userDetails?.userId;
    // if (!userId) {
    //   showToast("user ID not found", 1);
    //   return;
    // }
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Token not found", 1);
      return;
    }
    if (!formData.amount || !formData.transaction_url || !formData.remark) {
      showToast("All fields are required", 1);
      return;
    }

    if (
      Number(formData.amount) >
      Number(saleDetails.total_amount) - amountPaid
    ) {
      // console.log(
      //   Number(saleDetails.total_amount) - amountPaid,
      //   Number(formData.amount)
      // );
      showToast("Amount must less than leftover amount", 1);
      return;
    }

    try {
      setisLoading(true);
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/update-sales-details/`,
        {
          salesTs: saleDetails.sales_ts,
          invoiceId: saleDetails.invoice_id,
          invoiceNumber: saleDetails.invoice_number,
          listItems: saleDetails.list_items,
          listToc: saleDetails.list_toc,
          listStatus: saleDetails.list_status,
          customerId: saleDetails.created_on,
          notes: saleDetails.notes,
          contactNo: saleDetails.contact_no,
          email: saleDetails.email,
          address: saleDetails.address,
          invoiceUrl: saleDetails.invoice_url,
          paymentNameList: saleDetails.payment_name_list,
          invoiceDate: saleDetails.invoice_date,
          invoiceDueBy: saleDetails.invoice_due_by,
          quotationId: saleDetails.quotation_id,
          purchaseOrderId: saleDetails.po_id,
          paymentTransactionsList: [
            ...saleDetails.payment_transactions_list,
            formData,
          ],
          gstinNumber: saleDetails.gstin_number,
          panNumber: saleDetails.pan_number,
          subtotalAmount: saleDetails.subtotal_amount,
          discountAmount: saleDetails.discount_amount,
          tdsAmount: saleDetails.tds_amount,
          adjustmentAmount: saleDetails.adjustment_amount,
          totalAmount: saleDetails.total_amount,
          status: saleDetails.status,
          terms: saleDetails.terms,
          customerName: saleDetails.customer_name,
          tdsReason: saleDetails.tds_reason,
          companyId: companyDetails.company_id,
          // userId: userId,
          salesId: saleDetails.sales_id,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if (res.data?.status && res.data.status.toLowerCase() !== "success") {
        showToast("Somthing went wrong. Please try again", 1);
        setisLoading(false);
        return;
      }

      console.log(res);
      await getSaleDetails(saleid, setisSaleDetailLoading);
      handelClose();
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.message || error.message || "Somthing went wrong",
        1
      );
    } finally {
      setisLoading(false);
    }
  }, [formData, userDetails, saleDetails, companyDetails]);

  if (!isOpen) return null;

  console.log(formData);

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-5">
        <div className="w-full max-w-md mx-auto my-5 bg-white rounded-xl shadow-lg p-6 space-y-5 animate-slideDown">
          {/* header  */}
          <div className="">
            <h2 className=" mb-3 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold">
              Update Timeline
            </h2>
            <p className=" text-[#777777] font-medium xl:text-base md:text-sm text-xs">
              Choose how update the timeline
            </p>
          </div>

          {/* balance  */}
          <div>
            <p className="font-normal text-[#000000] 2xl:text-lg xl:text-base lg:text-sm text-xs">
              Enter Payment Amount*
            </p>
            <div className=" flex items-end ">
              <div className="text-[#333333c6] w-fit font-normal 2xl:text-lg md:text-base px-3 py-2 border-[1.5px] border-[#0000001A] rounded-lg mr-3">
                INR
              </div>
              <InputField
                hasLabel={false}
                inputType={"number"}
                className={"inline-block flex-1"}
                value={formData.amount}
                setvalue={(value) => {
                  setformData((prev) => {
                    return {
                      ...prev,
                      amount: value,
                    };
                  });
                }}
                label={""}
                required={true}
                placeholder={"Enter Balance"}
              />
            </div>
          </div>

          {/* remarks  */}
          <div>
            <InputField
              value={formData.remark}
              setvalue={(value) => {
                setformData((prev) => {
                  return {
                    ...prev,
                    remark: value,
                  };
                });
              }}
              label={"Remarks"}
              placeholder={"Enter remarks related to payment"}
            />
          </div>

          {/* upload document  */}
          <UploadDocuments setSelectedFile={setformData} />

          {/* buttons  */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              disabled={isLoading}
              onClick={handelClose}
              className="col-span-1 py-2 border-2 border-[#3333331A] rounded-xl hover:bg-gray-100 transition cursor-pointer text-[#777777] "
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              aria-label="Update timeline"
              onClick={handleSubmit}
              className=" col-span-1 cursor-pointer flex items-center justify-center px-3 lg:px-5 py-1 lg:py-3 bg-[#2543B1] transition hover:bg-blue-900 border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              {isLoading ? (
                <Loader2 className=" w-5 animate-spin mx-auto" />
              ) : (
                <span className="">Confirm</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const UploadDocuments = ({ setSelectedFile }) => {
  const [files, setfiles] = useState(null);
  useEffect(() => {
    setSelectedFile((prev) => {
      return {
        ...prev,
        transaction_url: files && files.length > 0 ? files[0].name : "",
      };
    });
  }, [files]);

  return (
    <div className=" outline-[#00000029] rounded-lg px-3 py-5 border-2 border-[#00000033] border-dashed">
      {files && (
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

      {!files && (
        <label
          tabIndex={0}
          htmlFor="upload-invoice"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className=" w-8 h-8 text-[#000000] mb-3" />
          <p className="font-medium text-sm mb-1">
            Documents related to transaction
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
              showToast(`"${file.name}" is too large. Max size is 25MB.`, 1);
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

const AmountPieChart = ({ className, totalAmount, amountPaid }) => {
  // const totalAmount = amountPaid + amountLeft ;
  // const amountPaid = 600000;
  const amountLeft = Number((totalAmount - amountPaid).toFixed(2));

  // console.log(totalAmount, amountPaid, amountLeft);

  const data = [
    { name: "Amount Left", value: amountLeft },
    { name: "Amount Paid", value: amountPaid },
  ];

  const COLORS = ["#FB3748", "#2543B1"];

  return (
    <div
      className={`flex flex-col items-center p-4 w-full rounded-lg bg-white border-[1.5px] border-[#E8E8E8] ${className}`}
    >
      <h2 className="text-xl font-semibold mb-2">Payment Summary</h2>

      <div className="relative w-full ">
        <ResponsiveContainer width="100%" aspect={1}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={"80%"}
              outerRadius={"95%"}
              startAngle={50}
              endAngle={-310}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationDuration={800} // default is 1500 ms
              animationEasing="ease"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index]}
                  cornerRadius={10}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold text-[#4A4A4A]">
          <span className=" ">Total Amount</span>
          <span className=" ">₹ {totalAmount}</span>
        </div>
      </div>

      <div className="flex justify-between w-full mt-4 gap-4">
        <div className="flex items-center font-medium text-[#606060] ">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: `${COLORS[1]}` }}
          ></div>
          <div>
            <span>Amount Paid</span>
            <br />
            <span>₹ {amountPaid}</span>
          </div>
        </div>
        <div className="flex items-center font-medium text-[#606060] ">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: `${COLORS[0]}` }}
          ></div>
          <div>
            <span>Amount Left</span>
            <br />
            <span>
              ₹{" "}
              {amountLeft.toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SaleDetails = ({ saleDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Sale Details
      </h2>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Sale ID
          </p>
          <span className="text-[#2543B1] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.sales_id}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Total Payment
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            <IndianRupee className=" w-4.5 h-4.5 inline-block" />
            {Number(saleDetails?.total_amount).toFixed(2)}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Sales Deadline
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.sales_ts}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Payment Status
          </p>
          <span className="text-[#1FC16B] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const ClientDetails = ({ saleDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Client Details
      </h2>

      <div className="space-y-4 text-sm text-gray-600">
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Company Name
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.customer_name}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Email
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.email}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Phone
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.contact_no}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] 2xl:text-xl xl:text-lg lg:text-base md:text-sm text-xs ">
            Address
          </p>
          <span className="text-[#4A4A4A] font-medium 2xl:text-2xl xl:text-xl lg:text-lg md:text-base text-sm">
            {saleDetails?.address}
          </span>
        </div>
      </div>
    </div>
  );
};

const Description = ({ saleDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Description
      </h2>
      <p className="text-xs text-[#8E8E8E] mt-2">{saleDetails?.notes}</p>
    </div>
  );
};

const RelatedDocuments = ({ saleDetails }) => {
  const [files, setFile] = useState(
    saleDetails?.invoice_url?.length > 0 &&
      saleDetails?.invoice_url[0]?.invoice_url != "N/A"
      ? (saleDetails?.invoice_url || []).map((item) => {
          return {
            related_doc_name: item?.invoice_url,
            related_doc_url: item?.invoice_url,
          };
        })
      : null
  );

  const downloadAllFiles = (e) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    try {
      downloadAsZip(files);
    } catch (error) {
      showToast(error.message, 1);
    }
  };

  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <div className="flex justify-between items-center mb-10">
        <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A]">
          Sales Invoice
        </h2>
        <button
          onClick={downloadAllFiles}
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer bg-[#0033661A] text-indigo-600 px-4 py-2 rounded-lg text-base font-medium hover:bg-[#0016661a] transition"
        >
          <Download className="w-4 h-4" />
          Download all
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 mb-4 max-h-[250px] overflow-auto">
        {files && files.length > 0 ? (
          <ShowFiles files={files} />
        ) : (
          <div className=" w-full flex flex-col items-center gap-4">
            <div className="text-[#2543B1] bg-[#0033661A] rounded-lg p-2 justify-center flex text-sm">
              <FileText className="h-8 w-8" />
            </div>{" "}
            <p className="text-[#606060] text-sm">No documents attached</p>
          </div>
        )}
      </div>

      {/* <div className="flex justify-center gap-4 flex-wrap">
        <Link
          to={"/sales/createInvoice"}
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer bg-[#2543B1] text-white px-4 py-3 rounded-xl text-sm font-medium hover:bg-blue-900 trnsitioan"
        >
          <PenLine className="w-4 h-4" />
          Create Invoice
        </Link>
        <div>
          <label
            htmlFor="upload-existing-invoice"
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer bg-[#0033661A] text-indigo-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#0016661a] transition"
          >
            <Upload className="w-4 h-4" />
            Upload Invoice
          </label>
          <input
            multiple
            id="upload-existing-invoice"
            type="file"
            accept=".pdf, .jpg, .png, .doc, .docx"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <p className=" text-[#8E8E8E] text-xs md:text-sm font-medium mt-2 ">
        Note : You won’t be able to edit this sale if invoice not uploaded
      </p> */}
    </div>
  );
};

const ShowFiles = ({ files }) => {
  const getFileExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase();
  };

  const isImage = (ext) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  };

  const getFilePreview = (file, ext) => {
    if (isImage(ext)) {
      return (
        <img
          src={file?.related_doc_url || "document image"}
          alt={`preview ${file?.related_doc_name}`}
          className="object-cover w-full h-full text-[10px]"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="w-12 h-12">
            <FileIcon
              extension={ext}
              {...(defaultStyles[ext] || defaultStyles.doc)}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="max-h-[200px] w-full overflow-auto flex flex-wrap justify-center gap-3 pt-5">
      {files.map((file, index) => {
        const ext = getFileExtension(file?.related_doc_name);
        return (
          <div
            key={index}
            className="relative w-[100px] flex flex-col items-center gap-1"
          >
            <div
              className="w-[100px] h-[100px] bg-gray-100 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                window.open(file?.related_doc_url, "_blank");
              }}
            >
              {getFilePreview(file, ext)}
            </div>
            <p className="text-[#606060] text-xs text-center w-full truncate">
              {file?.related_doc_name}
            </p>
          </div>
        );
      })}
    </div>
  );
};
