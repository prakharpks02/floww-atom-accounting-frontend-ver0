import { createContext, useCallback, useEffect, useState } from "react";
import { LogoAnimation } from "../../component/logo-animation";
import { ToastContainer } from "react-toastify";
import { UserLoginPage } from "../../routes/userAuth/UserLoginPage";
import { showToast } from "../../utils/showToast";
import axios from "axios";
import { auth } from "../../utils/firebaseConfig";
import { BrowserRouter, Routes, useNavigate, Route } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { UserSignupPage } from "../../routes/userAuth/UserSignupPage";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [userDetails, setuserDetails] = useState(null);
  // const [userDetails, setuserDetails] = useState({
  //   name: "Anirban Das",
  //   email: "123@gmail.com",
  //   image: "https://i.pravatar.cc/150?img=3",
  // });
  const [isAuthenticating, setisAuthenticating] = useState(true);
  const [confirmation, setConfirmation] = useState(null);
  const [recaptchaVerifier, setrecaptchaVerifier] = useState(null);

  const navigate = useNavigate();

  const createUser = useCallback(async (userData, setisLoading = () => {}) => {
    // console.log(companyId)
    if (!userData) {
      showToast("Please provide user data", 1);
      return;
    }

    try {
      setisLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/signup/`,
        {
          firebase_token: userData.firebaseToken,
          phone_number: `+91${userData.mobileNumber}`,
          name: userData.name,
          email: userData.email,
          icon_image: userData.imageUrl,
        }
      );
      console.log(res);
      if (
        res.data.error ||
        (res.data.status && res.data.status.toLowerCase() !== "success")
      ) {
        showToast(res.data.error || "Fail to create user", 1);
        // navigate("/onBoarding");
        return;
      }
      localStorage.setItem("token", res.data.token);
      setuserDetails({
        username: userData.name,
        // userId: res.data.user_id,
        email: userData.email,
        mobileNo: `+91${userData.mobileNumber}`,
        image: undefined,
      });
      navigate("/");
      showToast("User created successfully");
    } catch (error) {
      console.log(error);
      showToast(
        error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "Something went wrong. Please try again",
        1
      );
      // navigate("/onBoarding");
    } finally {
      setisLoading(false);
      setisLoading(false);
    }
  }, []);

  const getUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // showToast("Token no not found", 1);
      setisAuthenticating(false);
      setuserDetails(null);
      return;
    }

    try {
      setisAuthenticating(true);

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/accounting/get-member-user-detail/`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // const res = await axios.get(
      //   `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/user/details/?phone_number=+91${mobileNo}`,
      //   {
      //     headers: {
      //       Authorization: token,
      //     },
      //   }
      // );
      console.log(res);
      if (
        res.data.error ||
        (res.data.status && res.data.status?.toLowerCase() !== "success")
      ) {
        showToast(res.data.error || "Fail to create user", 1);
        setisAuthenticating(false);
        // navigate("/onBoarding");
        return;
      }
      if (res.data?.data?.member_company_id) console.log("present");
      res.data?.data?.member_company_id &&
        localStorage.setItem("companyid", res.data.data.member_company_id);
      setuserDetails({
        // userId: res.data.data.user_id,
        name: res.data.data.name,
        email:
          res.data.authType?.toLowerCase() === "member"
            ? "Member"
            : res.data.data.email,
        image: res.data.data.profile_icon_url,
        mobileNo:
          res.data.authType?.toLowerCase() === "member"
            ? "Member"
            : res.data.data.phone_number,
      });
      // navigate("/");
      // showToast("User created successfully");
    } catch (error) {
      console.log(error);
      showToast(
        error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "Something went wrong. Please try again",
        1
      );
      // navigate("/onBoarding");
    } finally {
      setisAuthenticating(false);
    }
  }, []);

  const loginMember = useCallback(
    async (username, password, setisLoading = () => {}) => {
      if (!username) {
        showToast("Username not found", 1);
        return;
      }
      if (!password) {
        showToast("Password not found", 1);
        return;
      }

      try {
        setisLoading(true);

        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/member/login/`,
          { username: username, password: password }
        );

        console.log(res);
        if (
          !res.data.token ||
          res.data?.message?.toLowerCase().includes("incorrect")
        ) {
          showToast(
            res.data?.message || "Somthing went wrong. Please try again",
            1
          );
          return;
        }

        showToast("Member logged in successfully");
        localStorage.setItem("token", res.data.token);
        // localStorage.setItem("companyid", res.data.data.company_id);
        await getUserDetails();

        navigate("/");
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
    []
  );

  const sendOtp = useCallback(
    async (mobileNo, setisLoading = () => {}) => {
      if (!mobileNo || !mobileNo.match(/^\d{10}$/)) {
        showToast("Username not found", 1);
        throw new Error("Username not found");
      }

      if (!recaptchaVerifier) {
        showToast("RecaptchaVerifier is not initiallized ", 1);
        throw new Error("RecaptchaVerifier is not initiallized");
      }

      const fullNumber = "+91" + mobileNo;

      try {
        setisLoading(true);
        const result = await signInWithPhoneNumber(
          auth,
          fullNumber,
          recaptchaVerifier
        );
        setConfirmation(result);
        showToast(`Verification code sent to +91 ${mobileNo}`);
      } catch (error) {
        console.error(error);
        setisLoading(false);
        if (error.code === "auth/invalid-phone-number") {
          showToast("Invalid phone number. Please check the number.", 1);
          throw new Error("Invalid phone number. Please check the number.");
        } else if (error.code === "auth/too-many-requests") {
          showToast("Too many requests. Please try again later.", 1);
          throw new Error("Too many requests. Please try again later.");
        } else {
          showToast("Failed to send OTP. Please try again.", 1);
          throw new Error("Failed to send OTP. Please try again.");
        }
      } finally {
        setisLoading(false);
      }
    },
    [auth, recaptchaVerifier]
  );

  const verifyOtp = useCallback(
    async (mobileNo, otp, setisLoading = () => {}) => {
      let firebaseToken = null;
      if (!mobileNo) {
        showToast("Username not found", 1);
        throw new Error("Username not found");
      }

      if (!otp) {
        showToast("OTP not found", 1);
        throw new Error("OTP not found");
      }

      if (!confirmation) {
        showToast("Something went wrong, please try again.", 1);
        return;
      }
      console.log(otp);
      try {
        setisLoading(true);
        const userCredential = await confirmation.confirm(String(otp));
        const idToken = await userCredential.user.getIdToken();
        firebaseToken = idToken;
        showToast("OTP Verified");
      } catch (err) {
        console.error("Invalid OTP", err);
        showToast("Please enter a valid 6-digit OTP");
      } finally {
        setisLoading(false);
      }

      return firebaseToken;
    },
    [auth, confirmation]
  );

  const checkMobileNumber = useCallback(async (mobileNo, setisLoading) => {
    if (!mobileNo) {
      showToast("Mobile No not found", 1);
      throw new Error("Mobile No not found");
    }

    try {
      setisLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/check-phone/`,
        { phone_number: `+91${mobileNo}` }
      );

      console.log(res);

      // if (res.data.user_registered) {
      //   showToast("Mobile number already exist", 1);
      //   setisLoading(false);
      //   throw new Error("Mobile number already exist");
      // }
      return res;
    } catch (error) {
      console.log(error);
      showToast(
        error.response.data.message ||
          error.response.data.message ||
          error.message ||
          "Something went wrong. Please try again",
        1
      );
      throw new Error("Something went wrong. Please try again");
    }
  }, []);

  const userLogin = useCallback(async (userData, setisLoading = () => {}) => {
    if (!userData) {
      showToast("Please provide user data", 1);
      return;
    }

    console.log(userData);

    try {
      setisLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/login/`,
        {
          firebase_token: userData.firebaseToken,
          phone_number: `+91${userData.mobileNumber}`,
          // name: userData.name,
          // email: userData.email,
        }
      );
      console.log(res);
      if (
        res.data.error ||
        (res.data.status && res.data.status?.toLowerCase() !== "success") ||
        !res.data.token ||
        res.data?.message?.toLowerCase().includes("incorrect")
      ) {
        showToast(res.data.error || "Fail to Login user", 1);
        setisLoading(false);
        // navigate("/onBoarding");
        return;
      }
      localStorage.setItem("token", res.data.token);
      showToast("User login successfully");
      await getUserDetails();

      navigate("/");
    } catch (error) {
      console.log(error);
      showToast(
        error.response.data.error ||
          error.response.data.message ||
          error.message ||
          "Something went wrong. Please try again",
        1
      );
      // navigate("/onBoarding");
    } finally {
      setisAuthenticating(false);
      setisLoading(false);
    }
  }, []);

  const userLogout = useCallback(async (setisLoading = () => {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Token not found", 1);
      return;
    }

    try {
      setisLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user/logout/`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(res);
      if (res.data?.status && res.data?.status.toLowerCase() !== "success") {
        showToast("Somthing went wrong. Please try again", 1);
        return;
      }

      localStorage.clear();

      window.location.href = "/";
    } catch (error) {
      console.log(error);
      showToast(
        error.response?.data?.detail ||
          error.message ||
          "Somthing went wrong. Please try again",
        1
      );
    } finally {
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!auth || isAuthenticating) return;
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response) => {
        console.log("reCAPTCHA verified");
      },
    });
    console.log(recaptcha);
    setrecaptchaVerifier(recaptcha);
    return () => {
      recaptcha.clear();
    };
  }, [auth, isAuthenticating]);

  useEffect(() => {
    getUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      localStorage.setItem("username", userDetails.name);
      // localStorage.setItem("userId", userDetails.userId);
      localStorage.setItem("email", userDetails.email);
      localStorage.setItem("mobileNo", userDetails.mobileNo);
      localStorage.setItem("profileImg", userDetails.image);
    }
  }, [userDetails]);

  if (isAuthenticating) {
    return (
      <>
        <LogoAnimation isShow={true} />
      </>
    );
  }

  if (!userDetails) {
    return (
      <>
        <UserContext.Provider
          value={{
            loginMember,
            createUser,
            sendOtp,
            verifyOtp,
            checkMobileNumber,
            userLogin,
          }}
        >
          <div id="recaptcha-container" />
          <Routes>
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/" element={<UserSignupPage />} />
            <Route path="/signup" element={<UserSignupPage />} />
          </Routes>
        </UserContext.Provider>
      </>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userDetails,
        loginMember,
        createUser,
        sendOtp,
        verifyOtp,
        checkMobileNumber,
        userLogin,
        userLogout,
      }}
    >
      <div id="recaptcha-container" />
      {children}
    </UserContext.Provider>
  );
};
