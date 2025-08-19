import {
  AlertCircle,
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
  X,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FileIcon, defaultStyles } from "react-file-icon";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { showToast } from "../../utils/showToast";
import { downloadAsZip } from "../../utils/downloadAsZip";
import { VendorContext } from "../../context/vendor/VendorContext";

export const VendorDetails = () => {
  const navigate = useNavigate();
  const { vendorid } = useParams();
  return (
    <>
      <div className="p-6 md:px-4 xl:px-6 2xl:px-8  ">
        {/* header  */}
        <div className=" mb-6">
          <div className="flex justify-between items-center mb-1">
            <div className="">
              <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                VEN Office Supplies Co Partnership
              </h1>
              <p className="text-[#A4A4A4] 2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium mt-1">
                View details about the vendor
              </p>
            </div>

            <div className=" flex gap-3 w-fit">
              <button
                onClick={() => {
                  navigate(`/vendor/addVendors/${vendorid}`);
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
              >
                <Edit className="w-5 h-5" /> Edit Details
              </button>
              {/* <button
                onClick={() => {
                  navigate("/Vendor/editVendorEntry");
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

        {/* vendor info  */}
        <AllDetails />
      </div>
    </>
  );
};

const AllDetails = ({ className }) => {
  const { getVendorDetails, vendorDetails } = useContext(VendorContext);
  const { vendorid } = useParams();
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    getVendorDetails(vendorid, setisLoading);
  }, []);

  // console.log(vendorDetails);

  if (isLoading || !vendorDetails) {
    return (
      <div className=" py-8 px-3 flex justify-center">
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  if (!vendorDetails) {
    return (
      <div className=" py-8 px-3 flex justify-center">
        <X /> No data found
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-5 ${className}`}>
      <VendorDetailsSection vendorDetails={vendorDetails} />
      <OtherDetails vendorDetails={vendorDetails} />
      <VendorAddressDetails vendorDetails={vendorDetails} />
      <ContactPersonDetails vendorDetails={vendorDetails} />
      <RelatedDocuments
        className={"col-span-2"}
        vendorDetails={vendorDetails}
      />
      <RemarkSection className={"col-span-2"} vendorDetails={vendorDetails} />
    </div>
  );
};

const VendorDetailsSection = ({ vendorDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Vendor Basic Details
      </h2>

      <div className="grid grid-cols-2 gap-4 overflow-x-auto">
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Vendor ID
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.vendor_id}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Vendor name
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.vendor_name}
          </span>
        </div>
        <div className=" col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email address
          </p>
          <span className="text-[#4A4A4A] overflow-x-auto font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.email}
          </span>
        </div>
        <div className="col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Company name
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.company_name}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium  text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - work
          </p>
          <span className="text-[#4A4A4A] overflow-x-auto whitespace-nowrap font-medium xl:text-lg md:text-base text-sm">
            +91 {vendorDetails.work_phone}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium  text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - Mobile
          </p>
          <span className="text-[#4A4A4A] overflow-x-auto whitespace-nowrap font-medium xl:text-lg md:text-base text-sm">
            +91 {vendorDetails.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const OtherDetails = ({ vendorDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Other Details
      </h2>

      <div className="grid grid-cols-2  gap-4 overflow-x-auto">
        <div>
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
            {vendorDetails.opening_balance}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            PAN
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.pan_number}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Payment Terms
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.payment_terms}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            MSME
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.msme_registered_or_not}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            TDS
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.tds}
          </span>
        </div>
      </div>
    </div>
  );
};

const ContactPersonDetails = ({ vendorDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Contact Person Details
      </h2>

      <div className="grid grid-cols-2 gap-4 overflow-x-auto">
        <div>
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Customer name
          </p>
          <span className="text-[#2543B1] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.contact_person[0]?.contact_person}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Email address
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.contact_person[0]?.email}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - work
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.contact_person[0]?.work_phone}
          </span>
        </div>
        <div className="overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone - Mobile
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.contact_person[0]?.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const VendorAddressDetails = ({ vendorDetails }) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Vendor Address Details
      </h2>
      <div className="grid grid-cols-2  gap-4 ">
        <div className=" xl:col-span-3 col-span-2 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Billing address
          </p>
          <span className="text-[#4A4A4A] font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.address}
          </span>
        </div>
        <div className=" overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            GST Number
          </p>
          <span className="text-[#4A4A4A] overflow-auto font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.gst_number}
          </span>
        </div>
        <div className=" col-span-1 overflow-x-auto">
          <p className="font-medium text-[#777777] xl:text-base md:text-sm text-xs ">
            Phone number
          </p>
          <span className="text-[#4A4A4A] overflow-auto font-medium xl:text-lg md:text-base text-sm">
            {vendorDetails.contact_no}
          </span>
        </div>
      </div>
    </div>
  );
};

const RelatedDocuments = ({ className, vendorDetails }) => {
  const [files, setFile] = useState(
    vendorDetails.related_documents?.length > 0 &&
      vendorDetails.related_documents[0]?.related_doc_url != "N/A"
      ? (vendorDetails.related_documents || []).map((item) => {
          return {
            related_doc_name: item.related_doc_name,
            related_doc_url: item.related_doc_url,
            invoice_url: item.related_doc_url,
          };
        })
      : null
  );
  const [isZipping, setisZipping] = useState(false);

  const downloadAllFiles = async (e) => {
    e.preventDefault();

    if (!files || files.length === 0) return;

    try {
      setisZipping(true);
      await downloadAsZip(files, "vendor-related-documents.zip");
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
      <div className="flex justify-between items-center mb-6">
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
          className="object-cover w-full h-full text-xs"
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
                window.open(file?.related_doc_name, "_blank");
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

const RemarkSection = ({ className, vendorDetails }) => {
  return (
    <div
      className={`w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8] ${className}`}
    >
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Remarks
      </h2>
      <p className="text-xs md:text-sm xl:text-base text-[#686868] mt-2">
        {vendorDetails.remarks ||
          vendorDetails.remark ||
          "Valued corporate client with consistent business relationship. Total lifetime value of $45,000. Current outstanding balance: $5,000."}
      </p>
    </div>
  );
};
