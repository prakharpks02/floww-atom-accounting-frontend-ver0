import axios from "axios";
import { createContext, useCallback, useContext, useState } from "react";
import { showToast } from "../../utils/showToast";
import { CompanyContext } from "../company/CompanyContext";

export const DashBoardContext = createContext();

export const DashBoardContextProvider = ({ children }) => {
  const [dashBoardDetails, setdashBoardDetails] = useState(null);
  const { companyDetails } = useContext(CompanyContext);

  //get dash board details
  const getDashBoardDetails = useCallback(async (setisLoading = () => {}) => {
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
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/dashboard/?companyId=${companyDetails.company_id}`,
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

      setdashBoardDetails(res.data.data);
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
  }, []);

  console.log(dashBoardDetails);

  return (
    <DashBoardContext.Provider
      value={{ dashBoardDetails, getDashBoardDetails }}
    >
      {children}
    </DashBoardContext.Provider>
  );
};
