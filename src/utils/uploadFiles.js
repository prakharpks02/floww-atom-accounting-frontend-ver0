import axios from "axios";
import { showToast } from "./showToast";

export const uploadFile = async (fileName, fileBlob, authToken) => {
  if (!fileName || !fileBlob || !authToken) {
    showToast("All fields are required", 1);
    return;
  }

  const formData = new FormData();
  formData.append("fileName", fileName);
  formData.append("fileBlob", fileBlob);

  try {
    const response = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/integration/upload-general-file/`,
      formData,
      {
        headers: {
          Authorization: `${authToken}`, 
        },
      }
    );

    console.log("Upload success:", response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(
      error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "Something went wrong. Please try again"
    );
  }
};
