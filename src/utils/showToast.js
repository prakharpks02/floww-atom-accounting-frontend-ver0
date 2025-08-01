import { toast } from "react-toastify";

export const showToast = (msg, err) => {
  const toastId = msg; // Or a hash of the msg if msg can be long or identical
  toast.dismiss(toastId); // Close it if it exists

  const config = {
    toastId,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  if (err) {
    toast.error(msg, config);
  } else {
    toast.success(msg, config);
  }
};

