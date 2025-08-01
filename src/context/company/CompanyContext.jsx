import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import { showToast } from "../../utils/showToast";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LogoAnimation } from "../../component/logo-animation";
import { OnBoardingPage } from "../../routes/onBoarding/OnBoarding";
import { validateFields } from "../../utils/checkFormValidation";
import { UserContext } from "../userContext/UserContext";

export const CompanyContext = createContext();

export const initialState = {
  companyName: "",
  companyLogo: "",
  companyStreet: "",
  companyZIP: "",
  companyState: "",
  companyLandmark: "",
  companyMobileNo: "",
  companyWebsite: "",
  companyGSTIN: "",
  companyPAN: "",
  companyEmail: "",
  companyCIN: "",
};

export function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export const CompanyContextProvider = ({ children }) => {
  const [companyDetails, setcompanyDetails] = useState(null);
  const [companyList, setcompanyList] = useState(null);
  const [isAuthenticating, setisAuthenticating] = useState(true);
  const [isLoading, setisLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [companyForm, companyFormDispatch] = useReducer(
    formReducer,
    initialState
  );
  const { userDetails } = useContext(UserContext);
  const navigate = useNavigate();

  // function to get company details
  const getCompanyDetails = useCallback(async () => {
    const companyId = localStorage.getItem("companyid") || undefined;
    // console.log(companyId)
    if (!companyId) {
      showToast("Company ID not found. Please login with a company.", 1);
      setisAuthenticating(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Token not found", 1);
      return;
    }

    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/get-company-details-accounting/?companyId=${companyId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res);
      if (
        res.data.error_message?.toLowerCase() !== "na" ||
        (res.data.status && res.data.status.toLowerCase() !== "success")
      ) {
        setisAuthenticating(false);
        // navigate("/onBoarding");
        return;
      }
      setcompanyDetails(res.data.data);
    } catch (error) {
      console.log(error);
      // navigate("/onBoarding");
      showToast(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Somthing went wrong. Please try again",
        1
      );
    } finally {
      setisAuthenticating(false);
    }
  }, [userDetails]);

  // function to change comapny form data
  const handleChange = (name, value) => {
    companyFormDispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: value,
    });

    // Clear error for the field if it now has a value
    if (errors[name] && value !== "") {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // function to submit compnay form and create compnay
  const createCompany = useCallback(
    async (e) => {
      e.preventDefault();

      const validationErrors = validateFields(companyForm);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      setErrors({});
      // const userid = userDetails?.userId;
      // if (!userid) {
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
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/create-company-accounting/`,
          {
            // userId: userid,
            ...companyForm,
            companyAddress: `${companyForm.companyStreet}, ${companyForm.companyLandmark}, ${companyForm.companyState}, ${companyForm.companyZIP}`,
          },
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

        showToast("Company created");
        localStorage.setItem("companyid", res.data.data.company_id);
        navigate("/");
        window.location.reload();
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Somthing went wrong. Please try again",
          1
        );
      } finally {
        setisLoading(false);
      }
    },
    [companyForm, userDetails]
  );

  //get company list
  const getCompanyList = useCallback(
    async (setisLoading = () => {}) => {
      // if (!companyDetails) return;

      // const userId = userDetails?.userId || undefined;

      // console.log(companyId)
      // if (!userId) {
      //   showToast("User not found. Please login first.", 1);
      //   setisAuthenticating(false);
      //   return;
      // }

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
          }/api/accounting/get-list-companies-accounting/`,
          // `${
          //   import.meta.env.VITE_BACKEND_URL
          // }/api/accounting/get-list-companies-accounting/?userId=${userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        if (
          (res.data.error_message &&
            res.data.error_message.toLowerCase() !== "no") ||
          (res.data.status && res.data.status.toLowerCase() !== "success")
        ) {
          setisLoading(false);
          // navigate("/onBoarding");
          return;
        }

        if (!companyDetails) {
          setcompanyDetails(res.data.data[0]);
          setcompanyList(res.data.data.slice(1));
          return;
        }
        setcompanyList(
          res.data.data.filter(
            (item) => item.company_id != companyDetails.company_id
          )
        );
      } catch (error) {
        console.log(error);
        // navigate("/onBoarding");
        showToast(
          error.response?.data?.message ||
            error.response?.data?.error ||
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

  useEffect(() => {
    getCompanyDetails();
    // !companyDetails && getCompanyList();
  }, []);

  useEffect(() => {
    if (!companyDetails || !companyDetails.company_id) return;
    if (isAuthenticating) setisAuthenticating(false);
    localStorage.setItem("companyid", companyDetails.company_id);
  }, [companyDetails]);

  if (isAuthenticating) {
    return (
      <>
        <LogoAnimation isShow={true} />
      </>
    );
  }

  console.log(companyList);

  if (!companyDetails) {
    return (
      <>
        <CompanyContext.Provider
          value={{
            companyDetails,
            getCompanyDetails,
            handleChange,
            errors,
            createCompany,
            isLoading,
          }}
        >
          <OnBoardingPage />
        </CompanyContext.Provider>
      </>
    );
  }

  return (
    <>
      <CompanyContext.Provider
        value={{
          companyDetails,
          getCompanyDetails,
          handleChange,
          errors,
          createCompany,
          isLoading,
          getCompanyList,
          companyList,
          setcompanyDetails,
        }}
      >
        {children}
      </CompanyContext.Provider>
    </>
  );
};
