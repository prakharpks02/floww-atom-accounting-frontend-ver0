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
  FilterDataOnFinancialYear,
  FilterDataOnDate,
  FilterOnMonthRange,
} from "../../utils/filterData";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { UserContext } from "../userContext/UserContext";

export const SalesContext = createContext();

// intial sales state
export const initialSalesState = {
  salesTs: "",
  invoiceId: "N/A",
  invoiceNumber: "N/A",
  listItems: [
    {
      item_name: "",
      item_description: "",
      quantity: "",
      hsn_code: "",
      discount: "0",
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
  customerId: "",
  notes: "",
  contactNo: "",
  email: "",
  address: "",
  invoiceUrl: [{ invoice_url: "N/A" }],
  paymentNameList: [
    {
      payment_name: "N/A",
      payment_descriptions: "N/A",
      payment_type: "",
      upi_id: "N/A",
      upi_qr_code_url: "N/A",
      bank_account_number: "N/A",
      bank_account_IFSC: "N/A",
      bank_account_receivers_name: "N/A",
      bank_name: "N/A",
      remarks: "N/A",
    },
  ],
  invoiceDate: "N/A",
  invoiceDueBy: "N/A",
  quotationId: "N/A",
  purchaseOrderId: "N/A",
  paymentTransactionsList: [
    {
      transaction_id: "N/A",
      amount: "0",
      timestamp: Date.now(),
      remark: "Sale created by ADMIN",
      transaction_url: "N/A",
    },
  ],
  gstinNumber: "",
  panNumber: "",
  subtotalAmount: "",
  discountAmount: "",
  tdsAmount: "",
  adjustmentAmount: "",
  totalAmount: "",
  status: "",
  terms: "N/A",
  customerName: "",
  tdsReason: "",
};

// sales reducer
export const SalesReducer = (state, action) => {
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
      return initialSalesState;

    default:
      return state;
  }
};

export const SalesContextProvider = ({ children }) => {
  const [AllSalesList, setAllSalesList] = useState(null);
  const [saleDetails, setsaleDetails] = useState(null);
  //create sales reducer
  const [createSaleForm, createSaleFormDispatch] = useReducer(
    SalesReducer,
    initialSalesState
  );

  const { pathname } = useLocation();
  const { companyDetails } = useContext(CompanyContext);
  const { userDetails } = useContext(UserContext);

  const navigate = useNavigate();

  //  function to get all sales list
  const getAllSales = useCallback(
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
          }/api/accounting/get-list-sales/?companyId=${
            companyDetails.company_id
          }`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (res.data?.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          return;
        }

        setAllSalesList(res.data.data);
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

  // get total sales for dashboard
  const getTotalSales = async () => {
    if (!allSales) return;

    console.log(allSales);

    return allSales.reduce((total, sale) => {
      const saleTotal = sale.list_items.reduce((sum, item) => {
        return sum + parseFloat(item.gross_amount || 0);
      }, 0);
      return total + saleTotal;
    }, 0);
  };

  // filter sales list
  const handelMultipleFilter = async ({
    statusFilter = "",
    amountFilter = "",
    dateFilter = "",
    financialYearFilter = "",
    amountSort = "",
    dateSort = "",
    quantitySort = "",
    startMonth = "",
    endMonth = "",
  }) => {
    if (!AllSalesList) return;

    let result = [];

    // console.log(dateFilter);

    if (statusFilter)
      result = await FilterDataOnStatus(statusFilter, AllSalesList);
    if (amountFilter) result = await FilterDataOnAmount(amountFilter, result);
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

  // search on sales list
  const searchSales = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredSales = AllSalesList.map((sale) => {
        const saleIdMatch = sale.sales_id?.toLowerCase().includes(query);
        const customerMatch = sale.contact_person
          ?.toLowerCase()
          .includes(query);
        const emailMatch = sale.email?.toLowerCase().includes(query);
        const statusMatch = sale.status?.toLowerCase() === query;
        const dateMatch = sale.sales_ts?.toLowerCase().includes(query);

        // filter list_items first
        const filteredItems = sale.list_items.filter((item) => {
          const itemNameMatch = item.item_name?.toLowerCase().includes(query);
          const amountMatch = item.gross_amount?.toString() === query;
          const quantityMatch = item.quantity?.toString() === query;
          return itemNameMatch || amountMatch || quantityMatch;
        });

        // If sale level fields match OR list_items have match
        const saleLevelMatch =
          saleIdMatch ||
          customerMatch ||
          emailMatch ||
          statusMatch ||
          dateMatch;

        if (saleLevelMatch || filteredItems.length > 0) {
          return {
            ...sale,
            list_items:
              filteredItems.length > 0 ? filteredItems : sale.list_items,
          };
        }

        return null;
      }).filter((sale) => sale !== null); // remove nulls

      return filteredSales;
    },
    [AllSalesList, userDetails]
  );

  //create new sales
  const createSales = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      const validationErrors = validateFields(createSaleForm);

      if (Object.keys(validationErrors).length > 0) {
        console.log(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      if (!companyDetails) {
        showToast("No company details found", 1);
        return;
      }

      // const userId = userDetails?.userId;
      // if (!userId) {
      //   showToast("user ID not found", 1);
      //   return;
      // }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-sales/`,
          {
            companyId: companyDetails.company_id,
            // userId: userId,
            ...createSaleForm,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res);
        if (res.data?.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          return;
        }

        // reset to initial value
        createSaleFormDispatch({ type: "RESET" });
        showToast("Sale created");
        navigate("/sales/salesList");
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
    [createSaleForm, userDetails]
  );

  //get sales details
  const getSaleDetails = useCallback(
    async (saleid, setisLoading = () => {}) => {
      if (!saleid) {
        showToast("Please provide sales id", 1);
        return;
      }

      if (saleid === "new") {
        setsaleDetails(null);
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
          }/api/accounting/get-sales-details/?salesId=${saleid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        // console.log(res);
        setsaleDetails(res.data?.data);
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

  //update existing sales
  const updateSales = useCallback(
    async (saleid, setisLoading = () => {}) => {
      const validationErrors = validateFields(createSaleForm);

      if (Object.keys(validationErrors).length > 0) {
        console.log(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      if (!companyDetails) {
        showToast("Company details not found", 1);
        return;
      }
      if (!saleid) {
        showToast("Sales ID not found", 1);
        return;
      }
      // const userId = userDetails?.userId;
      // if (!userId) {
      //   showToast("user ID not found", 1);
      //   return;
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
          }/api/accounting/update-sales-details/`,
          {
            ...createSaleForm,
            companyId: companyDetails.company_id,
            // userId: userId,
            salesId: saleid,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        if (res.data?.status && res.data.status.toLowerCase() !== "success") {
          showToast("Somthing went wrong. Please try again", 1);
          setisLoading(false);
          return;
        }

        // reset to initial value
        createSaleFormDispatch({ type: "RESET" });
        showToast("Sales updated");
        navigate(`/sales/saleDetails/${saleid}`);
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
    [createSaleForm, userDetails]
  );

  // reset the create sale form to intial value when not in addSales page
  useEffect(() => {
    !pathname.toLowerCase().includes("/addsales") &&
      createSaleFormDispatch({ type: "RESET" });
  }, [pathname]);

  // console.log(createSaleForm);

  return (
    <SalesContext.Provider
      value={{
        AllSalesList,
        getTotalSales,
        handelMultipleFilter,
        searchSales,
        getAllSales,
        createSaleFormDispatch,
        createSaleForm,
        createSales,
        updateSales,
        getSaleDetails,
        saleDetails,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};
