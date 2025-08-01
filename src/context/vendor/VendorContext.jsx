import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import demoData from "../../demo_data/vendor.json";
import { CompanyContext } from "../company/CompanyContext";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../userContext/UserContext";

export const VendorContext = createContext();

export const initialState = {
  attention: "N/A",
  companyName: "",
  contactPerson: [
    {
      contact_person: "",
      contact_no: "",
      email: "",
      work_phone: "",
    },
  ],
  gstNumber: "",
  panNumber: "",
  contactNo: "",
  address: "",
  email: "",
  logoLink: "N/A",
  vendorFirstName: "",
  vendorLastName: "",
  vendorSalutation: "",
  displayName: "N/A",
  remarks: "",
  relatedDocuments: [
    {
      related_doc_name: "",
      related_doc_url: "",
    },
  ],
  msmeRegisteredOrNot: false,
  bankDetails: [
    {
      bank_name: "",
      bank_account_number: "",
      re_enter_bank_account_number: "",
      bank_account_IFSC: "",
      bank_account_receivers_name: "",
    },
  ],
  openingBalance: "",
  paymentTerms: "",
  tds: "",
  workPhone: "",
};

export const vendorReducer = (state, action) => {
  let updatedItems = [];
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "UPDATE_ARRAY":
      updatedItems = [...state[action.parentField]];
      updatedItems[action.index][action.field] = action.value;
      return {
        ...state,
        [action.parentField]: updatedItems,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
};

export const VendorContextProvider = ({ children }) => {
  const [AllVendorList, setAllVendorList] = useState(null);
  const [errors, setErrors] = useState({});
  const [vendorDetails, setvendorDetails] = useState(null); // details of a vendor based on vendor id
  const [createVendorForm, createVendorFormDispatch] = useReducer(
    vendorReducer,
    initialState
  );
  const { companyDetails } = useContext(CompanyContext);
  const { userDetails } = useContext(UserContext);

  const navigate = useNavigate();

  // function to change vendor form data
  const handleChange = useCallback(
    (type = "UPDATE_FIELD", name, value) => {
      createVendorFormDispatch({
        type: type,
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
    },
    [createVendorFormDispatch, errors]
  );

  // create vendor of a company
  const CreateVendor = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      if (
        createVendorForm.bankDetails[0]?.bank_account_number !==
        createVendorForm.bankDetails[0]?.re_enter_bank_account_number
      ) {
        showToast("Repeat with same account number", 1);
        return;
      }
      const validationErrors = validateFields(createVendorForm);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      if (!companyDetails) {
        showToast("No company details found", 1);
        return;
      }

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

      setErrors({});
      console.log("Sending payload:", {
        ...createVendorForm,
      });

      try {
        setisLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-vendor/`,
          {
            // userId: userid,
            companyId: companyDetails.company_id,
            vendorName: `${createVendorForm.vendorSalutation} ${createVendorForm.vendorFirstName} ${createVendorForm.vendorLastName}`,
            ...createVendorForm,
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

        // reset to initial value
        handleChange("RESET");
        showToast("Vendor created");
        navigate(`/vendor/vendorsList`);
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
    [createVendorForm, userDetails]
  );

  // update vendor details
  const updateVendor = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();
      if (
        createVendorForm.accountNumber !== createVendorForm.reEnterAccountNumber
      ) {
        showToast("Repeat with same account number", 1);
        return;
      }

      const validationErrors = validateFields(createVendorForm);
      console.log(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      setErrors({});

      if (!companyDetails) {
        showToast("No company details found", 1);
        return;
      }

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
          }/api/accounting/update-vendor-details/`,
          {
            ...createVendorForm,
            // userId: userid,
            companyId: companyDetails.company_id,
            vendorName: `${createVendorForm.vendorSalutation} ${createVendorForm.vendorFirstName} ${createVendorForm.vendorLastName}`,
            vendorId: vendorDetails.vendor_id,
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

        // reset to initial value
        handleChange("RESET");
        showToast("Vendor updated");
        navigate(`/vendor/vendorDetails/${vendorDetails.vendor_id}`);
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
    [createVendorForm, userDetails]
  );

  // get all vendors of a company with comanpany id
  const getAllVendors = async (setisLoading = () => {}) => {
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
        }/api/accounting/get-all-vendors-company/?companyId=${
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
        return;
      }

      setAllVendorList(res.data.data);
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

  // get vendor details from vendor id
  const getVendorDetails = useCallback(
    async (vendorid, setisLoading = () => {}) => {
      if (!vendorid) {
        showToast("Please provide vendor id", 1);
        return;
      }

      if (vendorid.toLowerCase() === "new") {
        setvendorDetails(null);
        handleChange("RESET");
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
          }/api/accounting/get-vendor-details/?vendorId=${vendorid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        setvendorDetails(res.data?.data);
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

  // search on vendor list
  const searchVendor = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredVendor = AllVendorList.map((vendor) => {
        const customerIdMatch = vendor.vendor_id?.toLowerCase().includes(query);
        const customerMatch = vendor.vendor_name?.toLowerCase().includes(query);
        const emailMatch = vendor.email?.toLowerCase().includes(query);
        const mobileMatch = vendor.contact_no?.toLowerCase().includes(query);
        const companynameMatch = vendor.company_name
          ?.toLowerCase()
          .includes(query);

        // If vendor level fields match OR list_items have match
        if (
          customerIdMatch ||
          customerMatch ||
          emailMatch ||
          mobileMatch ||
          companynameMatch
        ) {
          return {
            ...vendor,
          };
        }

        return null;
      }).filter((vendor) => vendor !== null); // remove nulls

      return filteredVendor;
    },
    [AllVendorList, userDetails]
  );

  console.log(createVendorForm);

  return (
    <VendorContext.Provider
      value={{
        createVendorForm,
        handleChange,
        CreateVendor,
        getAllVendors,
        createVendorFormDispatch,
        AllVendorList,
        getVendorDetails,
        vendorDetails,
        updateVendor,
        searchVendor,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
};
