import {
  BadgeCheck,
  Building2,
  Download,
  Edit,
  FileText,
  Loader2,
  Mail,
  MapPin,
  PencilLine,
  Phone,
  Upload,
  UserCircle,
  UserCircle2,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { downloadAsZip } from "../../utils/downloadAsZip";
import { showToast } from "../../utils/showToast";
import { CustomerContext } from "../../context/customer/customerContext";
import { ToastContainer } from "react-toastify";

export const CustomerDetails = () => {
  const navigate = useNavigate();
  const { customerid } = useParams();
  return (
    <>
      <ToastContainer />
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
        {/* header  */}
        <div className=" mb-6">
          <div className="flex justify-between items-end mb-1">
            <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
              CUS ABC Corporation Account
            </h1>
            <div className=" flex gap-3 w-fit">
              <button
                onClick={() => {
                  navigate(`/customer/addCustomer/${customerid}`);
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
              >
                <Edit className="w-5 h-5" /> Edit Details
              </button>
              {/* <button
                onClick={() => {
                  navigate("/Customer/editCustomerEntry");
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#0033661A] text-[#2543B1] rounded-xl hover:bg-[#00336626] cursor-pointer transition"
              >
                <Upload className="w-5 h-5" /> Share
              </button> */}
            </div>
          </div>

          {/* <div className="mb-8  flex justify-between items-center  xl:text-base md:text-sm  text-xs">
            <p className=" text-[#A4A4A4] font-medium ">Assigned by: Admin</p>
          </div> */}
        </div>

        {/* customer info  */}
        <AllDetails />
      </div>
    </>
  );
};

const AllDetails = ({ className }) => {
  const { customerDetails, getCustomerDetails } = useContext(CustomerContext);
  const { customerid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  const { pathname } = useLocation();
  useEffect(() => {
    getCustomerDetails(customerid, setisLoading);
  }, []);

  console.log(customerDetails);

  if (isLoading || !customerDetails) {
    return (
      <div className=" py-8 px-3 flex justify-center">
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  return (
    <div className={` grid grid-cols-2 gap-4  ${className}`}>
      <CustomerDetailsSection customerDetails={customerDetails} />
      <OtherDetails customerDetails={customerDetails} />
      <CustomerAddressDetails customerDetails={customerDetails} />
      <ContactPersonDetails customerDetails={customerDetails} />
      <RelatedDocuments
        className={"col-span-2"}
        customerDetails={customerDetails}
      />
      <RemarkSection
        className={"col-span-2"}
        customerDetails={customerDetails}
      />
    </div>
  );
};

const CustomerDetailsSection = ({ customerDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Customer Basic Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer ID
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.customer_id}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer name
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.customer_name}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Display name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.display_name}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email address
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.email}
          </span>
        </div>
        <div className=" col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer Type
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.customer_type}
          </span>
        </div>
        <div className="col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Company name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.company_name}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - work
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.work_phone}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - Mobile
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-sm md:text-base text-sm">
            {customerDetails.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const OtherDetails = ({ customerDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Other Details
      </h2>

      <div className="grid grid-cols-2  gap-4">
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Currency
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            INR - Indian Rupee
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Opening Balance
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.opening_balance}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            PAN
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.pan_number}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Payment Terms
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.payment_terms}
          </span>
        </div>
      </div>
    </div>
  );
};

const ContactPersonDetails = ({ customerDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Contact Person Details
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer name
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.contact_person[0]?.contact_person}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email address
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.contact_person[0]?.email}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - work
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.contact_person[0]?.work_phone}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - Mobile
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.contact_person[0]?.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomerAddressDetails = ({ customerDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Customer Address Details
      </h2>
      <div className="grid grid-cols-2  gap-4">
        <div className=" xl:col-span-3 col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Billing address
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.address}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            GST Number
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.gst_number}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone number
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {customerDetails.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const RelatedDocuments = ({ className, customerDetails }) => {
  const [files, setFile] = useState(customerDetails.related_documents);
  const [isZipping, setisZipping] = useState(false);

  const downloadAllFiles = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    const modifiedFiles = [];
    files.forEach((file) => {
      modifiedFiles.push({
        name: file?.related_doc_name,
        url: file?.related_doc_url,
      });
    });

    try {
      setisZipping(true);
      await downloadAsZip(modifiedFiles);
    } catch (error) {
      showToast(error.message, 1);
    } finally {
      setisZipping(false);
    }
  };

  return (
    <div
      className={`w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8] ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A]">
          Related Documents
        </h2>
        <button
          onClick={downloadAllFiles}
          tabIndex={0}
          disabled={isZipping}
          className="flex items-center gap-2 disabled:cursor-not-allowed cursor-pointer bg-[#0033661A] text-indigo-800 px-4 py-2 rounded-lg text-base font-medium hover:bg-[#0016661a] transition"
        >
          {isZipping ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin " />
              zipping...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download all
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2 mb-4 max-h-[250px] overflow-auto">
        {files ? (
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
        <label
          htmlFor="upload-existing-invoice"
          tabIndex={0}
          className="flex items-center gap-2 cursor-pointer bg-[#0033661A] text-indigo-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0016661a] transition"
        >
          <Upload className="w-4 h-4" />
          Upload documents
        </label>
        <input
          multiple
          id="upload-existing-invoice"
          type="file"
          accept=".pdf, .jpg, .png, .doc, .docx"
          className="hidden"
          onChange={handleFileChange}
        />
      </div> */}
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
          className="object-cover w-full h-full"
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
    <div className="max-h-[200px] w-full overflow-auto flex flex-wrap gap-3 pt-5">
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

const RemarkSection = ({ className, customerDetails }) => {
  return (
    <div
      className={`w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8] ${className}`}
    >
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Remarks
      </h2>
      <p className="text-xs text-[#8E8E8E] mt-2">
        {customerDetails.remarks || customerDetails.remark}
      </p>
    </div>
  );
};
