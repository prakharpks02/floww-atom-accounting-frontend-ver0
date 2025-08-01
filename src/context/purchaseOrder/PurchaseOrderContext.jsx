import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
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
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { uploadFile } from "../../utils/uploadFiles";

export const PurchaseOrderContext = createContext();

// intial purchase order state
export const initialPurchaseOrderState = {
  listItems: [
    {
      item_name: "",
      item_description: "",
      quantity: "",
      discount: "",
      hsn_code: "N/A",
      unit_price: "",
      base_amount: "",
      gst_amount: "",
      gross_amount: "",
    },
  ],
  listToc: [
    {
      terms_of_service: "",
    },
  ],
  listStatus: [
    {
      status: "N/A",
      timestamp: "N/A",
      remark: "N/A",
    },
  ],
  vendorId: "",
  notes: "",
  contactNo: "",
  email: "",
  poUrl: [{ invoice_url: "N/A" }],
  poDate: "",
  gstNumber: "",
  tdsAmount: "",
  tdsReason: "",
  adjustmentAmount: "",
  subTotalAmount: "",
  discountAmount: "",
  totalAmountInWords: "N/A",
  totalAmount: "",
  deliveryDate: "",
  deliveryTerms: "",
  deliveryAddress: "",
  termsAndConditions: "N/A",
  referenceNo: "N/A",
  vendorName: "",
  paymentTerms: "",
  shipmentPreference: "",
  reference: "",
  subject: "",
};

// purchase order reducer
export const PurchaseOrderReducer = (state, action) => {
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
      return initialPurchaseOrderState;

    default:
      return state;
  }
};

export const PurchaseOrderContextProvider = ({ children }) => {
  const [purchaseOrderList, setpurchaseOrderList] = useState(null);
  const [purchaseOrderDetails, setpurchaseOrderDetails] = useState(null);
  const { companyDetails } = useContext(CompanyContext);
  //create purchase order reducer
  const [createPurchaseOrderForm, createPurchaseOrderFormDispatch] = useReducer(
    PurchaseOrderReducer,
    initialPurchaseOrderState
  );
  const { userDetails } = useContext(UserContext);

  const navigate = useNavigate();

  //get purchase order list
  const getPurchaseOrderList = useCallback(
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
          }/api/accounting/get-all-purchase-orders/?companyId=${
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

        setpurchaseOrderList(res.data.data);
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

  // get purchase order details
  const getPurchaseOrderDetails = useCallback(
    async (purchaseid, setisLoading = () => {}) => {
      if (!purchaseid) {
        showToast("Please provide purchase order id", 1);
        return;
      }

      if (purchaseid === "new") {
        setpurchaseOrderList(null);
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
          }/api/accounting/get-purchase-order-details/?poId=${purchaseid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        setpurchaseOrderDetails(res.data?.data);
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

  // create purchase order
  const createPurchaseOrder = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      if (
        createPurchaseOrderForm.poUrl[0]?.invoice_url.toLowerCase() != "n/a"
      ) {
        const validationErrors = validateFields(createPurchaseOrderForm);

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
        showToast("Company id not found", 1);
        throw new Error("Company id not found");
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
        for (let i = 0; i < createPurchaseOrderForm.poUrl.length; i++) {
          const file = createPurchaseOrderForm.poUrl[i];
          const response = await uploadFile(
            file.fileName,
            file.fileBlob,
            token
          );
          console.log(response);
          createPurchaseOrderForm.poUrl[i] = { invoice_url: response.doc_url };
        }

        console.log("file uploaded");

        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/create-purchase-order/`,
          {
            // userId: userId,
            companyId: companyDetails.company_id,
            ...createPurchaseOrderForm,
            poDate:
              createPurchaseOrderForm.poDate ||
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
          throw new Error("Somthing went wrong. Please try again");
        }

        // reset form data

        showToast("Purchase Order created.");
        navigate(`/purchase/OrderList`);
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
    [createPurchaseOrderForm, userDetails]
  );

  //update purchase order
  const updatePurchaseOrder = useCallback(
    async (purchaseid, setisLoading = () => {}) => {
      if (!purchaseid) {
        showToast("Purchase order ID not found", 1);
        return;
      }

      const validationErrors = validateFields(createPurchaseOrderForm);

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
          }/api/accounting/update-purchase-order-details/`,
          {
            // userId: userId,
            poId: purchaseid,
            purchaseTs: Date.now(),
            poNumber: "N/A",
            companyId: companyDetails.company_id,
            ...createPurchaseOrderForm,
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

        showToast("Purchase Order updated.");
        navigate(`/purchase/purchaseOrderDetails/${purchaseid}`);
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
    [createPurchaseOrderForm, userDetails]
  );

  // search on purchase list
  const searchPurchaseOrder = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredPurchaseOrder = purchaseOrderList
        .map((purchaseOrder) => {
          const purchaseOrderIdMatch = purchaseOrder.purchase_id
            ?.toLowerCase()
            .includes(query);
          const customerMatch = purchaseOrder.contact_person
            ?.toLowerCase()
            .includes(query);
          const emailMatch = purchaseOrder.email?.toLowerCase().includes(query);
          const statusMatch = purchaseOrder.status?.toLowerCase() === query;
          const dateMatch = purchaseOrder.purchase_date
            ?.toLowerCase()
            .includes(query);

          // filter list_items first
          const filteredItems = purchaseOrder.list_items.filter((item) => {
            const itemNameMatch = item.item_name?.toLowerCase().includes(query);
            const amountMatch = item.gross_amount?.toString() === query;
            const quantityMatch = item.quantity?.toString() === query;
            return itemNameMatch || amountMatch || quantityMatch;
          });

          // If purchase level fields match OR list_items have match
          const purchaseOrderLevelMatch =
            purchaseOrderIdMatch ||
            customerMatch ||
            emailMatch ||
            statusMatch ||
            dateMatch;

          if (purchaseOrderLevelMatch || filteredItems.length > 0) {
            return {
              ...purchaseOrder,
              list_items:
                filteredItems.length > 0
                  ? filteredItems
                  : purchaseOrder.list_items,
            };
          }

          return null;
        })
        .filter((purchaseOrder) => purchaseOrder !== null); // remove nulls

      return filteredPurchaseOrder;
    },
    [purchaseOrderList, userDetails]
  );

  //handel multiple filter
  const handelMultipleFilter = useCallback(
    async ({
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
      if (!purchaseOrderList) return;

      let result = [];

      // console.log(dateFilter);

      if (amountFilter)
        result = await FilterDataOnAmount(amountFilter, purchaseOrderList);
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
    },
    [purchaseOrderList, userDetails]
  );
  console.log(createPurchaseOrderForm);

  return (
    <PurchaseOrderContext.Provider
      value={{
        getPurchaseOrderList,
        purchaseOrderList,
        getPurchaseOrderDetails,
        purchaseOrderDetails,
        createPurchaseOrderFormDispatch,
        createPurchaseOrderForm,
        createPurchaseOrder,
        updatePurchaseOrder,
        searchPurchaseOrder,
        handelMultipleFilter,
      }}
    >
      {children}
    </PurchaseOrderContext.Provider>
  );
};
