import {
  Archive,
  Download,
  FileText,
  Loader2,
  Shapes,
  Upload,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { showToast } from "../../utils/showToast";
import { DocumentContext } from "../../context/document/DocumentContext";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { downloadFile } from "../../utils/downloadFile";

export const DocumentRepo = () => {
  const [isModalOpen, setisModalOpen] = useState(false);
  const [tempAllDocumentList, settempAllDocumentList] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const { allDocumentList, getAllDocumentList } = useContext(DocumentContext);

  useEffect(() => {
    getAllDocumentList(setisLoading);
  }, []);

  useEffect(() => {
    settempAllDocumentList(allDocumentList);
  }, [allDocumentList]);

  if (isLoading) {
    return (
      <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
        <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
      </div>
    );
  }

  console.log(tempAllDocumentList);

  return (
    <>
      <ToastContainer />
      <UpdateDocumentModal
        setisDocumentLoading={setisLoading}
        isOpen={isModalOpen}
        setisOpen={setisModalOpen}
      />

      <div className="p-6 md:px-4 xl:px-6 2xl:px-8 space-y-5 ">
        {/* header  */}
        <div className="">
          <div className="flex justify-between items-end mb-1">
            <div>
              <h1 className="2xl:text-4xl xl:text-3xl lg:text-2xl md:text-xl text-lg font-semibold text-[#333333]">
                PUR Office Equipment Purchase
              </h1>

              <p className=" text-[#A4A4A4] font-medium  xl:text-base md:text-sm text-xs">
                Store and manage your business documents
              </p>
            </div>
            <div className=" flex gap-3 w-fit">
              <button
                onClick={() => {
                  setisModalOpen(true);
                }}
                className="px-4 py-3 flex items-center justify-center gap-2 font-medium xl:text-base md:text-sm text-xs bg-[#2543B1] text-white rounded-xl hover:bg-[#2725b1] cursor-pointer transition"
              >
                <Upload className="w-5 h-5" /> Upload documents
              </button>
            </div>
          </div>
        </div>

        {/* summary section  */}
        <SummarySection />

        {/* upload documents  */}
        {/* <div className="p-4 2xl:rounded-2xl rounded-xl border-2 border-[#0000001A]">
          <UploadDocuments />
        </div> */}

        {/* DocumentLibrery */}
        <DocumentLibrery tempAllDocumentList={tempAllDocumentList} />
      </div>
    </>
  );
};

const UploadDocuments = ({ isModal, prevFiles = [] }) => {
  const [files, setfiles] = useState([...prevFiles]);
  const { setallUploadedDocuments, documentFormdispatch } =
    useContext(DocumentContext);
  useEffect(() => {
    setallUploadedDocuments(files);

    //update form
    const modifiedArray = (files || []).map((file) => {
      return {
        fileBlob: file || "N/A",
        fileName: file.name || "N/A",
        related_doc_name: file.name || "N/A",
        related_doc_url: file.name || "N/A",
        doc_size: ((file.size || 0) / (1024 * 1024)).toFixed(2),
      };
    });
    // documentFormdispatch({
    //   type: "UPDATE_FIELD",
    //   field: "documentUrl",
    //   value: modifiedArray,
    // });
    documentFormdispatch({
      type: "UPDATE_FIELD",
      field: "documentUrl",
      value: modifiedArray,
    });
  }, [files]);

  return (
    <div className=" outline-[#00000029] rounded-lg p-3 border-2 border-[#00000033] border-dashed">
      {files && files.length > 0 && (
        <div className=" flex flex-col items-center space-y-6">
          <ShowUploadedFiles files={files} setfiles={setfiles} />
          {isModal && (
            <label
              htmlFor="upload-document-repo"
              className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
            >
              Choose files
            </label>
          )}
        </div>
      )}

      {(!files || files.length == 0) && (
        <label
          tabIndex={0}
          htmlFor="upload-document-repo"
          className="flex flex-col items-center cursor-pointer mt-5"
        >
          <Upload className=" w-10 h-8 text-[#000000] mb-3" />
          <p className="font-medium xl:text-base md:text-sm mb-1">
            Upload Documents
          </p>
          <p className="text-[#00000080] text-xs ">
            Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
          </p>
        </label>
      )}
      {!isModal && (
        <div className=" flex flex-col gap-2 items-center my-5">
          <label
            htmlFor="upload-document-repo"
            className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
          >
            Choose files
          </label>
          <p className="text-[#00000080] text-xs ">
            Supported formats: PDF, DOC, XLS, JPG, PNG, ZIP (Max 25MB per file)
          </p>
        </div>
      )}

      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png, .doc, .docx, .xlsx, .zip"
        id="upload-document-repo"
        multiple
        onChange={(e) => {
          const maxSizeMB = 25;
          const validFiles = [];
          const invalidFiles = [];

          const selectedFiles = Array.from(e.target.files);

          selectedFiles.forEach((file) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
              showToast(`"${file.name}" is too large. Max size is 25MB.`, 1);
            }
          });

          if (validFiles.length + files.length > 20) {
            showToast("Maximum 20 total files can be upload at a time", 1);
            return;
          }

          // Do something with the valid files (e.g. store them in state)
          // console.log("Valid files:", validFiles);
          setfiles((prev) => {
            const updated = [...prev, ...validFiles];
            // console.log("Updated files:", updated);
            return updated;
          });

          // Clear the input to allow re-uploading the same files
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};

const DocumentLibrery = ({ className, tempAllDocumentList }) => {
  return (
    <div
      className={`p-4 2xl:rounded-2xl rounded-xl border-2 border-[#0000001A] ${className}`}
    >
      <h2 className=" mb-6 font-semibold text-[#4A4A4A] 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg  ">
        Document Library
      </h2>

      {/* show all documents  */}
      <div className="grid lg:gap-6 gap-2 md:grid-cols-2">
        {tempAllDocumentList?.map((file, idx) => {
          return file.document_url?.map((doc, index) => {
            return (
              <DocumentCard key={`${idx}-${index}`} document={file} doc={doc} />
            );
          });
        })}
      </div>
    </div>
  );
};

const SummarySection = ({ className }) => {
  const { totalDocument, uploadedDocumentThisMonth, totalSize, totalCategory } =
    useContext(DocumentContext);
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ${className}`}
    >
      <SummaryCard
        icon={FileText}
        iconColor="text-[#2543B1]"
        count={totalDocument}
        label="Total Documents"
      />
      <SummaryCard
        icon={Upload}
        iconColor="text-[#2ECC71]"
        count={uploadedDocumentThisMonth}
        label="Upload this month"
      />
      <SummaryCard
        icon={Archive}
        iconColor="text-[#2543B1]"
        count={`${totalSize.toFixed(2)} MB`}
        label="Storage Used"
      />
      <SummaryCard
        icon={Shapes}
        iconColor="text-[#FB3748]"
        count={totalCategory}
        label="Categories"
      />
    </div>
  );
};

const DocumentCard = ({ document = {}, doc = {} }) => {
  const badgeColors = {
    "Financial Reports": "bg-[#2ECC711A] text-[#2ECC71]",
    Invoices: "bg-[#0033661A] text-[#2543B1]",
    "Legal Documents": "bg-[#F6E3FF] text-[#BB27FF]",
  };
  const [isDownloading, setisDownloading] = useState(false);

  return (
    <>
      <div className="border-2 border-[#0000001A] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center gap-5">
          <FileText className="text-blue-800 w-6 h-8" />
          <div className=" w-[95%] overflow-auto hide-scrollbar">
            <h3 className="font-medium text-[#333333] 2xl:text-xl xl:text-lg lg:text-base text-sm ">
              {document.document_name}
            </h3>
            <p className="text-sm 2xl:text-base  text-[#777777]">
              {doc.doc_size}
            </p>
          </div>
        </div>

        <span
          className={`w-fit px-4 mb-3 py-2 text-sm rounded-2xl font-normal ${
            badgeColors[document.document_category] ||
            "bg-gray-200 text-gray-800"
          }`}
        >
          {document.document_category}
        </span>

        <div className="flex flex-wrap gap-2">
          {document?.document_tags?.map((tag, ind) => (
            <span
              key={ind}
              className="bg-[#E8E8E8] px-4 py-2 text-sm rounded-lg text-[#4A4A4A]"
            >
              {tag?.tag_name}
            </span>
          ))}
        </div>

        <p className="text-sm text-[#777777]">
          Uploaded:{" "}
          {formatISODateToDDMMYYYY(Number(document?.uploaded_on) || 0)}
        </p>
        <p className="text-sm text-[#777777]">
          By: {document.uploaded_by || document.user_id}
        </p>

        <div className="flex gap-2">
          {/* <button className="flex-1 cursor-pointer hover:bg-gray-50 transition border-1 border-[#0000001A] px-4 py-2 rounded-lg text-sm text-[#4A4A4A]">
                View
              </button> */}
          <button
            disabled={isDownloading}
            onClick={async (e) => {
              e.preventDefault();
              try {
                setisDownloading(true);
                await downloadFile(doc.related_doc_url, doc.related_doc_name);
              } catch (error) {
                console.log(error);
              } finally {
                setisDownloading(false);
              }
            }}
            aria-label="download document"
            className="w-full px-3 py-2 cursor-pointer disabled:cursor-wait transition rounded-lg border-1 border-[#0000001A] text-gray-800 "
          >
            {isDownloading ? (
              <Loader2 className=" mx-auto w-5 animate-spin" />
            ) : (
              <>
                Download
                <Download className="w-4 h-4 ml-2 -translate-y-0.5 inline-block hover:bg-gray-50 text-[#4A4A4A]" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const SummaryCard = ({ icon: Icon, iconColor, count, label }) => {
  return (
    <div className="border-2 border-[#0000001A] rounded-xl py-4 lg:px-6 px-3 flex flex-col items-center justify-center gap-2">
      <Icon className={`lg:w-8 w-5 lg:h-8 h-5 ${iconColor}`} />
      <span className="lg:text-xl md:text-base text-sm font-medium ">
        {count}
      </span>
      <span className="text-[#8E8E8E] lg:text-sm text-xs font-medium text-center">
        {label}
      </span>
    </div>
  );
};

const UpdateDocumentModal = ({ isOpen, setisOpen, setisDocumentLoading }) => {
  const [title, settitle] = useState("");
  const [category, setcategory] = useState("");
  const [tag, settag] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const {
    allUploadedDocuments,
    documentFormdispatch,
    createDocument,
    getAllDocumentList,
  } = useContext(DocumentContext);

  const handelClose = () => {
    documentFormdispatch({
      type: "RESET",
    });
    setisOpen(false);
  };

  useEffect(() => {
    documentFormdispatch({
      type: "UPDATE_FIELD",
      field: "documentName",
      value: title,
    });
  }, [title]);

  useEffect(() => {
    documentFormdispatch({
      type: "UPDATE_FIELD",
      field: "documentCategory",
      value: category,
    });
  }, [category]);

  useEffect(() => {
    documentFormdispatch({
      type: "UPDATE_FIELD",
      field: "documentTags",
      value: (tag || "")?.split(",").map((elem) => {
        return {
          tag_name: elem?.trim() || "",
        };
      }),
    });
  }, [tag]);

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto p-5">
        <div className="w-full max-w-md mx-auto my-5 bg-white rounded-xl shadow-lg p-6 space-y-5 animate-slideDown">
          {/* header  */}
          <div className="">
            <h2 className=" mb-3 2xl:text-3xl xl:text-2xl lg:text-xl md:text-lg text-base font-semibold">
              Add a Document
            </h2>
            <p className=" text-[#777777] font-medium xl:text-base md:text-sm text-xs">
              fill necessary information to add
            </p>
          </div>

          {/* Document Title  */}
          <div>
            <InputField
              value={title}
              setvalue={settitle}
              label={"Document Title"}
              placeholder={"Enter a title"}
            />
          </div>

          {/* Category  */}
          <div>
            <InputField
              value={category}
              setvalue={setcategory}
              label={"Category"}
              placeholder={"Enter a category"}
            />
          </div>

          {/* Tags  */}
          <div>
            <InputField
              value={tag}
              setvalue={settag}
              label={"Tags"}
              placeholder={"Enter tags"}
            />
          </div>

          {/* upload document  */}
          <UploadDocuments isModal={true} prevFiles={allUploadedDocuments} />

          {/* buttons  */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <button
              onClick={handelClose}
              className="col-span-1 py-2 border-2 border-[#3333331A] rounded-xl hover:bg-gray-100 transition cursor-pointer text-[#777777] "
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              aria-label="Add Member"
              onClick={async () => {
                try {
                  await createDocument(setisLoading);
                  await getAllDocumentList(setisDocumentLoading);
                  setisOpen(false);
                } catch (error) {
                  console.log(error);
                }
              }}
              className=" col-span-1 cursor-pointer flex items-center justify-center px-3 lg:px-5 py-1 lg:py-3 bg-[#2543B1] transition hover:bg-blue-900 border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
            >
              {isLoading ? (
                <Loader2 className=" animate-spin w-5 h-5 text-white" />
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
