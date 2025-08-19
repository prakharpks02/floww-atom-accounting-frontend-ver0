import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  FilterDataOnStatus,
  FilterDataOnAmount,
  SortDataOnAmount,
  SortDataOnDate,
  SortDataOnQuantity,
} from "../../utils/filterData";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { UserContext } from "../userContext/UserContext";
import { uploadFile } from "../../utils/uploadFiles";

export const InvoiceContext = createContext();

// initial invoice state
export const initialInvoiceState = {
  customerId: "",
  customerName: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceDueBy: "",
  invoiceTs: "N/A",
  orderNumber: "N/A",
  invoiceSubject: "",
  salesId: "",
  listItems: [
  ],
  subtotalAmount: "",
  discountAmount: "0",
  taxAmount: "N/A",
  totalAmount: "0",
  listToc: [{ terms_of_service: "N/A" }],
  terms: "N/A",
  notes: "N/A",
  gstNumber: "",
  status: "N/A",
  contactNo: "",
  email: "N/A",
  invoiceUrl: [{ invoice_url: "N/A" }],
  paymentNameList: [
    {
      payment_name: "N/A",
      payment_descriptions: "N/A",
      payment_type: "N/A",
      upi_id: "N/A",
      upi_qr_code_url: "N/A",
      bank_account_number: "N/A",
      bank_account_IFSC: "N/A",
      bank_account_receivers_name: "",
      bank_name: "N/A",
      remarks: "N/A",
    },
  ],
};

// invoice reducer
export const invoiceReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "ADD_ITEM":
      return {
        ...state,
        listItems: [...state.listItems, action.item],
      };

    case "UPDATE_ITEM_FIELD":
      const updatedItems = [...state.listItems];
      updatedItems[action.index][action.field] = action.value;
      return {
        ...state,
        listItems: updatedItems,
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        listItems: state.listItems.filter((_, idx) => idx !== action.index),
      };

    case "UPDATE_BANK":
      const updatedBank = [...state.paymentNameList];
      updatedBank[0][action.field] = action.value;
      return {
        ...state,
        paymentNameList: updatedBank,
      };

    case "RESET":
      return initialInvoiceState;

    default:
      return state;
  }
};

export const InvoiceContextProvider = ({ children }) => {
  //create invoice reducer
  const [AllInvoiceList, setAllInvoiceList] = useState(null);
  const [invoiceDetails, setinvoiceDetails] = useState(null);
  const { pathname } = useLocation();
  const { companyDetails } = useContext(CompanyContext);
  const [createInvoiceForm, createInvoiceDispatch] = useReducer(
    invoiceReducer,
    initialInvoiceState
  );
  const navigate = useNavigate();
  const { userDetails } = useContext(UserContext);

  // create invoice function
  const createInvoice = useCallback(
    async (e, setisLoading = () => {}, type = "create") => {
      e.preventDefault();

      if (type.toLowerCase().includes("create")) {
        const validationErrors = validateFields(createInvoiceForm);

        if (Object.keys(validationErrors).length > 0) {
          console.log(validationErrors);
          showToast("All fields are required ", 1);
          throw new Error("All fields are required");
        }
      }

      if (!companyDetails) {
        throw new Error("No company details found");
      }

      // const userId =  userDetails?.userId;
      // if (!userId) {
      //   showToast("user ID not found", 1);
      //   throw new Error("user ID not found");
      // }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      try {
        setisLoading(true);

        if (createInvoiceForm.invoiceUrl[0]?.fileBlob) {
          for (let i = 0; i < createInvoiceForm.invoiceUrl.length; i++) {
            const file = createInvoiceForm.invoiceUrl[i];
            const res = await uploadFile(file.fileName, file.fileBlob, token);
            console.log(res);
            createInvoiceForm.invoiceUrl[i] = { invoice_url: res.doc_url };
          }

          console.log("file uploaded");
        }

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-invoices/`,
          {
            companyId: companyDetails.company_id,
            // userId: userId,
            ...createInvoiceForm,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          throw new Error("Somthing went wrong. Please try again");
        }

        // reset to initial value
        // createInvoiceDispatch({ type: "RESET" });
        showToast("Invoice created created");
        navigate("/sales/allInvoiceList");
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message ||
            error.message ||
            "Somthing went wrong. Please try again",
          1
        );
        setisLoading(false);
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Somthing went wrong. Please try again"
        );
      } finally {
        setisLoading(false);
      }
    },
    [createInvoiceForm, userDetails]
  );

  //  function to get all invoice list
  const getAllInvoices = useCallback(
    async (setisLoading = () => {}) => {
      if (!companyDetails) {
        showToast("No company details found", 1);
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/get-all-invoices/?companyId=${
            companyDetails.company_id
          }`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          return;
        }

        setAllInvoiceList(res.data.data);
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
    [userDetails]
  );

  // search on invoice list
  const searchInvoice = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredInvoices = AllInvoiceList.map((invoice) => {
        const saleIdMatch = invoice.sales_id?.toLowerCase().includes(query);
        const invoiceNumberMatch = invoice.invoice_number
          ?.toLowerCase()
          .includes(query);
        const DateMatch = invoice.invoice_date?.toLowerCase().includes(query);
        const dueDateMatch = invoice.invoice_due_by?.toLowerCase() === query;
        const customerMatch = invoice.customer_name?.toLowerCase().includes(query);

        // If invoice level fields match OR list_items have match
        const invoiceLevelMatch =
          saleIdMatch ||
          customerMatch ||
          invoiceNumberMatch ||
          DateMatch ||
          dueDateMatch;

        if (invoiceLevelMatch) {
          return {
            ...invoice,
          };
        }

        return null;
      }).filter((inoice) => inoice !== null); // remove nulls

      return filteredInvoices;
    },
    [AllInvoiceList, userDetails]
  );

  // reset the create invoice form to intial value when not in create invoice page
  useEffect(() => {
    !pathname.toLowerCase().includes("/createInvoice") &&
      createInvoiceDispatch({ type: "RESET" });
  }, [pathname]);

  console.log(createInvoiceForm);

  return (
    <InvoiceContext.Provider
      value={{
        createInvoiceForm,
        createInvoiceDispatch,
        createInvoice,
        getAllInvoices,
        AllInvoiceList,
        searchInvoice
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
