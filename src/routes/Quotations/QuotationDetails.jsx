import {
  BadgeCheck,
  Building2,
  CheckCircle,
  Clock,
  Download,
  Edit,
  FileText,
  History,
  Loader2,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Send,
  Upload,
  UserCircle,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { Cell, Pie, ResponsiveContainer, PieChart } from "recharts";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { ItemDetailsTable } from "../../component/ItemDetailsTable";
import { QuotationContext } from "../../context/quotation/QuotationContext";

const timelineData = [
  {
    user: "Admin",
    time: "06 May 2025, 1:29 PM",
    status: "Approved",
    statusColor: "bg-green-100 text-green-700",
    message: "Sale approved and invoice generated.",
  },
  {
    user: "John Doe",
    time: "29 Apr 2025, 3:52 PM",
    status: "Sent",
    statusColor: "bg-blue-100 text-blue-700",
    message: "Sale proposal sent to customer.",
  },
  {
    user: "Admin",
    time: "29 Apr 2025, 1:40 PM",
    status: "Creation",
    statusColor: "bg-gray-200 text-gray-700",
    message: "Sale created by ADMIN",
  },
  {
    user: "Admin",
    time: "29 Apr 2025, 1:40 PM",
    status: "Partial Pay",
    statusColor: "bg-yellow-100 text-yellow-700",
    message: "Partial Payment is done by ADMIN",
    file: {
      name: "Partial Payment - 001.pdf",
    },
  },
  {
    user: "Admin",
    time: "29 Apr 2025, 1:40 PM",
    status: "Cancel",
    statusColor: "bg-red-100 text-red-700",
    message: "Sale cancelled by ADMIN",
  },
];

export const QuotationDetails = () => {
  const navigate = useNavigate();
  const { quotationid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const { getQuotationDetails, quotationDetails } =
    useContext(QuotationContext);

  useEffect(() => {
    getQuotationDetails(quotationid, setisLoading);
  }, []);

  if (!quotationDetails) return;

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isLoading && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
          {/* header  */}
          <div className=" mb-6">
            <div className="flex justify-between items-end mb-1">
              <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                QUO Enterprise Software Quotation
              </h1>
              <div className=" flex gap-3 w-fit">
                <button
                  onClick={() => {
                    navigate(
                      `/quotation/createQuotation/${quotationDetails?.quotation_id}`
                    );
                  }}
                  className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
                >
                  <Edit className="w-5 h-5" /> Edit Details
                </button>
              </div>
            </div>
          </div>

          {/* Quotation info  */}
          {!isLoading && quotationDetails && (
            <div className=" grid grid-cols-10 gap-3">
              <QuotationInfoLeftPart
                className={"col-span-6"}
                quotationDetails={quotationDetails}
              />
              <QuotationInfoRightPart
                className={"col-span-4"}
                quotationDetails={quotationDetails}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

const QuotationInfoLeftPart = ({ className, quotationDetails }) => {
  return (
    <div className={`flex flex-col gap-5  ${className}`}>
      <QuotationDetailsSection quotationDetails={quotationDetails} />
      <CustomerDetails quotationDetails={quotationDetails} />
      <ItemDetailsTable dataList={quotationDetails} />
      <RelatedDocuments quotationDetails={quotationDetails} />
      <TermsAndConditions quotationDetails={quotationDetails} />
    </div>
  );
};

const QuotationInfoRightPart = ({ className, quotationDetails }) => {
  const [isModalOpen, setisModalOpen] = useState(false);

  const iconMap = {
    Approved: <CheckCircle size={18} />,
    Sent: <Send size={18} />,
    Creation: <FileText size={18} />,
    "Partial Pay": <Clock size={18} />,
    Cancel: <XCircle size={18} />,
  };
  return (
    <>
      <UpdateTimeLineModal isOpen={isModalOpen} setisOpen={setisModalOpen} />
      <div
        className={`h-fit w-full grid lg:grid-cols-1 grid-cols-2 gap-4 ${className}`}
      >
        {/* amount pie chart  */}
        <AmountPieChart className={" h-fit"} />
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
            <button
              onClick={() => {
                setisModalOpen(true);
              }}
              className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs 
                    border-[#2543B1] border-2 text-[#2543B1] rounded-xl cursor-pointer transition-colors"
            >
              Update TDS
            </button>
          </div>
          <div className="space-y-4">
            {timelineData.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${item.statusColor}`}
                  >
                    {iconMap[item.status]}
                  </div>
                  <p className="text-[#777777] font-medium xl:text-base md:text-sm text-xs">
                    {item.message}
                  </p>
                </div>

                {/* File box if present */}
                {item.file && (
                  <div className="ml-11 bg-white border-[#0000001A] border-1  shadow-sm rounded-lg flex items-center gap-3 px-4 py-2 w-fit text-sm">
                    <div className="bg-[#FB3748] text-white px-2 py-2 rounded text-xs font-semibold">
                      PDF
                    </div>
                    <span className="text-[#606060] font-medium xl:text-base md:text-sm text-xs">
                      {item.file.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const QuotationDetailsSection = ({ quotationDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Quotation Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className=" col-span-2 ">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.customer_name}
          </span>
        </div>

        <div className=" col-span-1">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Quote ID
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.quotation_id}
          </span>
        </div>
        <div className="col-span-1">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Reference ID
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.refrence}
          </span>
        </div>
        <div className=" ">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Quote Date
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.quotation_date}
          </span>
        </div>
        <div className="">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Expiry Date
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.expiry_date}
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomerDetails = ({ quotationDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Customer Details
      </h2>

      <div className="grid grid-cols-1 space-y-4">
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer Name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.customer_name}
          </span>
        </div>
        <div className="">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.email}
          </span>
        </div>
        <div className="">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {quotationDetails?.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const RelatedDocuments = ({ quotationDetails }) => {
  const [files, setFile] = useState(
    quotationDetails?.quotation_url &&
      quotationDetails?.quotation_url[0].invoice_url != "N/A"
      ? (quotationDetails?.quotation_url || []).map((item) => {
          return {
            name: item?.invoice_url || "",
            related_doc_url: item?.invoice_url || "",
          };
        })
      : []
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
          Related Documents
        </h2>
        <button
          onClick={downloadAllFiles}
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer bg-[#0033661A] text-indigo-800 px-4 py-2 rounded-lg text-base font-medium hover:bg-[#0016661a] transition"
        >
          <Download className="w-4 h-4" />
          Download all
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 mb-4 max-h-[250px] overflow-auto">
        {(files && files.length) > 0 ? (
          <ShowUploadedFiles files={files} />
        ) : (
          <div className=" w-full flex flex-col items-center gap-4">
            <div className="text-[#2543B1] bg-[#0033661A] rounded-lg p-2 justify-center flex text-sm">
              <FileText className="h-8 w-8" />
            </div>{" "}
            <p className="text-[#606060] text-sm">No documents attached</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TermsAndConditions = ({ quotationDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Terms and conditions
      </h2>
      <p className="text-xs text-[#8E8E8E] mt-2">
        {quotationDetails?.list_toc[0]?.terms_of_service}
      </p>
    </div>
  );
};

const AmountPieChart = ({ className }) => {
  const totalAmount = 1000000;
  const amountPaid = 600000;
  const amountLeft = totalAmount - amountPaid;

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
          <span className=" ">₹ 10,00,000</span>
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
            <span>₹ 6,00,0700</span>
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
            <span>₹ 4,00,000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const UpdateTimeLineModal = ({ isOpen, setisOpen }) => {
  const [isConfirm, setisConfirm] = useState(false);
  const [files, setfiles] = useState(null);
  const [balance, setbalance] = useState("");

  const handleSubmit = () => {
    setisConfirm(true);
  };

  const handelClose = () => {
    setisConfirm(false);
    setisOpen(false);
    setfiles(null);
  };

  if (!isOpen) return null;

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
                value={balance}
                setvalue={setbalance}
                label={""}
                required={true}
                placeholder={"Enter Balance"}
              />
            </div>
          </div>

          {/* remarks  */}
          <div>
            <InputField
              label={"Remarks"}
              placeholder={"Enter remarks related to payment"}
            />
          </div>

          {/* upload document  */}
          <UploadDocuments />

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

const UploadDocuments = () => {
  const [files, setfiles] = useState(null);

  return (
    <div className=" outline-[#00000029] rounded-lg px-3 py-5 border-2 border-[#00000033] border-dashed">
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
