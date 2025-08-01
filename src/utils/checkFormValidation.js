import { showToast } from "./showToast";

export const validateFields = (formData) => {
  const errorsObj = {};

  // Regex patterns
  const regexMap = {
    gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    cin: /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/,
  };

  const validate = (data, path = "") => {
    if (Array.isArray(data)) {
      if (data.length === 0) {
        errorsObj[path] = `${path} is required.`;
      } else {
        data.forEach((item, index) => {
          validate(item, `${path}[${index}]`);
        });
      }
    } else if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        validate(value, path ? `${path}.${key}` : key);
      }
    } else {
      if (path.toLowerCase().includes("landmark")) {
        return;
      }
      if (data === "" || data === null || data === undefined) {
        errorsObj[path] = `${path} is required.`;
      } else {
        const lowerPath = path.toLowerCase();

        if (lowerPath.includes("gst") && !regexMap.gst.test(data)) {
          errorsObj[path] = "Invalid GST number.";
          showToast("Enter a valid GST number", 1);
          return;
        } else if (lowerPath.includes("pan") && !regexMap.pan.test(data)) {
          errorsObj[path] = "Invalid PAN number.";
          showToast("Enter a valid PAN number", 1);
          return;
        } else if (lowerPath.includes("email") && !regexMap.email.test(data)) {
          errorsObj[path] = "Invalid email address.";
          showToast("Enter a valid email id", 1);
          return;
        } else if (lowerPath.includes("cin") && !regexMap.cin.test(data)) {
          errorsObj[path] = "Invalid CIN number.";
          showToast("Enter a valid CIN number", 1);
          return;
        }
      }
    }
  };

  validate(formData);
  return errorsObj;
};
