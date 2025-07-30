import { createContext, useCallback, useContext, useState } from "react";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import {
  FilterDataOnExpenseAmount,
  FilterDataOnName,
  FilterDataOnType,
  SortDataOnExpenseAmount,
  SortDataOnExpenseDate,
} from "../../utils/filterData";
import { UserContext } from "../userContext/UserContext";

export const LedgerContext = createContext();

export const LedgerContextProvider = ({ children }) => {
  const [allLedgerList, setallLedgerList] = useState(null);
  const { companyDetails } = useContext(CompanyContext);
    const {userDetails} = useContext(UserContext)
  

  //get all legder
  const getLedgerList = useCallback(
    async (setisLoading = () => {}) => {
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
        }/api/accounting/get-list-ledger/?companyId=${
          companyDetails.company_id
        }`,
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

      setallLedgerList(res.data.data);
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

  // search on ledger  list
  const searchLedger = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredLedger = allLedgerList
        .map((ledger) => {
          const idMatch = ledger.id?.toLowerCase().includes(query);
          const typeMatch = (ledger.type || "")?.toLowerCase().includes(query);
          const nameMatch = ledger.name?.toLowerCase().includes(query);
          const descriptionMatch = ledger.description
            ?.toLowerCase()
            .includes(query);
          const dateMatch = formatISODateToDDMMYYYY(ledger.ts)
            ?.toLowerCase()
            .includes(query);
          const debit_amountMatch = ledger.debit_amount
            .toString()
            ?.toLowerCase()
            .includes(query);
          const credit_amountMatch = ledger.credit_amount
            .toString()
            ?.toLowerCase()
            .includes(query);

          // If ledger level fields match OR list_items have match
          if (
            idMatch ||
            typeMatch ||
            nameMatch ||
            descriptionMatch ||
            dateMatch ||
            debit_amountMatch ||
            credit_amountMatch
          ) {
            return {
              ...ledger,
            };
          }

          return null;
        })
        .filter((ledger) => ledger !== null); // remove nulls

      return filteredLedger;
    },
    [allLedgerList , userDetails]
  );

  //handel multiple filter
  const handelMultipleFilter = async ({
    type = "",
    name = "",
    debitAmount = "",
    creditAmount = "",
    debitSort = "",
    creditSort = "",
    dateSort = "",
  }) => {
    if (!allLedgerList) return;

    let result = [];

    // console.log(dateFilter);

    if (type) result = await FilterDataOnType(type, allLedgerList);
    if (name) result = await FilterDataOnName(name, result);
    if (debitAmount)
      result = await FilterDataOnExpenseAmount(debitAmount, result);
    if (creditAmount)
      result = await FilterDataOnExpenseAmount(creditAmount, result);

    if (debitSort) result = await SortDataOnExpenseAmount(debitSort, result);
    if (creditSort) result = await SortDataOnExpenseAmount(creditSort, result);
    if (dateSort) result = await SortDataOnExpenseDate(dateSort, result);

    return result;
  };

  return (
    <LedgerContext.Provider
      value={{
        allLedgerList,
        getLedgerList,
        searchLedger,
        handelMultipleFilter,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
};
