import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { CompanyContext } from "../company/CompanyContext";
import { validateFields } from "../../utils/checkFormValidation";
import { UserContext } from "../userContext/UserContext";

export const DocumentContext = createContext();

const initialDocumentState = {
  documentName: "",
  documentUrl: [
    {
      related_doc_name: "Vendor Agreement PDF",
      related_doc_url: "https://example.com/documents/vendor-agreement.pdf",
      doc_size: "",
    },
  ],
  documentCategory: "",
  documentTags: [{ tag_name: "" }, { tag_name: "" }],
};

const documentReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "ADD_TAG":
      return {
        ...state,
        documentTags: [...state.documentTags, { tag_name: action.tag }],
      };

    case "REMOVE_TAG":
      return {
        ...state,
        documentTags: state.documentTags.filter(
          (tag) => tag.tag_name !== action.tag
        ),
      };

    case "RESET":
      return initialDocumentState;

    default:
      return state;
  }
};

export const DocumentContextProvider = ({ children }) => {
  const [allUploadedDocuments, setallUploadedDocuments] = useState([]);
  const [documentForm, documentFormdispatch] = useReducer(
    documentReducer,
    initialDocumentState
  );
  const [allDocumentList, setallDocumentList] = useState(null);
  const { companyDetails } = useContext(CompanyContext);
  const { userDetails } = useContext(UserContext);

  //create document
  const createDocument = useCallback(
    async (setisLoading = () => {}) => {
      const validationErrors = validateFields(documentForm);

      if (Object.keys(validationErrors).length > 0) {
        console.log(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      if (!companyDetails) {
        showToast("Company details not found", 1);
        return;
      }
      if (!companyDetails.company_id) {
        showToast("Company details not found", 1);
        return;
      }

      const userId =  userDetails?.userId;
      if (!userId) {
        showToast("User ID not found", 1);
        return;
      }

      console.log({
        userId: userId,
        companyId: companyDetails.company_id,
        uploadedBy:userDetails?.username || "Unkown",
        ...documentForm,
      });

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/add-documents/`,
          {
            userId: userId,
            companyId: companyDetails.company_id,
            uploadedBy:userDetails?.username || "",
            ...documentForm,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // reset form data
        documentFormdispatch({
          type: "RESET",
        });
        showToast("Document added.");
        window.location.reload();
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message ||
            error.message ||
            "Somthing went wrong. Please try again",
          1
        );
      } finally {
        setisLoading(false);
      }
    },
    [documentForm , userDetails]
  );

  // get all documents of a company with comanpany id
  const getAllDocumentList = useCallback(
    async (setisLoading = () => {}) => {
    if (!companyDetails) {
      showToast("No company details not found", 1);
      return;
    }
    if (!companyDetails.company_id) {
      showToast("Company ID not found", 1);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Token not found", 1);
      return;
    }

    try {
      setisLoading(true);
      const res = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/get-list-documents/`,
        {
          companyId: `${companyDetails.company_id}`,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // console.log(res);
      if (res.data?.status.toLowerCase() !== "success") {
        showToast("Somthing went wrong. Please try again", 1);
        return;
      }

      setallDocumentList(res.data.data);
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.message ||
          error.message ||
          "Somthing went wrong. Please try again",
        1
      );
    } finally {
      setisLoading(false);
    }
  }, [userDetails]);

  //document list meta data
  const totalDocument =
    allDocumentList?.reduce(
      (sum, item) => sum + (item.document_url?.length || 0),
      0
    ) || 0;
  const uploadedDocumentThisMonth =
    allDocumentList?.reduce((sum, item) => {
      const d = new Date(parseInt(item.uploaded_on) * 1000);
      console.log(d, parseInt(item.uploaded_on));
      return d.getMonth() === new Date().getMonth() &&
        d.getFullYear() === new Date().getFullYear()
        ? sum + (item.document_url?.length || 0)
        : sum;
    }, 0) || 0;
  const totalSize =
    allDocumentList?.reduce(
      (sum, item) =>
        sum +
        (item.document_url?.reduce(
          (s, doc) => s + (Number(doc.doc_size) || 0),
          0
        ) || 0),
      0
    ) || 0;
  const totalCategory =
    new Set(allDocumentList?.map((item) => item.document_category)).size || 0;

  //reset data on navigate
  useEffect(() => {
    if (window.location.pathname.toLowerCase() !== "documents") {
      documentFormdispatch({ type: "RESET" });
      setallUploadedDocuments([]);
    }
  }, []);

  // console.log(documentForm);

  return (
    <DocumentContext.Provider
      value={{
        allUploadedDocuments,
        setallUploadedDocuments,
        documentFormdispatch,
        createDocument,
        getAllDocumentList,
        allDocumentList,
        totalDocument,
        uploadedDocumentThisMonth,
        totalSize,
        totalCategory,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
