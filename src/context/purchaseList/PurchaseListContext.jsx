import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { useLocation, useNavigate } from "react-router-dom";
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

export const PurchaseListContext = createContext();

// intial purchase state
export const initialPurchaseListState = {
  poId: "N/A",
  poNumber: "",
  listItems: [],
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
  paymentTransactionsList: [
    {
      transaction_id: "N/A",
      amount: "0",
      timestamp: Date.now(),
      remark: "Purchase created by admin",
      transaction_url: "N/A",
    },
  ],
  attachments: [
    {
      related_doc_name: "N/A",
      related_doc_url: "N/A",
    },
  ],
  vendorId: "",
  notes: "N/A",
  contactNo: "",
  email: "",
  invoiceNo: "",
  invoiceUrl: "N/A",
  invoiceDate: "N/A",
  invoiceDueBy: "N/A",
  quotationId: "N/A",
  vendorName: "",
  purchaseDate: "",
  createdOn: "N/A",
  status: "",
  gstNumber: "",
  panNumber: "",
  subtotalAmount: "",
  discountAmount: "",
  tdsAmount: "",
  adjustmentAmount: "",
  totalAmount: "",
  tdsReason: "",
};

// purchase reducer
export const PurchaseListReducer = (state, action) => {
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
      return initialPurchaseListState;

    default:
      return state;
  }
};

export const PurchaseListContextProvider = ({ children }) => {
  const [purchaseList, setpurchaseList] = useState(null);
  const [purchaseDetails, setpurchaseDetails] = useState(null);
  //create purchase reducer
  const [createPurchaseListForm, createPurchaseListFormDispatch] = useReducer(
    PurchaseListReducer,
    initialPurchaseListState
  );

  const { companyDetails } = useContext(CompanyContext);
  const { userDetails } = useContext(UserContext);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  //get purchase list
  const getPurchaseList = useCallback(
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
          }/api/accounting/get-list-purchases/?companyId=${
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

        setpurchaseList(res.data.data);
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

  // get purchase details
  const getPurchaseListDetails = useCallback(
    async (purchaseid, setisLoading = () => {}) => {
      if (!purchaseid) {
        showToast("Please provide purchase list id", 1);
        return;
      }

      if (purchaseid === "new") {
        setpurchaseDetails(null);
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
          }/api/accounting/get-purchase-details/?purchaseId=${purchaseid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          return;
        }

        setpurchaseDetails(res.data?.data);
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

  // create purchase list
  const createPurchaseList = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      const validationErrors = validateFields(createPurchaseListForm);

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

      // const userId =userDetails?.userId;
      // if (!userId) {
      //   showToast("User ID not found", 1);
      //   return;
      // }
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }
      try {
        setisLoading(true);

        // upload documens
        for (let i = 0; i < createPurchaseListForm.attachments.length; i++) {
          const file = createPurchaseListForm.attachments[i];
          if (file.fileBlob) {
            const res = await uploadFile(
              file.fileName || `related-doc-${i + 1}`,
              file.fileBlob,
              token
            );
            console.log(res);
            createPurchaseListForm.attachments[i] = {
              related_doc_name: res.file_name,
              related_doc_url: res.doc_url,
            };
          }
        }
        console.log("file uploaded");

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-purchase/`,
          {
            // userId: userId,
            companyId: companyDetails.company_id,
            ...createPurchaseListForm,
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
          return;
        }

        // reset form data
        createPurchaseListFormDispatch({
          type: "RESET",
        });
        showToast("Purchase created.");

        navigate(`/purchase/purchaseList`);
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
    [createPurchaseListForm, userDetails]
  );

  //update purchase
  const updatePurchaseList = useCallback(
    async (purchaseid, setisLoading = () => {}) => {
      if (!purchaseid) {
        showToast("Purchase ID not found", 1);
        return;
      }

      const validationErrors = validateFields(createPurchaseListForm);

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

      // const userId =userDetails?.userId;
      // if (!userId) {
      //   showToast("User ID not found", 1);
      //   return;
      // }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);

        // upload documens
        console.log(createPurchaseListForm.attachments)
        for (let i = 0; i < createPurchaseListForm.attachments.length; i++) {
          const file = createPurchaseListForm.attachments[i];
          if (file.related_doc_url.toLowerCase() === "n/a") {
            const res = await uploadFile(file.fileName, file.fileBlob, token);
            console.log(res);
            createPurchaseListForm.attachments[i] = {
              related_doc_name: res.file_name,
              related_doc_url: res.doc_url,
            };
          }
          console.log("file uploaded");
        }

        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/update-purchase-details/`,
          {
            // userId: userId,
            purchaseId: purchaseid,
            purchaseTs: Date.now(),
            companyId: companyDetails.company_id,
            ...createPurchaseListForm,
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
          return;
        }

        // reset form data
        createPurchaseListFormDispatch({
          type: "RESET",
        });
        showToast("Purchase updated.");
        navigate(`/purchase/purchaseDetails/${purchaseid}`);
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
    [createPurchaseListForm, userDetails]
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
    if (!purchaseList) return;

    let result = [];

    // console.log(dateFilter);

    if (amountFilter)
      result = await FilterDataOnAmount(amountFilter, purchaseList);
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

  // search on purchase list
  const searchPurchase = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredPurchase = purchaseList
        .map((purchase) => {
          const purchaseIdMatch = purchase.purchase_id
            ?.toLowerCase()
            .includes(query);
          const customerMatch = purchase.contact_person
            ?.toLowerCase()
            .includes(query);
          const emailMatch = purchase.email?.toLowerCase().includes(query);
          const statusMatch = purchase.status?.toLowerCase() === query;
          const dateMatch = purchase.purchase_date
            ?.toLowerCase()
            .includes(query);

          // filter list_items first
          const filteredItems = purchase.list_items.filter((item) => {
            const itemNameMatch = item.item_name?.toLowerCase().includes(query);
            const amountMatch = item.gross_amount?.toString() === query;
            const quantityMatch = item.quantity?.toString() === query;
            return itemNameMatch || amountMatch || quantityMatch;
          });

          // If purchase level fields match OR list_items have match
          const purchaseLevelMatch =
            purchaseIdMatch ||
            customerMatch ||
            emailMatch ||
            statusMatch ||
            dateMatch;

          if (purchaseLevelMatch || filteredItems.length > 0) {
            return {
              ...purchase,
              list_items:
                filteredItems.length > 0 ? filteredItems : purchase.list_items,
            };
          }

          return null;
        })
        .filter((purchase) => purchase !== null); // remove nulls

      return filteredPurchase;
    },
    [purchaseList, userDetails]
  );

  useEffect(() => {
    setpurchaseDetails(null);
    !pathname.toLowerCase().includes("/addPurchase") &&
      createPurchaseListFormDispatch({ type: "RESET" });
  }, [pathname]);

  console.log(createPurchaseListForm);

  return (
    <PurchaseListContext.Provider
      value={{
        getPurchaseList,
        purchaseList,
        getPurchaseListDetails,
        purchaseDetails,
        createPurchaseListForm,
        createPurchaseListFormDispatch,
        createPurchaseList,
        updatePurchaseList,
        handelMultipleFilter,
        searchPurchase,
      }}
    >
      {children}
    </PurchaseListContext.Provider>
  );
};
