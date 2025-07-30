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
import { useLocation } from "react-router-dom";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { UserContext } from "../userContext/UserContext";

export const InvoiceContext = createContext();

// initial invoice state
export const initialInvoiceState = {
  customerId: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceDueBy: "",
  invoiceTs: "N/A",
  orderNumber: "",
  invoiceSubject: "",
  salesId: "",
  listItems: [
    {
      item_name: "",
      item_description: "",
      quantity: "",
      hsn_code: "N/A",
      unit_price: "",
      discount: "",
      base_amount: "",
      gst_amount: "",
      gross_amount: "",
    },
  ],
  subtotalAmount: "",
  discountAmount: "",
  taxAmount: "N/A",
  totalAmount: "",
  listToc: [{ terms_of_service: "" }],
  terms: "",
  notes: "",
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
  const {userDetails} = useContext(UserContext)

  // create invoice function
  const createInvoice = useCallback(
    async (e, setisLoading = () => {}, type = "create") => {
      e.preventDefault();

      if (type.toLowerCase().includes("create")) {
        const validationErrors = validateFields(createInvoiceForm);

        if (Object.keys(validationErrors).length > 0) {
          console.log(validationErrors);
          showToast("All fields are required", 1);
          return;
        }
      }

      if (!companyDetails) {
        showToast("No company details found", 1);
        throw new Error("No company details found");
      }

      const userId =  userDetails?.userId;
      if (!userId) {
        showToast("user ID not found", 1);
        throw new Error("user ID not found");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-invoices/`,
          {
            companyId: companyDetails.company_id,
            userId: userId,
            ...createInvoiceForm,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res);
        if (res.data?.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          throw new Error("Somthing went wrong. Please try again");
        }

        // reset to initial value
        // createInvoiceDispatch({ type: "RESET" });
        showToast("Invoice created created");
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message ||
            error.message ||
            "Somthing went wrong. Please try again",
          1
        );
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Somthing went wrong. Please try again"
        );
      } finally {
        setisLoading(false);
      }
    },
    [createInvoiceForm , userDetails]
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

      if (res.data?.status.toLowerCase() !== "success") {
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
  }, [userDetails]);

  // reset the create invoice form to intial value when not in create invoice page
  useEffect(() => {
    !pathname.toLowerCase().includes("/createInvoice") &&
      createInvoiceDispatch({ type: "RESET" });
  }, [pathname]);

  return (
    <InvoiceContext.Provider
      value={{
        createInvoiceForm,
        createInvoiceDispatch,
        createInvoice,
        getAllInvoices,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};
