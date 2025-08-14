import { ChevronDown, Eye, EyeClosed } from "lucide-react";
import { DefaultDropdown, UsersDataDropDown } from "./DropDown";
import { useState, useRef, useEffect } from "react";
import { showToast } from "../showToast";

const Vendors = [
  {
    name: "Person 1",
    email: "person1@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Person 2",
    email: "person2@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Person 3",
    email: "person3@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Person 4",
    email: "person4@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export const InputField = ({
  additionalNote = "",
  isLoading = false,
  hasLabel = true,
  padding = 4,
  readOnly = false,
  className,
  required = false,
  label,
  inputType,
  icon,
  minHeight = 128,
  placeholder,
  isTextArea,
  hasDropDown = false,
  dropDownData,
  min,
  dropDownType = "default",
  value,
  setvalue,
  handelFormData,
  dropDownMaxHeight,
  maxLength,
  name,
  addnew,
  onClickAddNew,
  max,
  hasCustom = false,
  autoComplete = "on",
}) => {
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [isPasswordShow, setisPasswordShow] = useState(false);
  const containerRef = useRef(null);
  const dropDownRef = useRef(null);
  // console.log(label, value);

  useEffect(() => {
    const handelClickOutside = (e) => {
      if (
        containerRef.current &&
        dropDownRef.current &&
        !containerRef.current.contains(e.target) &&
        !dropDownRef.current.contains(e.target)
      ) {
        setisDropdownOpen(false);
      }
    };

    window.addEventListener("pointerdown", handelClickOutside);

    return () => {
      window.removeEventListener("pointerdown", handelClickOutside);
    };
  }, [containerRef.current, dropDownRef.current]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col overflow-y-visible relative ${className} `}
    >
      {hasLabel && (
        <label
          htmlFor={`input-${(
            label ||
            placeholder ||
            Math.random().toString()
          ).replace(/\s+/g, "")}`}
          className={` font-normal mb-1 2xl:text-lg xl:text-base lg:text-sm text-xs 
            ${!label ? "opacity-0" : ""}
            ${inputType === "password" ? "text-[#FB3748]" : "text-[#000000]"}`}
        >
          {label ? label : "label"}&nbsp;
          {required ? <span className=" text-red-600 ">*</span> : ""}
        </label>
      )}

      {additionalNote && <p className=" text-xs text-red-600 mb-1">{additionalNote}</p>}

      <div
        onClick={(e) => {
          if (hasDropDown) {
            e.preventDefault();
            // console.log("fijnvgrg sdjvfnjdn wiudfnijendf");
            setisDropdownOpen(!isDropdownOpen);
          }
        }}
        className={` ${
          isTextArea
            ? ""
            : `flex items-center ${
                inputType === "rupee" ? "" : "gap-2"
              } rounded-xl border-[#0000001A] border-[1.5px] px-${padding} py-3`
        }`}
      >
        {icon}
        {!isTextArea && (
          <input
            name={name || "input"}
            autoComplete={autoComplete}
            required={required}
            min={min}
            max={max}
            readOnly={hasDropDown || readOnly}
            onPaste={(e) => {
              if (
                inputType === "num" ||
                (inputType === "rupee" && e.target.value < 0)
              ) {
                showToast("Negative numbers not allowed.", 1);
                return;
              }

              if (inputType === "rupee") {
                const pasted = e.clipboardData.getData("Text");
                if (/\D/.test(pasted)) {
                  e.preventDefault(); // Cancel paste if it contains non-digits
                  showToast("Only numbers are allowed.", 1);
                }
              }

              if (maxLength && e.target.value.length > maxLength) {
                showToast(`Maximum length must be ${maxLength}`);
                return;
              }

              if (inputType === "tel") {
                const pasted = e.clipboardData.getData("Text");
                if (/\D/.test(pasted)) {
                  e.preventDefault(); // Cancel paste if it contains non-digits
                  showToast("Only numbers are allowed.", 1);
                }
              }
            }}
            onChange={(e) => {
              if (maxLength && e.target.value.length > maxLength) {
                showToast(`Maximum length must be ${maxLength}`, 1);
                return;
              }

              if (inputType === "rupee") {
                const newValue = e.target.value;
                const lastChar = newValue.slice(-1); // get the last character typed
                // console.log(lastChar);
                // If last character is not a digit, show alert
                if (lastChar && /\D/.test(lastChar)) {
                  showToast("Only numbers are allowed.", 1);
                  return; // don't update state with invalid input
                }
              }

              // console.log(e.target.value)
              if (
                (inputType === "num" && isNaN(Number(e.target.value))) ||
                Number(e.target.value || 0) < 0
              ) {
                const newValue = e.target.value;
                const lastChar = newValue.slice(-1); // get the last character typed
                // console.log(lastChar);
                // If last character is not a digit, show alert
                if (lastChar && /\D/.test(lastChar)) {
                  showToast("Only numbers are allowed.", 1);
                  return; // don't update state with invalid input
                }

                showToast("Negative numbers not allowed.", 1);
                return;
              }

              if (inputType === "tel") {
                const newValue = e.target.value;
                const lastChar = newValue.slice(-1); // get the last character typed
                // console.log(lastChar);
                // If last character is not a digit, show alert
                if (lastChar && /\D/.test(lastChar)) {
                  showToast("Only numbers are allowed.", 1);
                  return; // don't update state with invalid input
                }
              }

              handelFormData && handelFormData(e);

              setvalue && setvalue(e.target.value);
            }}
            tabIndex={0}
            id={`input-${
              label || placeholder || Math.random().toString()
            }`.replace(/\s+/g, "")}
            placeholder={placeholder}
            value={value}
            type={
              inputType === "password"
                ? isPasswordShow
                  ? "text"
                  : "password"
                : inputType || "text"
            }
            className={`w-full relative items-center outline-none 2xl:text-lg xl:text-base 
              lg:text-sm text-xs font-normal placeholder:text-[#00000080] text-[#343434] ${
                hasDropDown || readOnly ? "cursor-default" : ""
              }`}
          />
        )}

        {inputType === "password" && (
          <button
            aria-label="toggle password visibility"
            onClick={() => {
              setisPasswordShow(!isPasswordShow);
            }}
            className=" cursor-pointer"
          >
            {isPasswordShow && <Eye className=" w-5 h-5" />}
            {!isPasswordShow && <EyeClosed className=" w-5 h-5" />}
          </button>
        )}
        {isTextArea && (
          <textarea
            value={value}
            onChange={(e) => {
              setvalue(e.target.value);
            }}
            tabIndex={0}
            placeholder={placeholder}
            name={label}
            id={`input-${label || "label"}`.replace(/\s+/g, "")}
            className={`w-full placeholder:text-[#00000080] text-[#343434] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm text-xs rounded-lg p-3 border-[1.5px] border-[#0000001A]`}
            style={{ minHeight: `${minHeight}px` }}
          />
        )}
        {hasDropDown && (
          <button
            aria-label="toggle drop down"
            className=" outline-none cursor-pointer"
            onClick={() => {
              setisDropdownOpen(!isDropdownOpen);
            }}
          >
            <ChevronDown
              className={`w-5 h-5 text-[#000000B2] transition-transform ${
                isDropdownOpen ? "-rotate-180" : ""
              } `}
            />
          </button>
        )}
      </div>

      {hasDropDown && dropDownType === "default" && (
        <DefaultDropdown
          isLoading={isLoading}
          value={value}
          maxHeight={dropDownMaxHeight}
          hasCustom={hasCustom}
          setvalue={setvalue}
          setisDropdownOpen={setisDropdownOpen}
          dropDownRef={dropDownRef}
          data={dropDownData}
          isOpen={isDropdownOpen}
        />
      )}

      {hasDropDown && dropDownType === "usersData" && (
        <UsersDataDropDown
          isLoading={isLoading}
          value={value}
          maxHeight={dropDownMaxHeight}
          setvalue={setvalue}
          setisDropdownOpen={setisDropdownOpen}
          dropDownRef={dropDownRef}
          data={dropDownData}
          isOpen={isDropdownOpen}
          addnew={addnew}
          onClickAddNew={onClickAddNew}
        />
      )}
    </div>
  );
};
