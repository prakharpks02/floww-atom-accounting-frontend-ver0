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
  FilterDataOnCategory,
  FilterDataOnCreatedBy,
  FilterDataOnDate,
  FilterDataOnExpenseAmount,
  FilterDataOnStatus,
  SortDataOnExpenseAmount,
  SortDataOnExpenseDate,
} from "../../utils/filterData";
import { UserContext } from "../userContext/UserContext";
import { uploadFile } from "../../utils/uploadFiles";

export const ExpenseContext = createContext();

const initialExpenseState = {
  title: "",
  category: "",
  amount: "",
  currency: "INR",
  paid: "Unpaid",
  expenseStatus: "pending",
  date: "",
  deception: "",
  attachments: [
    {
      related_doc_name: "",
      related_doc_url: "",
    },
  ],
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "ADD_DOCUMENT":
      return {
        ...state,
        documentUrls: [...state.documentUrls, action.payload],
      };

    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documentUrls: state.documentUrls.map((doc, index) =>
          index === action.index ? { ...doc, ...action.payload } : doc
        ),
      };

    case "REMOVE_DOCUMENT":
      return {
        ...state,
        documentUrls: state.documentUrls.filter(
          (_, index) => index !== action.index
        ),
      };

    case "RESET":
      return initialExpenseState;

    default:
      return state;
  }
};

export const ExpenseContextprovider = ({ children }) => {
  const [AllExpenseList, setAllExpenseList] = useState(null);
  const { companyDetails } = useContext(CompanyContext);
  const [expenseDetails, setexpenseDetails] = useState(null);
  const [createExpenseForm, createExpenseFormdispatch] = useReducer(
    expenseReducer,
    initialExpenseState
  );
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // get all expenses
  const getAllExpense = async (setisLoading = () => {}) => {
    if (!companyDetails) {
      showToast("No company details found", 1);
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
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/get-list-expense?companyId=${
          companyDetails.company_id
        }`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // console.log(res);
      if (res.data.status && res.data.status.toLowerCase() !== "success") {
        showToast("Somthing went wrong. Please try again", 1);
        return;
      }

      setAllExpenseList(res.data.data);
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
  };

  //get expense details
  const getExpenseDetails = useCallback(
    async (expenseid, setisLoading = () => {}) => {
      if (!expenseid) {
        showToast("Please provide expense id", 1);
        return;
      }

      if (expenseid === "new") {
        setexpenseDetails(null);
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
          }/api/accounting/get-expense-details/?expenseId=${expenseid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        setexpenseDetails(res.data?.data);
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

  //create expense
  const createExpense = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      const validationErrors = validateFields(createExpenseForm);

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

      // const userId = userDetails?.userId;
      // if (!userId) {
      //   showToast("User ID not found", 1);
      //   return;
      // }

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      console.log("userdetails", userDetails);

      try {
        setisLoading(true);

        // upload documens
        for (let i = 0; i < createExpenseForm.attachments.length; i++) {
          const file = createExpenseForm.attachments[i];
          if (file.fileBlob) {
            const res = await uploadFile(file.fileName, file.fileBlob, token);
            console.log(res);
            createExpenseForm.attachments[i] = {
              related_doc_name: res.file_name,
              related_doc_url: res.doc_url,
            };
          }
        }
        console.log("file uploaded");

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-expense/`,
          {
            // userId: userId,
            companyId: companyDetails.company_id,
            uploadedBy: userDetails?.name || "Unknown",
            email: userDetails?.email || "Member",
            createdByMemberId: "user",
            createdByMemberName: userDetails?.name || "Unknown",
            createdByProfileIconUrl:
              userDetails?.image || "https://example.com/profile.jpg",
            ...createExpenseForm,
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
        createExpenseFormdispatch({
          type: "RESET",
        });
        showToast("Expense added.");
        navigate(`/expense/expenseList`);
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
    [createExpenseForm, userDetails]
  );

  //update epense
  const updateExpense = useCallback(
    async (data, setisLoading = () => {}) => {
      if (!data) {
        showToast("Expense data not found", 1);
        throw new Error("Expense data not found");
      }

      if (!data.expense_id) {
        showToast("Expense ID not found", 1);
        throw new Error("Expense ID not found");
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
        throw new Error("Token not found");
      }

      try {
        setisLoading(true);

        // upload documens
        for (let i = 0; i < createExpenseForm.attachments.length; i++) {
          const file = createExpenseForm.attachments[i];
          if (file.related_doc_url.toLowerCase() === "n/a") {
            const res = await uploadFile(file.fileName, file.fileBlob, token);
            console.log(res);
            createExpenseForm.attachments[i] = {
              related_doc_name: res.file_name,
              related_doc_url: res.doc_url,
            };
          }
        }
        console.log("file uploaded");

        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/update-expense-details/`,
          {
            ...data,
            // userId: userId,
            expenseId: data.expense_id,
            companyId: companyDetails.company_id,
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
        createExpenseFormdispatch({
          type: "RESET",
        });
        showToast("Expense updated.");
        // window.location.reload();
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
    [createExpenseForm, userDetails]
  );

  //handel multiple filter
  const handelMultipleFilter = async ({
    amountFilter = "",
    status = "",
    dateFilter = "",
    category = "",
    createdBy = "",
    amountSort = "",
    dateSort = "",
  }) => {
    if (!AllExpenseList) return;

    let result = [];

    // console.log(dateFilter);

    if (amountFilter)
      result = await FilterDataOnExpenseAmount(amountFilter, AllExpenseList);
    if (status) result = await FilterDataOnStatus(status, result);
    if (dateFilter) result = await FilterDataOnDate(dateFilter, result);
    if (category) result = await FilterDataOnCategory(category, result);
    if (createdBy) result = await FilterDataOnCreatedBy(createdBy, result);
    if (amountSort) result = await SortDataOnExpenseAmount(amountSort, result);
    if (dateSort) result = await SortDataOnExpenseDate(dateSort, result);
    return result;
  };

  // search on expense list
  const searchExpense = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredExpense = AllExpenseList.map((expense) => {
        const createrMatch = expense.created_by_member_name
          ?.toLowerCase()
          .includes(query);
        const createrEmailMatch = (expense.created_by_member_email || "")
          ?.toLowerCase()
          .includes(query);
        const titleMatch = expense.title?.toLowerCase().includes(query);
        const categoryMatch = expense.category?.toLowerCase().includes(query);
        const amountMatch = expense.amount?.toLowerCase().includes(query);
        const dateMatch = expense.date?.toLowerCase().includes(query);
        const statusMatch = expense.expense_status
          ?.toLowerCase()
          .includes(query);

        // If expense level fields match OR list_items have match
        if (
          createrMatch ||
          createrEmailMatch ||
          titleMatch ||
          categoryMatch ||
          amountMatch ||
          dateMatch ||
          statusMatch
        ) {
          return {
            ...expense,
          };
        }

        return null;
      }).filter((expense) => expense !== null); // remove nulls

      return filteredExpense;
    },
    [AllExpenseList, userDetails]
  );

  // reset the to intial value
  useEffect(() => {
    setexpenseDetails(null);
    !pathname.toLowerCase().includes("/addexpense") &&
      createExpenseFormdispatch({ type: "RESET" });
  }, [pathname]);

  console.log(createExpenseForm);

  return (
    <ExpenseContext.Provider
      value={{
        AllExpenseList,
        getAllExpense,
        createExpenseFormdispatch,
        createExpense,
        getExpenseDetails,
        expenseDetails,
        updateExpense,
        handelMultipleFilter,
        searchExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
