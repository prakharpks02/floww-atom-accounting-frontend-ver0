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
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import { UserContext } from "../userContext/UserContext";
import { uploadFile } from "../../utils/uploadFiles";

export const AddmemberContext = createContext();

const initialState = {
  memberName: "",
  username: "",
  profileIconUrl: "",
  memberStatus: "Active",
  listProductAccess: [{ module_accessible: "N/A" }],
  memberPassword: "",
  role: "",
};

const addMemberReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "ADD_MODULE_ACCESS":
      return {
        ...state,
        listProductAccess: [
          ...state.listProductAccess,
          { module_accessible: action.value },
        ],
      };

    case "REMOVE_MODULE_ACCESS":
      return {
        ...state,
        listProductAccess: state.listProductAccess.filter(
          (item) => item.module_accessible !== action.value
        ),
      };

    case "RESET_USER":
      return initialState;

    default:
      return state;
  }
};

export const AddMemberContextProvider = ({ children }) => {
  const [addMemberForm, addMemberFormdispatch] = useReducer(
    addMemberReducer,
    initialState
  );
  const { companyDetails } = useContext(CompanyContext);
  const [allMemberList, setallMemberList] = useState(null);
  const { userDetails } = useContext(UserContext);

  //create member
  const createMember = useCallback(
    async (e, setisLoading = () => {}) => {
      e.preventDefault();

      const validationErrors = validateFields(addMemberForm);

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

      // const userId =  userDetails?.userId;
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
        // const file = addMemberForm.profileIconUrl;
        // const response = await uploadFile(file.fileName, file.fileBlob, token);
        // console.log(response);
        // addMemberForm.profileIconUrl = response.doc_url;

        // console.log("profile image uploaded");

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/accounting/add-members/`,
          {
            // userId: userId,
            companyId: companyDetails.company_id,
            memberAddedOn: Date.now(),
            ...addMemberForm,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log(res);

        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          setisLoading(false);
          showToast(
            res.data?.message || "Somthing went wrong. Please try again",
            1
          );
          throw new Error(
            res.data?.message || "Somthing went wrong. Please try again"
          );
        }

        // reset form data
        addMemberFormdispatch({
          type: "RESET",
        });
        showToast("Member created.");
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
    [addMemberForm, userDetails]
  );

  // get all members of a company with comanpany id
  const getAllMemberList = useCallback(
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
          }/api/accounting/get-list-members/?companyId=${
            companyDetails.company_id
          }`,
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        // console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          setisLoading(false);
          showToast(
            res.data?.message || "Somthing went wrong. Please try again",
            1
          );
          throw new Error(
            res.data?.message || "Somthing went wrong. Please try again"
          );
        }

        setallMemberList(res.data.data);
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

  //update member
  const updateMember = useCallback(
    async (setisLoading = () => {}, data) => {
      console.log(data);

      if (!data) {
        showToast("Member data not found", 1);
        throw new Error("Member data not found");
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

      console.log(data);

      try {
        setisLoading(true);
        const res = await axios.post(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/accounting/update-member-details/`,
          {
            memberId: data.member_id,
            // userId: userId,
            companyId: companyDetails.company_id,
            memberName: data.member_name,
            username: data.username,
            profileIconUrl: data.profile_icon_url,
            memberAddedOn: data.member_added_on,
            memberStatus: data.member_status,
            listProductAccess: [{ module_accessible: "N/A" }],
            memberPassword: data.member_password,
            createdOn: data.created_on,
            role: data.role,
            lastLogin: data.last_login,
          },
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        console.log(res);
        // console.log(res);
        if (res.data.status && res.data.status.toLowerCase() !== "success") {
          setisLoading(false);
          showToast(
            res.data?.message || "Somthing went wrong. Please try again",
            1
          );
          throw new Error(
            res.data?.message || "Somthing went wrong. Please try again"
          );
        }

        // reset form data
        addMemberFormdispatch({
          type: "RESET",
        });
        showToast("Member Updated.");
        // window.location.reload();
      } catch (error) {
        console.log(error);
        showToast(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Somthing went wrong. Please try again",
          1
        );
        setisLoading(false);
        throw new Error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Somthing went wrong. Please try again"
        );
      } finally {
        setisLoading(false);
      }
    },
    [addMemberForm, userDetails]
  );

  // search on member list
  const searchMember = useCallback(
    async (searchQuery) => {
      const query = searchQuery.toLowerCase();

      const filteredMember = allMemberList
        .map((member) => {
          const memberNameMatch = member.member_name
            ?.toLowerCase()
            .includes(query);
          const usernameMatch = member.username?.toLowerCase().includes(query);
          const roleMatch = member.role?.toLowerCase().includes(query);
          const lastLoginMatch = formatISODateToDDMMYYYY(member.last_login)
            ?.toLowerCase()
            .includes(query);
          const statusMatch = member.member_status
            ?.toLowerCase()
            .includes(query);

          // If member level fields match OR list_items have match
          if (
            memberNameMatch ||
            usernameMatch ||
            roleMatch ||
            lastLoginMatch ||
            statusMatch
          ) {
            return {
              ...member,
            };
          }

          return null;
        })
        .filter((member) => member !== null); // remove nulls

      return filteredMember;
    },
    [allMemberList, userDetails]
  );

  console.log(addMemberForm);
  return (
    <AddmemberContext.Provider
      value={{
        addMemberForm,
        addMemberFormdispatch,
        createMember,
        getAllMemberList,
        allMemberList,
        updateMember,
        searchMember,
      }}
    >
      {children}
    </AddmemberContext.Provider>
  );
};
