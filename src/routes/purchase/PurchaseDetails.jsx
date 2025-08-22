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
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { downloadAsZip } from "../../utils/downloadAsZip";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { InputField } from "../../utils/ui/InputField";
import { showToast } from "../../utils/showToast";
import { ItemDetailsTable } from "../../component/ItemDetailsTable";
import { PurchaseListContext } from "../../context/purchaseList/PurchaseListContext";
import { UserContext } from "../../context/userContext/UserContext";
import { CompanyContext } from "../../context/company/CompanyContext";
import axios from "axios";
import { getFileNameFromURL } from "../../utils/getFileNameFromURL";

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

export const PurchaseDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { getPurchaseListDetails, purchaseDetails } =
    useContext(PurchaseListContext);
  const [isLoading, setisLoading] = useState(true);
  const { purchaseid } = useParams();

  useEffect(() => {
    getPurchaseListDetails(purchaseid, setisLoading);
  }, []);

  return (
    <>
      <ToastContainer />
      {isLoading && (
        <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}

      {!isLoading && purchaseDetails && (
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
          {/* header  */}
          <div className=" mb-6">
            <div className="flex justify-between items-end mb-1">
              <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                PUR Office Equipment Purchase
              </h1>
              <div className=" flex gap-3 w-fit">
                <button
                  onClick={() => {
                    navigate(`/purchase/addPurchase/${params.purchaseid}`);
                  }}
                  className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
                >
                  <Edit className="w-5 h-5" /> Edit Details
                </button>
                {/* <button
                onClick={() => {
                  navigate("/Purchase/editPurchaseEntry");
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#0033661A] text-[#2543B1] rounded-xl hover:bg-[#00336626] cursor-pointer transition"
              >
                <Upload className="w-5 h-5" /> Share
              </button> */}
              </div>
            </div>
          </div>

          {/* Purchase info  */}
          <div className=" grid lg:grid-cols-10 grid-cols-1 gap-3">
            <PurchaseInfoLeftPart
              className={"lg:col-span-6"}
              purchaseDetails={purchaseDetails}
            />
            <PurchaseInfoRightPart
              className={"lg:col-span-4"}
              getPurchaseListDetails={getPurchaseListDetails}
              setisPurchaseDetailLoading={setisLoading}
            />
          </div>
        </div>
      )}
    </>
  );
};

const PurchaseInfoLeftPart = ({ className, purchaseDetails }) => {
  return (
    <div className={`flex flex-col gap-5  ${className}`}>
      <PurchaseDetailsSection purchaseDetails={purchaseDetails} />
      <VendorDetails purchaseDetails={purchaseDetails} />
      <ItemDetailsTable dataList={purchaseDetails} />
      <RelatedDocuments purchaseDetails={purchaseDetails} />
      <Description purchaseDetails={purchaseDetails} />
    </div>
  );
};

const PurchaseInfoRightPart = ({ className, getPurchaseListDetails , setisPurchaseDetailLoading }) => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const { getPurchaseTimeLine, purchaseTimeLine } =
    useContext(PurchaseListContext);
  const { purchaseid } = useParams();

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

  const getFilePreview = (url, ext) => {
    if (isImage(ext)) {
      return (
        <img
          src={url || "document image"}
          alt={`preview ${getFileNameFromURL(url)}`}
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
    getPurchaseTimeLine(purchaseid, setisLoading);
  }, []);

  if (isLoading) {
    return (
      <div className={` py-8 px-3 flex justify-center ${className}`}>
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  console.log(purchaseTimeLine);

  return (
    <>
      <UpdateTimeLineModal
        setisTimeLineLoading={setisLoading}
        getPurchaseTimeLine={getPurchaseTimeLine}
        timeLineDetails={purchaseTimeLine}
        isOpen={isModalOpen}
        setisOpen={setisModalOpen}
        getPurchaseListDetails={getPurchaseListDetails}
        setisPurchaseDetailLoading={setisPurchaseDetailLoading}
      />
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
            {Number(purchaseTimeLine.remaining_balance) > 0 && (
              <button
                onClick={() => {
                  setisModalOpen(true);
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs 
          bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition-colors"
              >
                Update Timeline <History className="w-5 h-5 rotate-y-180" />
              </button>
            )}
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
            {[...(purchaseTimeLine?.timeline ?? [])]
              ?.reverse()
              ?.map((item, idx) => {
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
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item?.transaction_url, "_blank");
                          }}
                          className="ml-11 bg-white border-[#0000001A] border-1  shadow-sm rounded-lg flex items-center gap-2 px-2 py-2 w-fit text-sm"
                        >
                          <div
                            className={`text-white ${
                              isImage(ext) ? "w-30" : "w-15"
                            } px-2 py-2 rounded text-xs font-semibold`}
                          >
                            {getFilePreview(item?.transaction_url, ext)}
                          </div>
                          <span className="text-[#606060] font-medium xl:text-sm text-xs">
                            {getFileNameFromURL(item.transaction_url)}
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
  isOpen,
  setisOpen,
  timeLineDetails,
  setisTimeLineLoading,
  getPurchaseTimeLine,
  getPurchaseListDetails,
  setisPurchaseDetailLoading
}) => {
  const [formData, setformData] = useState({
    amount: "",
    remark: "",
    file: null,
  });
  const { updatePurchaseTimeLine } = useContext(PurchaseListContext);
  const [isLoading, setisLoading] = useState(false);

  const { purchaseid } = useParams();
  const handleSubmit = async () => {
    await updateTimeLine();
  };

  const handelClose = () => {
    setisOpen(false);
  };

  const updateTimeLine = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Token not found", 1);
      return;
    }
    if (!formData.amount || !formData.file || !formData.remark) {
      showToast("All fields are required", 1);
      return;
    }

    if (Number(formData.amount) > Number(timeLineDetails?.remaining_balance)) {
      showToast("Amount must less than leftover amount", 1);
      return;
    }

    try {
      await updatePurchaseTimeLine(
        {
          purchaseId: purchaseid,
          amount: formData.amount,
          remark: formData.remark,
          file: formData.file,
        },
        setisLoading
      );
      // await getPurchaseTimeLine(purchaseid, setisTimeLineLoading);
      await getPurchaseListDetails(purchaseid, setisPurchaseDetailLoading);
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
  }, [formData, timeLineDetails]);

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
              )}{" "}
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
        file: files && files.length > 0 ? files[0] : "",
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

const PurchaseDetailsSection = ({ purchaseDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Purchase Details
      </h2>

      <div className="grid grid-cols-2 gap-y-4">
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Purchase ID
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.purchase_id}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Purchase Date
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.purchase_date}
          </span>
        </div>
        {/* <div className=" col-span-1">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Category
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.category}
          </span>
        </div> */}
        <div className=" col-span-1">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Status
          </p>
          <span
            className={`${
              purchaseDetails?.status?.toLowerCase() === "paid"
                ? "text-[#1FC16B]"
                : purchaseDetails?.status?.toLowerCase().includes("partially")
                ? "text-yellow-400"
                : "text-[#FB3748]"
            }  font-medium xl:text-lg md:text-base text-sm`}
          >
            {purchaseDetails?.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const VendorDetails = ({ purchaseDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Vendor Details
      </h2>

      <div className="space-y-5 grid grid-cols-2 text-sm text-gray-600">
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Vendor Name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.vendor_name}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.email}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.contact_no}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            GSTIN Number
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.gst_number}
          </span>
        </div>
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            PAN Number
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {purchaseDetails?.pan_number}
          </span>
        </div>
      </div>
    </div>
  );
};

const RelatedDocuments = ({ purchaseDetails }) => {
  const [isDownloading, setisDownloading] = useState(false);
  const [files, setFile] = useState(
    purchaseDetails?.attachments?.length > 0 &&
      purchaseDetails?.attachments[0]?.related_doc_url != "N/A"
      ? purchaseDetails?.attachments
      : null
  );

  const downloadAllFiles = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    try {
      setisDownloading(true);
      await downloadAsZip(files, "purchase-related-documents.zip");
    } catch (error) {
      showToast(error.message, 1);
    } finally {
      setisDownloading(false);
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
          className="flex items-center gap-2 cursor-pointer bg-[#0033661A] text-indigo-600 px-4 py-2 rounded-lg text-base font-medium hover:bg-[#0016661a] transition"
        >
          {isDownloading ? (
            <>
              <Loader2 className=" mx-auto w-5 animate-spin " /> zipping...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download all
            </>
          )}
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
    </div>
  );
};

const AmountPieChart = ({ className }) => {
  const { purchaseTimeLine } = useContext(PurchaseListContext);

  const data = [
    { name: "Amount Left", value: purchaseTimeLine?.remaining_balance || 0 },
    { name: "Amount Paid", value: purchaseTimeLine?.total_paid || 0 },
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
          <span className=" ">₹ {purchaseTimeLine?.total_amount}</span>
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
            <span>₹ {purchaseTimeLine?.total_paid}</span>
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
              {purchaseTimeLine?.remaining_balance.toLocaleString("en-IN", {
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

const Description = ({ purchaseDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Description
      </h2>
      <p className="text-xs text-[#6d6d6d] mt-2">{purchaseDetails?.notes}</p>
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
        const ext = getFileExtension(file?.related_doc_url);
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
