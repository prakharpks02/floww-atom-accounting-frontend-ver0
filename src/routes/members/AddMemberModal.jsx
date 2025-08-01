import { useState, useEffect, useContext, useCallback } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { InputField } from "../../utils/ui/InputField";
import { showToast } from "../../utils/showToast";
import { ToastContainer } from "react-toastify";
import { AddmemberContext } from "../../context/addMember/AddmemberContext";

const AddMemberModal = ({
  isOpen,
  onClose,
  setisMemberListLoading = () => {},
}) => {
  const [formData, setFormData] = useState({
    memberName: "",
    username: "",
    memberPassword: "",
    image: null,
    imageUrl: "",
    role: "",
  });
  const { createMember, addMemberFormdispatch, getAllMemberList } =
    useContext(AddmemberContext);
  const [isLoading, setisLoading] = useState(false);

  // type somthing on input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    //update the context form data
    addMemberFormdispatch({
      type: "UPDATE_FIELD",
      field: name,
      value: value,
    });
  };

  // select profile image and preview that image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imageUrl: URL.createObjectURL(file),
      }));
      //update the context form data
      addMemberFormdispatch({
        type: "UPDATE_FIELD",
        field: "profileIconUrl",
        value: {
          fileBlob: file || "N/A",
          fileName: file.name || "N/A",
        },
      });
    }
  };

  // remove profile image
  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imageUrl: "" }));
    //update the context form data
    addMemberFormdispatch({
      type: "UPDATE_FIELD",
      field: profileIconUrl,
      value: "",
    });
  };

  // submit form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.memberName) {
        showToast("Name is required", 1);
        return;
      }
      if (!formData.username) {
        showToast("Username is required", 1);
        return;
      }
      if (!formData.memberPassword) {
        showToast("Password is required", 1);
        return;
      }
      if (!formData.imageUrl) {
        showToast("Profile image is required", 1);
        return;
      }
      try {
        await createMember(e, setisLoading);
        getAllMemberList(setisMemberListLoading);
        onClose();
        // window.location.reload()
      } catch (error) {
        // showToast(error.message, 1);
        console.log(error);
      }
    },
    [formData]
  );

  // toggle modal
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: "",
        username: "",
        password: "",
        image: null,
        imageUrl: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer />
      <div className="fixed w-[100dvw] top-0 left-0 h-[100dvh]  overflow-auto z-50 bg-black/50 backdrop-blur-sm   p-5">
        <div className="bg-white rounded-xl w-[90%] max-w-md min-h-[600px] shadow-lg p-6 animate-slideDown relative mx-auto">
          {/* <button
          onClick={onClose}
          className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600`}
        >
          <X size={20} />
        </button> */}

          <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl text-lg font-semibold mb-1">
            Add New Members
          </h2>
          <p className="xl:text-base md:text-sm text-xs text-[#777777] mb-6">
            Choose how to update the timeline
          </p>

          <div className="space-y-4">
            <InputField
              name="memberName"
              label="Name"
              placeholder="Enter full name"
              value={formData.name}
              handelFormData={handleChange}
            />
            <InputField
              name="username"
              label="Username"
              placeholder="Enter username"
              value={formData.username}
              handelFormData={handleChange}
            />
            <InputField
              name="role"
              label="Role"
              placeholder="Enter role"
              value={formData.role}
              handelFormData={handleChange}
            />
            <InputField
              name="memberPassword"
              label="Password"
              inputType={"password"}
              placeholder="Enter password"
              value={formData.password}
              handelFormData={handleChange}
            />

            <p className=" font-normal mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs  text-black">
              Profile icon
            </p>
            <div className="border-2 border-dashed border-[#00000033] rounded-lg p-4 text-center">
              {formData.imageUrl ? (
                <div className="space-y-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-24 h-24 mx-auto rounded-full object-cover"
                  />
                  <div className="flex justify-center gap-8 mt-5">
                    <button
                      onClick={() =>
                        document.getElementById("profile-imageInput")?.click()
                      }
                      className="text-blue-800 font-medium cursor-pointer text-sm"
                    >
                      Change
                    </button>
                    <button
                      onClick={removeImage}
                      className="text-red-500 font-medium cursor-pointer text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  tabIndex={0}
                  htmlFor="profile-imageInput"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className=" w-5 h-5" />
                  <p className="mt-2 text-sm">Enter profile image</p>
                  <p className="text-xs text-gray-400">
                    Supported formats: jpeg, JPG, PNG (Max 5MB)
                  </p>
                </label>
              )}
            </div>
            <input
              type="file"
              id="profile-imageInput"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImageChange}
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <button
                disabled={isLoading}
                onClick={onClose}
                className="col-span-1 py-2 border-2 border-[#3333331A] rounded-xl hover:bg-gray-100 transition cursor-pointer text-[#777777] "
              >
                Cancel
              </button>
              <button
                aria-label="Add Member"
                onClick={handleSubmit}
                disabled={isLoading}
                className=" col-span-1 cursor-pointer flex items-center justify-center px-3 lg:px-5 py-1 lg:py-3 bg-[#2543B1] transition hover:bg-blue-900 border-2 border-[#3333331A] rounded-xl text-[#ffffff] font-medium "
              >
                {isLoading ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <>
                    <span className="">Add Member</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMemberModal;
