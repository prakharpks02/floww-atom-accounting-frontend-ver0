import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import demoData from "../../demo_data/customer.json";
import { showToast } from "../../utils/showToast";
import { CompanyContext } from "../company/CompanyContext";
import axios from "axios";
import { validateFields } from "../../utils/checkFormValidation";
import { useNavigate } from "react-router-dom";

export const CustomerContext = createContext();

export const initialCustomerState = {
  attention: "N/A",
  companyName: "",
  remarks: "",
  customerType: "", // or "Individual"
  workPhone: "",
  displayName: "",
  openingBalance: "", // INR
  paymentTerms: "",
  customerFirstName: "",
  customerLastName: "",
  customerSalutation: "",
  contactPerson: [{ contact_person: "", contact_no: "", email: "" }],
  bankDetails: [
    {
      bank_name: "N/A",
      bank_account_number: "N/A",
      bank_account_IFSC: "N/A",
      bank_account_receivers_name: "N/A",
    },
  ],
  gstNumber: "",
  panNumber: "",
  contactNo: "",
  address: "",
  email: "",
  logoLink: "N/A",
  relatedDocuments: [
    {
      related_doc_name: "",
      related_doc_url: "",
    },
  ],
};

export const customerReducer = (state, action) => {
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
      return initialCustomerState;
    default:
      return state;
  }
};

export const CustomerContextProvider = ({ children }) => {
  const [AllCustomersList, setAllCustomersList] = useState(null);
  const [customerDetails, setcustomerDetails] = useState(null); // details of a customer based on customer id
  const [errors, setErrors] = useState({});
  const [createCustomerForm, createCustomerFormDispatch] = useReducer(
    customerReducer,
    initialCustomerState
  );
  const { companyDetails } = useContext(CompanyContext);
  const navigate = useNavigate();

  // function to change customer form data
  const handleChange = useCallback(
    (type = "UPDATE_FIELD", field, value, index, parentField) => {
      createCustomerFormDispatch({
        type: type,
        field: field,
        value: value,
        index: index,
        parentField: parentField,
      });

      // Clear error for the field if it now has a value
      if (errors[field] && value !== "") {
        setErrors((prev) => {
          const updated = { ...prev };
          delete updated[field];
          return updated;
        });
      }
    },
    [createCustomerFormDispatch, errors]
  );

  // get all customer of a company with comanpany id
  const getAllCustomers = useCallback(async (setisLoading = () => {}) => {
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
        }/api/accounting/get-all-customers-company/?companyId=${
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

      setAllCustomersList(res.data.data);
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

  // create customer to a company
  const CreateCustomer = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      const validationErrors = validateFields(createCustomerForm);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        console.log(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

      if (!companyDetails) {
        showToast("No company details found", 1);
        return;
      }

      setErrors({});
      console.log("Sending payload:", {
        ...createCustomerForm,
      });

      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Token not found", 1);
        return;
      }

      try {
        setisLoading(true);
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/create-customer/`,
          {
            bankDetails: [],
            companyId: companyDetails.company_id,
            customerName: `${createCustomerForm.customerSalutation} ${createCustomerForm.customerFirstName} ${createCustomerForm.customerLastName}`,
            ...createCustomerForm,
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
          return;
        }

        // reset to initial value
        handleChange("RESET");
        showToast("Customer created");
        navigate(`/customer/customerList`);
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
    [createCustomerForm]
  );

  // get customer details from customer id
  const getCustomerDetails = useCallback(
    async (custid, setisLoading = () => {}) => {
      if (!custid) {
        showToast("Please provide customer id", 1);
        return;
      }

      if (custid === "new") {
        setcustomerDetails(null);
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
          }/api/accounting/get-customer-details/?customerId=${custid}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log(res);
        setcustomerDetails(res.data?.data);
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
    []
  );

  // update customer details
  const updateCustomer = useCallback(
    async (e, setisLoading) => {
      e.preventDefault();
      const validationErrors = validateFields(createCustomerForm);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        showToast("All fields are required", 1);
        return;
      }

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
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/update-customer-details/`,
          {
            ...createCustomerForm,
            customerName: `${createCustomerForm.customerSalutation} ${createCustomerForm.customerFirstName} ${createCustomerForm.customerLastName}`,
            customerId: customerDetails.customer_id,
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
          return;
        }

        // reset to initial value
        handleChange("RESET");
        showToast("Customer updated");
        navigate(`/customer/customerDetails/${customerDetails.customer_id}`);
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
    [createCustomerForm]
  );

  // apply multiple filters to customer list and return filtered customer list
  const filterCustomerList = useCallback(
    ({ type = "all", companyName = "all" }) => {
      if (!AllCustomersList) {
        showToast("Customer List not found", 1);
        return;
      }
      console.log(type);
      const result = AllCustomersList?.filter((item) => {
        const typeFilter =
          type?.toLowerCase() === "all"
            ? true
            : item.customer_type?.toLowerCase().includes(type?.toLowerCase());
        const comapnyNameFilter =
          companyName?.toLowerCase() === "all"
            ? true
            : item.company_name
                ?.toLowerCase()
                .includes(companyName?.toLowerCase());
        return typeFilter && comapnyNameFilter;
      });

      return result;
    },
    [AllCustomersList]
  );

  // search on customer list
  const searchCustomer = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredCustomer = AllCustomersList.map((customer) => {
        const customerIdMatch = customer.customer_id
          ?.toLowerCase()
          .includes(query);
        const customerMatch = customer.customer_name
          ?.toLowerCase()
          .includes(query);
        const emailMatch = customer.email?.toLowerCase().includes(query);
        const customerTypeMatch = customer.customer_type
          ?.toLowerCase()
          .includes(query);
        const mobileMatch = customer.contact_no?.toLowerCase().includes(query);
        const companynameMatch = customer.company_name
          ?.toLowerCase()
          .includes(query);

        // If customer level fields match OR list_items have match
        if (
          customerIdMatch ||
          customerMatch ||
          emailMatch ||
          customerTypeMatch ||
          mobileMatch ||
          companynameMatch
        ) {
          return {
            ...customer,
          };
        }

        return null;
      }).filter((customer) => customer !== null); // remove nulls

      return filteredCustomer;
    },
    [AllCustomersList]
  );

  console.log(createCustomerForm);

  return (
    <CustomerContext.Provider
      value={{
        AllCustomersList,
        createCustomerFormDispatch,
        handleChange,
        CreateCustomer,
        errors,
        createCustomerForm,
        filterCustomerList,
        getAllCustomers,
        getCustomerDetails,
        customerDetails,
        updateCustomer,
        searchCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
