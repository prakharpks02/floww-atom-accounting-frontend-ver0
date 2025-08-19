import { Loader2, Plus } from "lucide-react";

export const DefaultDropdown = ({
  isLoading = false,
  maxHeight = 200,
  data = [],
  className,
  isOpen,
  dropDownRef,
  setisDropdownOpen,
  setvalue,
  hasCustom,
  value,
}) => {
  // console.log(setvalue)
  return (
    <>
      <div
        ref={dropDownRef}
        className={`absolute top-[105%] left-0 w-full
       ${
         isOpen
           ? `  overflow-auto border-[1.5px]`
           : "h-0 overflow-x-hidden border-0 "
       }
      bg-white z-5 rounded-xl border-[#0000001A]
        ${className}`}
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && (
          <ul className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal placeholder:text-[#00000080] text-[#000000a1]">
            {data?.map((item, index) => {
              return (
                <li
                  tabIndex={0}
                  key={index}
                  onClick={(e) => {
                    setvalue(item.value);
                    setisDropdownOpen(false);
                  }}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                >
                  {item.name}{" "}
                </li>
              );
            })}
          </ul>
        )}
        {hasCustom && (
          <div className=" p-2 ">
            <textarea
              placeholder="Type here"
              value={value}
              onChange={(e) => {
                setvalue(e.target.value);
              }}
              className=" w-full rounded-lg border-1 2xl:text-lg xl:text-base lg:text-sm text-xs p-2 placeholder:text-[#00000080] text-[#000000a1] outline-gray-300 outline-1 min-h-[100px] max-h-[200px]"
            />
          </div>
        )}
      </div>
    </>
  );
};

export const UsersDataDropDown = ({
  isLoading,
  maxHeight = 400,
  data = [],
  className,
  isOpen,
  dropDownRef,
  setisDropdownOpen,
  setvalue,
  addnew,
  onClickAddNew,
}) => {
  return (
    <>
      <div
        ref={dropDownRef}
        className={`absolute top-[105%] right-0 w-full sm:max-w-sm overflow-auto
       ${
         isOpen
           ? "h-auto overflow-x-auto border-[2px] p-4 xl:p-6"
           : "h-0 overflow-x-hidden border-0 "
       }
      bg-[#fafafa] z-5 rounded-xl border-[#E8E8E8] 
      overflow-y-auto  ${className}`}
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {addnew && (
          <button
            tabIndex={0}
            onClick={onClickAddNew}
            className=" hover:bg-[#fafafa] mb-4 transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] text-base font-medium"
          >
            <div className=" p-0.5 rounded-full flex items-center bg-[#2543B1]">
              <Plus className="w-4 h-4 text-white" />
            </div>
            {`Add new ${addnew}`}
          </button>
        )}

        {isLoading && (
          <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {!isLoading && data && (
          <div className="">
            {data.map((person, index) => (
              <div
                key={index}
                onClick={(e) => {
                  setvalue(person);
                  setisDropdownOpen(false);
                }}
                className="flex items-center hover:bg-[#f3f3f3] gap-4 border-b-1  cursor-pointer border-b-[#0000001A] pb-3 pt-4 last:border-0 last:pb-0"
              >
                <div className=" text-2xl font-semibold flex items-center justify-center w-10 h-10 rounded-full bg-[#0a4f67] text-white">
                  {
                    (person.customer_name || person.vendor_name || "")
                      .split(".")[1]
                      ?.trim()[0]
                  }
                </div>

                <div>
                  {(person.customer_name || person.vendor_name) && (
                    <p className="text-base font-medium text-[#4A4A4A]">
                      {person.customer_name || person.vendor_name}
                    </p>
                  )}
                  {person.email && (
                    <p className="text-xs text-[#8E8E8E]">{person.email}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
