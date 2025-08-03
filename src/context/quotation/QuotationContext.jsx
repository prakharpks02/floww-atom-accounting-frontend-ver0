import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import { validateFields } from "../../utils/checkFormValidation";
import { useNavigate } from "react-router-dom";
import {
  FilterDataOnAmount,
  FilterDataOnDate,
  FilterDataOnFinancialYear,
  FilterDataOnItemName,
  FilterOnMonthRange,
  SortDataOnAmount,
  SortDataOnDate,
  SortDataOnQuantity,
} from "../../utils/filterData";
import { UserContext } from "../userContext/UserContext";
import { uploadFile } from "../../utils/uploadFiles";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";

export const QuotationContext = createContext();

// intial Quotation order state
export const initialQuotationState = {
  listItems: [
    {
      item_name: "",
      item_description: "",
      discount: "",
      quantity: "",
      hsn_code: "",
      unit_price: "",
      base_amount: "",
      gst_amount: "",
      gross_amount: "",
    },
  ],
  listToc: [
    {
      terms_of_service: "N/A",
    },
  ],
  listStatus: [
    {
      status: "N/A",
      timestamp: "N/A",
      remark: "N/A",
    },
  ],
  customerId: "",
  notes: "N/A",
  contactNo: "",
  email: "",
  quotationUrl: [
    {
      invoice_url: "N/A",
    },
  ],
  quotationStatus: "N/A",
  quotationNumber: "N/A",
  refrence: "",
  subject: "",
  projectName: "",
  customerName: "",
  quotationDate: "",
  expiryDate: "",
  subtotalAmount: "",
  discountAmount: "",
  totalAmount: "",
  tdsAmount: "",
  adjustmentAmount: false,
  tdsReason: "",
};

// quotation order reducer
export const QuotationReducer = (state, action) => {
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

    case "REMOVE_ITEM":
      return {
        ...state,
        listItems: state.listItems.filter((_, index) => index !== action.index),
      };

    case "UPDATE_ITEM_FIELD":
      const updatedItems = [...state.listItems];
      updatedItems[action.index][action.field] = action.value;
      return {
        ...state,
        listItems: updatedItems,
      };

    case "RESET":
      return initialQuotationState;

    default:
      return state;
  }
};

export const QuotationContextProvider = ({ children }) => {
  const [quotationList, setquotationList] = useState(null);
  const [quotationDetails, setquotationDetails] = useState(null);
  const { companyDetails } = useContext(CompanyContext);
  const [selectedQuotationItems, setselectedQuotationItems] = useState([
    {
      item_name: "",
      item_description: "",
      discount: "",
      quantity: "",
      hsn_code: "",
      unit_price: "",
      base_amount: "",
      gst_amount: "",
      gross_amount: "",
    },
  ]);
  //create quotation reducer
  const [createQuotationForm, createQuotationFormDispatch] = useReducer(
    QuotationReducer,
    initialQuotationState
  );
  const { userDetails } = useContext(UserContext);

  const navigate = useNavigate();

  //get quotation list
  const getQuotationList = useCallback(
    async (setisLoading = () => {}) => {
      if (!companyDetails) {
        showToast("Company details not found", 1);
        return;
      }
      if (!companyDetails.company_id) {
        showToast("Company details not found", 1);
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
          }/api/accounting/get-list-quotation/?companyId=${
            companyDetails.company_id
          }`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        // console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          return;
        }

        setquotationList(res.data.data);
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

  // get quotation details
  const getQuotationDetails = useCallback(
    async (quotid, setisLoading = () => {}) => {
      if (!quotid) {
        showToast("Please provide quotation id", 1);
        return;
      }

      if (quotid === "new") {
        setquotationDetails(null);
        setisLoading(false);
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
          }/api/accounting/get-quotation-details/?quotationId=${quotid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        setquotationDetails(res.data?.data);
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

  // create quotation order
  const createQuotation = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      //check only for form submision
      if (
        createQuotationForm.quotationUrl[0]?.invoice_url.toLowerCase() != "n/a"
      ) {
        const validationErrors = validateFields(createQuotationForm);

        if (Object.keys(validationErrors).length > 0) {
          console.log(validationErrors);
          showToast("All fields are required", 1);
          throw new Error("All fields are required");
        }
      }

      if (!companyDetails) {
        showToast("Company details not found", 1);
        throw new Error("Company details not found");
      }
      if (!companyDetails.company_id) {
        showToast("Company ID not found", 1);
        throw new Error("Company ID not found");
      }

      // const userId =userDetails?.userId;
      // if (!userId) {
      //   showToast("User ID not found", 1);
      //   throw new Error("User ID not found");
      // }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);

        // upload documens
        if (
          createQuotationForm.quotationUrl[0]?.invoice_url.toLowerCase() !=
          "n/a"
        ) {
          for (let i = 0; i < createQuotationForm.quotationUrl.length; i++) {
            const file = createQuotationForm.quotationUrl[i];
            const res = await uploadFile(file.fileName, file.fileBlob, token);
            console.log(res);
            createQuotationForm.quotationUrl[i] = { invoice_url: res.doc_url };
          }
        }

        console.log("file uploaded");

        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/create-quotation/`,
          {
            // userId: userId,
            companyId: companyDetails.company_id,
            ...createQuotationForm,
            quotationDate:
              createQuotationForm.quotationDate ||
              formatISODateToDDMMYYYY(Date.now() / 1000),
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        // console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          throw new Error("User ID not found");
        }

        // reset form data
        createQuotationFormDispatch({
          type: "RESET",
        });
        showToast("Quotation created.");
        navigate(`/quotation/quotationList`);
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
    [createQuotationForm, userDetails]
  );

  //update quotation order
  const updateQuotation = useCallback(
    async (quotationid, setisLoading = () => {}) => {
      if (!quotationid) {
        showToast("Quotation order ID not found", 1);
        throw new Error("Quotation order ID not found");
      }

      const validationErrors = validateFields(createQuotationForm);

      if (Object.keys(validationErrors).length > 0) {
        console.log(validationErrors);
        showToast("All fields are required", 1);
        throw new Error("All fields are required");
      }

      if (!companyDetails) {
        showToast("Company details not found", 1);
        throw new Error("Company details not found");
      }
      if (!companyDetails.company_id) {
        showToast("Company ID not found", 1);
        throw new Error("Company ID not found");
      }

      // const userId = userDetails?.userId;
      // if (!userId) {
      //   showToast("User ID not found", 1);
      //   throw new Error("User ID not found");
      // }

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
          }/api/accounting/update-quotation-details/`,
          {
            // userId: userId,
            quotationId: quotationid,
            companyId: companyDetails.company_id,
            ...createQuotationForm,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        // console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          throw new Error("Somthing went wrong. Please try again");
        }

        // reset form data
        createQuotationFormDispatch({
          type: "RESET",
        });
        showToast("Quotation updated.");
        navigate(`/quotation/quotationDetails/${quotationid}`);
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
    [createQuotationForm, userDetails]
  );

  //handel multiple filter
  const handelMultipleFilter = async ({
    amountFilter = "",
    itemName = "",
    dateFilter = "",
    financialYearFilter = "",
    amountSort = "",
    dateSort = "",
    quantitySort = "",
    startMonth = "",
    endMonth = "",
  }) => {
    if (!quotationList) return;

    let result = [];

    // console.log(dateFilter);

    if (amountFilter)
      result = await FilterDataOnAmount(amountFilter, quotationList);
    if (itemName) result = await FilterDataOnItemName(itemName, result);
    if (dateFilter) result = await FilterDataOnDate(dateFilter, result);
    if (financialYearFilter)
      result = await FilterDataOnFinancialYear(financialYearFilter, result);
    if (startMonth && endMonth)
      result = await FilterOnMonthRange(startMonth, endMonth, result);
    if (amountSort) result = await SortDataOnAmount(amountSort, result);
    if (dateSort) result = await SortDataOnDate(dateSort, result);
    if (quantitySort) result = await SortDataOnQuantity(quantitySort, result);

    return result;
  };

  // search on quotation list
  const searchQuotation = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredQuoation = quotationList
        .map((quotation) => {
          const quotationIdMatch = quotation.quotation_id
            ?.toLowerCase()
            .includes(query);
          const customerMatch = quotation.contact_person
            ?.toLowerCase()
            .includes(query);
          const emailMatch = quotation.email?.toLowerCase().includes(query);
          const statusMatch = quotation.status?.toLowerCase() === query;
          const dateMatch = quotation.quotation_date
            ?.toLowerCase()
            .includes(query);

          // filter list_items first
          const filteredItems = quotation.list_items.filter((item) => {
            const itemNameMatch = item.item_name?.toLowerCase().includes(query);
            const amountMatch = item.gross_amount?.toString() === query;
            const quantityMatch = item.quantity?.toString() === query;
            return itemNameMatch || amountMatch || quantityMatch;
          });

          // If quotation level fields match OR list_items have match
          const quotationLevelMatch =
            quotationIdMatch ||
            customerMatch ||
            emailMatch ||
            statusMatch ||
            dateMatch;

          if (quotationLevelMatch || filteredItems.length > 0) {
            return {
              ...quotation,
              list_items:
                filteredItems.length > 0 ? filteredItems : quotation.list_items,
            };
          }

          return null;
        })
        .filter((quotation) => quotation !== null); // remove nulls

      return filteredQuoation;
    },
    [quotationList, userDetails]
  );

  console.log(createQuotationForm);

  return (
    <QuotationContext.Provider
      value={{
        quotationList,
        getQuotationList,
        getQuotationDetails,
        quotationDetails,
        createQuotationForm,
        createQuotationFormDispatch,
        createQuotation,
        updateQuotation,
        searchQuotation,
        handelMultipleFilter,
        selectedQuotationItems,
        setselectedQuotationItems,
      }}
    >
      {children}
    </QuotationContext.Provider>
  );
};
