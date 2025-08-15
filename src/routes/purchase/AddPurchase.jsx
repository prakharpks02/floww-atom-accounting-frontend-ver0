import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  Plus,
  Upload,
  FilePlus,
  ChevronDown,
  Calendar,
  CalendarDays,
  PlusCircle,
  PencilLine,
  IndianRupee,
  X,
  Loader2,
} from "lucide-react";
import { showToast } from "../../utils/showToast";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { InputField } from "../../utils/ui/InputField";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  customersDropDown,
  StatusFieldsDropDown,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { AnimatePresence, motion } from "framer-motion";
import { ToWords } from "to-words";
import { PurchaseListContext } from "../../context/purchaseList/PurchaseListContext";
import { VendorContext } from "../../context/vendor/VendorContext";
import { PurchaseOrderContext } from "../../context/purchaseOrder/PurchaseOrderContext";

export const AddPurchase = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const {
    createPurchaseList,
    updatePurchaseList,
    getPurchaseListDetails,
    purchaseDetails,
  } = useContext(PurchaseListContext);
  const [isDataFechting, setisDataFechting] = useState(true);
  const { purchaseid } = useParams();

  useEffect(() => {
    getPurchaseListDetails(purchaseid, setisDataFechting);
  }, []);

  return (
    <>
      <ToastContainer />
      {isDataFechting && (
        <div className=" flex-1 flex justify-center items-center py-10 px-4 min-h-[300px]">
          <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
        </div>
      )}
      {!isDataFechting && (
        <div className=" p-6 md:px-4 xl:px-6 2xl:px-8 ">
          <h1 className=" md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#4A4A4A] font-semibold mb-1">
            Add New Purchase
          </h1>
          <p className="mb-6 font-medium md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4]">
            Create a new purchase record
          </p>

          {/* add Purchase details */}
          <div className=" md:p-4 lg:p-6 xl:p-7 2xl:p-8 border-[1.5px] border-[#0000001A] rounded-2xl ">
            {/* form heading  */}
            <h2 className="2xl:mb-8 xl:mb-7 lg:mb-6 md:mb-5 text-[#4A4A4A] font-semibold md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ">
              Purchase Information
            </h2>

            {/* Purchases info */}
            <div className="grid grid-cols-1 md:grid-cols-2 space-x-4 space-y-5">
              <PurchaseOrderNumber
                purchaseDetails={purchaseDetails}
                className={"col-span-2"}
              />
              <VendorNameInputField
                className={"col-span-1"}
                purchaseDetails={purchaseDetails}
              />
              <InvoiceNumber purchaseDetails={purchaseDetails} />
              <SelectStatusInputField purchaseDetails={purchaseDetails} />
              <PurchaseDateInputField purchaseDetails={purchaseDetails} />
              <VendorEmailInputField purchaseDetails={purchaseDetails} />
              <VendorMobileInputField purchaseDetails={purchaseDetails} />
              <GSTNumberInputField purchaseDetails={purchaseDetails} />
              <PANNumberInputField purchaseDetails={purchaseDetails} />
            </div>

            {/* item info  */}
            <ItemDetails purchaseDetails={purchaseDetails} />

            {/* Attachments Section */}
            <UploadInvoice purchaseDetails={purchaseDetails} />

            {/* Create Purchases Entry Button */}
            <div className="flex items-center space-x-4 2xl:text-xl xl:text-lg lg:text-base md:text-sm">
              <button
                disabled={isLoading}
                onClick={(e) => {
                  purchaseid?.toLowerCase() === "new" &&
                    createPurchaseList(e, setisLoading);
                  if (purchaseid?.toLowerCase() !== "new") {
                    updatePurchaseList(purchaseid, setisLoading);
                  }
                }}
                tabIndex={0}
                className=" cursor-pointer flex items-center gap-2 bg-[#2543B1] hover:bg-[#252eb1] text-white font-medium px-6 py-4 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <>
                    {purchaseid?.toLowerCase() !== "new" ? "Update" : "Save"}{" "}
                    Purchase
                    <Plus className=" ml-2 w-5 h-5 text-white inline-block" />
                  </>
                )}
              </button>
              <button
                tabIndex={0}
                className=" cursor-pointer text-[#4A4A4A] font-medium px-6 py-4 rounded-xl border-2 border-[#3333331A] hover:bg-gray-50 shadow-sm transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PurchaseOrderNumber = ({ purchaseDetails, className }) => {
  const [orderNo, setorderNo] = useState(purchaseDetails?.po_number || "");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  const { getPurchaseOrderList, purchaseOrderList } =
    useContext(PurchaseOrderContext);
  const [isLoading, setisLoading] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [query, setquery] = useState("");

  const dropDownRef = useRef();
  const containerRef = useRef();

  const handelSelectPOnumber = useCallback(
    (item) => {
      if (!item) return;
      console.log(item.list_items);
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.list_items,
        field: "listItems",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.po_number,
        field: "poNumber",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.vendor_id,
        field: "vendorId",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.contact_no,
        field: "contactNo",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.email,
        field: "email",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.vendor_name,
        field: "vendorName",
      });
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        value: item.gst_number,
        field: "gstNumber",
      });
    },
    [createPurchaseListFormDispatch]
  );

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "poNumber",
      value: orderNo,
    });
  }, [orderNo]);

  const filteredData = useMemo(() => {
    if (!purchaseOrderList) return;
    if (!query)
      return purchaseOrderList.filter((item) => {
        return item.vendor_name;
      });
    return (purchaseOrderList || []).filter((item) => {
      return item.po_number.toLowerCase().includes(query);
    });
  }, [query, purchaseOrderList]);

  useEffect(() => {
    getPurchaseOrderList(setisLoading);
  }, []);

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

  useEffect(() => {
    if (!purchaseDetails) return;
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.po_number,
      field: "poNumber",
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.vendor_id,
      field: "vendorId",
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.contact_no,
      field: "contactNo",
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.email,
      field: "email",
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.vendor_name,
      field: "vendorName",
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      value: purchaseDetails.gst_number,
      field: "gstNumber",
    });
  }, [purchaseDetails]);

  return (
    <div className={` relative ${className}`}>
      <label className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1">
        Purchase Order no <span className=" text-red-600 ">*</span>
      </label>

      <>
        {/* input area  */}
        <div
          ref={containerRef}
          className="rounded-xl border-[#0000001A] border-[1.5px] px-4
                py-3 flex items-center"
        >
          <input
            autoComplete
            required
            readOnly
            onClick={() => {
              setisDropdownOpen(!isDropdownOpen);
            }}
            tabIndex={0}
            placeholder={"Select Purchase order ID"}
            value={orderNo}
            className={`w-full relative items-center outline-none 2xl:text-lg xl:text-base 
                lg:text-sm text-xs font-normal placeholder:text-[#00000080]
                text-[#343434] cursor-default `}
          />
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
        </div>

        {/* dropdown purchase order list  */}
        <div
          ref={dropDownRef}
          className={`absolute top-[105%] left-0 w-full ${
            isDropdownOpen
              ? `overflow-auto border-[1.5px]`
              : "h-0 overflow-x-hidden border-0 "
          } bg-white z-5 rounded-xl border-[#0000001A]`}
          style={{ maxHeight: `250px` }}
        >
          {isLoading && (
            <div className=" flex-1 flex justify-center items-center py-8 px-4 min-h-[200px]">
              <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
            </div>
          )}

          {/* search bar  */}
          <input
            value={query}
            onChange={(e) => {
              setquery(e.target.value);
            }}
            type="text"
            placeholder="Search Purchase order ID"
            className=" rounded-t-xl rounded-b-md w-full text-sm text-gray-700 px-4 py-3 outline-none bg-gray-200/50 border-1 border-gray-300 "
          />

          {!isLoading && (
            <ul className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal placeholder:text-[#00000080] text-[#000000a1]">
              {filteredData?.map((item, index) => {
                if (item.list_items[0].item_name) {
                  return (
                    <li
                      tabIndex={0}
                      key={index}
                      onClick={(e) => {
                        console.log(item.list_items);
                        setorderNo(item.po_number);
                        handelSelectPOnumber(item);

                        setisDropdownOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                    >
                      {item.po_number}{" "}
                    </li>
                  );
                }
              })}
            </ul>
          )}
        </div>
      </>
    </div>
  );
};

const InvoiceNumber = ({ purchaseDetails }) => {
  const [orderNo, setorderNo] = useState(purchaseDetails?.invoice_no || "");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceNo",
      value: orderNo,
    });
  }, [orderNo]);
  return (
    <div>
      <InputField
        value={orderNo}
        setvalue={setorderNo}
        label={"Invoice no (optional)"}
        placeholder={"Enter invoice no"}
      />
    </div>
  );
};

const Description = ({ className }) => {
  const [desc, setdesc] = useState("");
  return (
    <div className={`mb-8 flex flex-col ${className}`}>
      <label
        htmlFor="add-Purchases-desciption"
        className="2xl:text-lg xl:text-base lg:text-sm md:text-xs font-normal mb-1"
      >
        Description*
      </label>
      <textarea
        value={desc}
        onChange={(e) => {
          setdesc(e.target.value);
        }}
        tabIndex={0}
        placeholder="Additional notes or description"
        name="desciption"
        id="add-Purchases-desciption"
        className=" text-[#000000c9] placeholder:text-[#00000080] border-dotted outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm md:text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};

const Amount = ({ className }) => {
  const [amount, setamount] = useState("");
  return (
    <div className={`grid  md:grid-cols-2 grid-cols-1 gap-4 mb-8 ${className}`}>
      <div className=" w-full ">
        <InputField
          value={amount}
          setvalue={setamount}
          inputType={"number"}
          label={"Amount"}
          placeholder={"₹0.00"}
        />
      </div>
      <div className=" w-full flex items-end">
        <span className="2xl:text-xl xl:text-lg lg:text-base md:text-sm font-medium text-[#4A4A4A]">
          Total Amount: $0.00
        </span>
      </div>
    </div>
  );
};

const ItemDetails = ({ purchaseDetails }) => {
  const blankItem = {
    item_description: "",
    unit_price: "",
    quantity: "",
    gross_amount: "",
    gst_amount: "",
    discount: "",
    hsn_code: "",
  };

  const { createPurchaseListForm, createPurchaseListFormDispatch } =
    useContext(PurchaseListContext);
  const [items, setItems] = useState(
    purchaseDetails?.list_items ||
      createPurchaseListForm.listItems || [blankItem]
  );

  // changes fields for particular item row
  const handleChange = (index, field, value) => {
    // Dispatch to reducer to update the item field
    createPurchaseListFormDispatch({
      type: "UPDATE_ITEM_FIELD",
      index,
      field,
      value,
    });

    // Update local items state
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);

    // update total amount
    if (
      items[index].unit_price &&
      items[index].quantity &&
      items[index].discount &&
      items[index].gst_amount
    ) {
      const temp = items;
      temp[index].gross_amount = (
        (Number(items[index].unit_price) *
          Number(items[index].quantity) *
          (100 - Number(items[index].discount)) *
          (100 + Number(items[index].gst_amount))) /
        10000
      ).toFixed(2);

      //update gross amount on create salea form
      createPurchaseListFormDispatch({
        type: "UPDATE_ITEM_FIELD",
        index,
        field: "gross_amount",
        value: temp[index].gross_amount,
      });
      setItems(temp);
    }
  };

  // add new row , also add the row to purchase reducer
  const addRow = () => {
    setItems([...items, blankItem]);
    createPurchaseListFormDispatch({
      type: "ADD_ITEM",
      item: blankItem,
    });
  };

  // remove a existing row , also remove the row to purchase reducer
  const removeRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    createPurchaseListFormDispatch({
      type: "REMOVE_ITEM",
      index,
    });
  };

  // reset state value when no purchase data
  useEffect(() => {
    if (!purchaseDetails) return;
  }, [purchaseDetails]);

  useEffect(() => {
    setItems(createPurchaseListForm?.listItems || []);
  }, [createPurchaseListForm]);

  //first set all item details to create purchase form
  useEffect(() => {
    if (purchaseDetails?.list_items) {
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        field: "listItems",
        value: purchaseDetails?.list_items,
      });
    }
  }, []);

  console.log(items, createPurchaseListForm?.listItems);

  return (
    <>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="mb-4">
            <div className=" grid grid-cols-12 space-x-2 space-y-4 mb-2">
              <div className=" overflow-x-auto col-span-6">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.item_description}
                  setvalue={(val) => {
                    handleChange(index, "item_name", val);
                    handleChange(index, "item_description", val);
                  }}
                  label={"Item Details"}
                  placeholder={"Enter Item name"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={4}
                  value={item.hsn_code}
                  setvalue={(val) => {
                    handleChange(index, "hsn_code", val);
                  }}
                  label={"HSN Code"}
                  placeholder={"ABCD"}
                  inputType={"text"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  value={item.unit_price}
                  setvalue={(val) => {
                    handleChange(index, "unit_price", val);
                    handleChange(index, "base_amount", val);
                  }}
                  label={"Rate"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.quantity}
                  setvalue={(val) => handleChange(index, "quantity", val)}
                  label={"Qnty"}
                  placeholder={"0"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.discount}
                  setvalue={(val) => handleChange(index, "discount", val)}
                  label={"Discount %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.gst_amount}
                  setvalue={(val) => handleChange(index, "gst_amount", val)}
                  label={"GST %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto col-span-3">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  readOnly={true}
                  value={item.gross_amount}
                  setvalue={(val) => handleChange(index, "gross_amount", val)}
                  label={"Amount"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6 w-full">
              {/* {isLast && (
                <button
                  tabIndex={0}
                  onClick={addRow}
                  className="hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium"
                >
                  <div className="p-0.5 rounded-full flex items-center bg-[#2543B1]">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  Add new row
                </button>
              )} */}
              {items.length > 1 && (
                <button
                  tabIndex={0}
                  onClick={() => removeRow(index)}
                  className="hover:bg-red-100 transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-red-600 bg-red-50 text-base font-medium"
                >
                  <div className="p-0.5 rounded-full flex items-center bg-red-600">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Remove
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div className=" grid grid-cols-2 gap-3 mb-6">
        <div className=" flex flex-col justify-between">
          {/* Additional Notes Section */}
          <AdditionalNotes
            className={"w-full"}
            purchaseDetails={purchaseDetails}
          />
        </div>
        <SubTotal purchaseDetails={purchaseDetails} />
      </div>
    </>
  );
};

const AdditionalNotes = ({ className, purchaseDetails }) => {
  const [notes, setnotes] = useState(purchaseDetails?.notes || "");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "notes",
      value: notes || "N/A",
    });
  }, [notes]);
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor="add-purchase-additional-notes"
        className="2xl:text-lg xl:text-base lg:text-sm md:text-xs font-normal mb-1"
      >
        Notes
      </label>
      <textarea
        value={notes}
        onChange={(e) => {
          setnotes(e.target.value);
        }}
        required
        tabIndex={0}
        placeholder="Additional notes or description"
        name="additional notes"
        id="add-purchase-additional-notes"
        className=" text-[#000000c9] placeholder:text-[#00000080] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm md:text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};

const VendorNameInputField = ({ className, purchaseDetails }) => {
  // const [vendor, setvendor] = useState({
  //   vendor_id: purchaseDetails?.vendor_id || "",
  //   vendor_name: purchaseDetails?.vendor_name || "",
  //   email: purchaseDetails?.email || "",
  //   contact_no: purchaseDetails?.contact_no || "",
  //   gst_number: purchaseDetails?.gst_number || "",
  //   pan_number: purchaseDetails?.pan_number || "",
  // });
  const { createPurchaseListForm } = useContext(PurchaseListContext);
  const [vendorName, setvendorName] = useState("");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { AllVendorList, getAllVendors } = useContext(VendorContext);

  // useEffect(() => {
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "vendorId",
  //     value: vendor?.vendor_id,
  //   });
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "vendorName",
  //     value: vendor?.vendor_name,
  //   });
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "email",
  //     value: vendor?.email,
  //   });
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "contactNo",
  //     value: vendor?.contact_no,
  //   });
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "gstNumber",
  //     value: vendor?.gst_number,
  //   });
  //   createPurchaseListFormDispatch({
  //     type: "UPDATE_FIELD",
  //     field: "panNumber",
  //     value: vendor?.pan_number,
  //   });
  // }, [vendor]);

  // get all customer list
  // useEffect(() => {
  //   getAllVendors(setisLoading);
  // }, []);

  useEffect(() => {
    setvendorName(createPurchaseListForm?.vendorName || "");
  }, [createPurchaseListForm]);

  return (
    <>
      <div className={`flex flex-col overflow-y-visible relative ${className}`}>
        <InputField
          required={true}
          value={vendorName}
          setvalue={setvendorName}
          readOnly={true}
          isLoading={isLoading}
          label={"Vendor Name"}
          placeholder={"Select or Create a vendor"}
        />
      </div>
    </>
  );
};

const VendorEmailInputField = () => {
  const { createPurchaseListForm } = useContext(PurchaseListContext);
  const [vendorEmail, setvendorEmail] = useState("");
  useEffect(() => {
    setvendorEmail(createPurchaseListForm?.email || "");
  }, [createPurchaseListForm]);

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          readOnly={true}
          value={vendorEmail}
          setvalue={setvendorEmail}
          label={"Vendor email address"}
          required={true}
          placeholder={"Enter email"}
          inputType={"email"}
        />
      </div>
    </>
  );
};

const VendorMobileInputField = () => {
  const { createPurchaseListForm } = useContext(PurchaseListContext);
  const [vendoreMobile, setvendoreMobile] = useState("");
  useEffect(() => {
    setvendoreMobile(createPurchaseListForm?.contactNo || "");
  }, [createPurchaseListForm]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          readOnly={true}
          maxLength={10}
          value={vendoreMobile}
          setvalue={setvendoreMobile}
          label={"Vendor phone number"}
          placeholder={"Enter mobile no."}
          inputType={"tel"}
          required={true}
        />
      </div>
    </>
  );
};

const SelectStatusInputField = ({ purchaseDetails }) => {
  const [status, setstatus] = useState(purchaseDetails?.status || "");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "status",
      value: status,
    });
  }, [status]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={status}
          setvalue={setstatus}
          required={true}
          label={"Status"}
          placeholder={"Select status"}
          hasDropDown={true}
          dropDownData={StatusFieldsDropDown}
        />
      </div>
    </>
  );
};

const PurchaseDateInputField = ({ purchaseDetails }) => {
  const [date, setdate] = useState(
    purchaseDetails?.purchase_date?.split("-").reverse().join("-") || ""
  );
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "purchaseDate",
      value: date.split("-").reverse().join("-"),
    });
  }, [date]);
  return (
    <>
      <div className=" relative">
        <InputField
          value={date}
          setvalue={setdate}
          required={true}
          label={"Purchase Date"}
          placeholder={"dd-mm-yyyy"}
          inputType="date"
          icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
        />
      </div>
    </>
  );
};

const GSTNumberInputField = () => {
  const { createPurchaseListForm } = useContext(PurchaseListContext);
  const [gstNumber, setgstNumber] = useState("");
  useEffect(() => {
    setgstNumber(createPurchaseListForm?.gstNumber || "");
  }, [createPurchaseListForm]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          readOnly={true}
          required={true}
          value={gstNumber}
          setvalue={setgstNumber}
          label={"GSTIN Number"}
          placeholder={"ABCDE1234F"}
        />
      </div>
    </>
  );
};

const PANNumberInputField = ({ purchaseDetails }) => {
  const [pan, setpan] = useState(purchaseDetails?.pan_number || "");
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "panNumber",
      value: pan,
    });
  }, [pan]);

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          required={true}
          readOnly={false}
          value={pan}
          setvalue={setpan}
          label={"PAN Number"}
          placeholder={"AFZPK7190K"}
        />
      </div>
    </>
  );
};

const UploadInvoice = ({ purchaseDetails }) => {
  const [files, setfiles] = useState(
    purchaseDetails?.attachments[0]?.related_doc_url == "N/A"
      ? []
      : purchaseDetails?.attachments
  );
  const { createPurchaseListFormDispatch } = useContext(PurchaseListContext);
  useEffect(() => {
    if (!files || files.length == 0) {
      createPurchaseListFormDispatch({
        type: "UPDATE_FIELD",
        field: "attachments",
        value: [
          {
            related_doc_name: "N/A",
            related_doc_url: "N/A",
          },
        ],
      });
      return;
    }
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "attachments",
      value: (files || []).map((file) => {
        return {
          fileBlob: file || "N/A",
          fileName: file.name || "N/A",
          related_doc_name: file.related_doc_name || "N/A",
          related_doc_url: file.related_doc_url || "N/A",
        };
      }),
    });
  }, [files]);

  return (
    <div className=" mb-6 outline-[#00000029] rounded-lg px-3 py-6 border-2 border-[#00000033] border-dashed">
      {files && files.length > 0 && (
        <div>
          <ShowUploadedFiles files={files} setfiles={setfiles} />
          <div className=" flex flex-col gap-2 items-center my-5">
            <label
              htmlFor="upload-invoice"
              className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
            >
              Browse files
            </label>
            <p className="text-[#00000080] text-xs ">
              Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
            </p>
          </div>
        </div>
      )}

      {(!files || files.length == 0) && (
        <label
          tabIndex={0}
          htmlFor="upload-invoice"
          className="flex flex-col items-center cursor-pointer"
        >
          <Upload className=" w-10 h-8 text-[#000000] mb-3" />
          <p className="font-medium xl:text-base md:text-sm mb-1">
            Upload invoices, receipts, or related documents
          </p>
          <p className="text-[#00000080] text-xs ">
            Supported formats: PDF, JPG, PNG, DOC (Max 10MB)
          </p>
        </label>
      )}

      <input
        type="file"
        accept=".pdf, .jpg, .jpeg, .png, .doc, .docx"
        id="upload-invoice"
        multiple
        onChange={(e) => {
          const maxSizeMB = 10;
          const validFiles = [];
          const invalidFiles = [];

          const files = Array.from(e.target.files);

          files.forEach((file) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
              showToast(`"${file.name}" is too large. Max size is 10MB.`, 1);
            }
          });

          // Do something with the valid files (e.g. store them in state)
          console.log("Valid files:", validFiles);
          setfiles((prev) => [...prev, ...validFiles]);

          // Clear the input to allow re-uploading the same files
          e.target.value = "";
        }}
        className="hidden"
      />
    </div>
  );
};

const SubTotal = ({ className, purchaseDetails }) => {
  const { createPurchaseListForm, createPurchaseListFormDispatch } =
    useContext(PurchaseListContext);
  const [subtotal, setsubtotal] = useState(
    createPurchaseListForm?.subtotalAmount || 0
  );
  const [discount, setdiscount] = useState(
    Number(purchaseDetails?.discount_amount || "0")
  );
  const [isAdjustment, setisAdjustment] = useState(
    purchaseDetails?.adjustmentAmount?.toString().toLowerCase() === "true"
      ? true
      : false
  );
  const [tds, settds] = useState({
    value: purchaseDetails?.tds_amount || "0%",
    name: purchaseDetails?.tds_reason || "N/A",
  });
  const [isTdsEnable, setisTdsEnable] = useState(true);
  const [grandTotal, setgrandTotal] = useState(
    purchaseDetails?.total_amount || 0.0
  );
  const [discountAmount, setdiscountAmount] = useState(0);
  const [taxableAmount, settaxableAmount] = useState(0);
  // console.log(purchaseDetails);

  //amount to words
  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
    },
  });

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "adjustmentAmount",
      value: isAdjustment,
    });
  }, [isAdjustment]);

  // calculate total when discount changes
  useEffect(() => {
    if (!tds.value) return;
    const tax = Number(tds.value.split("%")[0]);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [discount, tds, discount]);

  useEffect(() => {
    //calculate subtotal
    setsubtotal(
      createPurchaseListForm?.listItems.reduce((acc, item) => {
        return acc + parseFloat(item.gross_amount || 0);
      }, 0) || 0
    );
  }, [createPurchaseListForm]);

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "discountAmount",
      value: discount,
    });
    setdiscountAmount(((subtotal * discount) / 100).toFixed(2));
  }, [discount, subtotal]);

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "subtotalAmount",
      value: Number(subtotal).toFixed(2),
    });
    if (!tds) return;
    const tax = Number(tds.value.split("%")[0]);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [subtotal, discount, tds]);

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "totalAmount",
      value: isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal,
    });
  }, [grandTotal, isAdjustment]);

  useEffect(() => {
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsAmount",
      value: tds.value,
    });
    createPurchaseListFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsReason",
      value: tds.name || "N/A",
    });
    const tax = Number(tds.value.split("%")[0]);
    settaxableAmount(((subtotal * (100 - discount) * tax) / 10000).toFixed(2));
  }, [tds, subtotal, discount]);

  return (
    <>
      <div
        className={`bg-[#EBEFF3] xl:p-6 md:p-4 rounded-xl border-t-6 border-t-[#2543B1] ${className}`}
        style={{ boxShadow: "0px 4px 10px 0px #00000033" }}
      >
        {/* Subtotal */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base md:text-sm">
          <span className="font-medium ">Sub Total</span>
          <span className="">{Number(subtotal).toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base md:text-sm">
          <span htmlFor="discount" className=" font-normal ">
            Discount
          </span>
          <div className="px-3 py-2 w-fit rounded-lg border-[1px] ml-auto border-[#D2D2D2]">
            <input
              id="discount"
              type="number"
              placeholder={0}
              value={discount}
              onChange={(e) => {
                setdiscount(e.target.value);
              }}
              className=" outline-none max-w-[100px] text-sm placeholder:text-[#8E8E8E] text-[#414141] "
            />
          </div>
          <span>&nbsp; %</span>
          <span className="text-gray-800 ml-auto">-{discountAmount}</span>
        </div>

        {/* Tax Type + Dropdown */}
        <div className="flex items-center justify-between text-[#4A4A4A] gap-3 mb-4">
          {/* Radio buttons */}
          <div className="flex items-center gap-4">
            <label
              htmlFor="toggle tds"
              className=" md:text-sm text-xs font-medium flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A]"
            >
              <div
                className={` border-4 w-3.5 2xl:w-5 h-3.5 2xl:h-5 rounded-full transition ${
                  isTdsEnable ? "border-[#2543B1]" : "border-[#777777]"
                }`}
              />
              TDS
            </label>
            <input
              id="toggle tds"
              type="checkbox"
              value={isTdsEnable}
              onChange={() => {
                setisTdsEnable(!isTdsEnable);
              }}
              className=" cursor-pointer hidden"
            />
          </div>

          {/* Tax Dropdown */}
          <TaxDropdown
            value={tds.value}
            setvalue={settds}
            isDisabled={!isTdsEnable}
          />

          {/* Negative Tax Value */}
          <div className="text-gray-500 text-sm w-12 text-right">
            +{taxableAmount}
          </div>
        </div>

        <hr className="border-gray-300 mb-4" />

        {/* Total */}
        <div className="flex justify-between  items-center 2xl:text-2xl xl:text-xl lg:text-lg md:text-base font-medium text-[#333333]">
          <div className=" flex items-center gap-4">
            <span>Total</span>
            <div className=" flex items-center gap-2 cursor-pointer">
              <label
                htmlFor="toggle adjustment"
                className=" text-sm font-medium flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A]"
              >
                <div
                  className={` border-4 w-3.5 2xl:w-5 h-3.5 2xl:h-5 rounded-full transition ${
                    isAdjustment ? "border-[#2543B1]" : "border-[#777777]"
                  }`}
                />
                Adjustment
              </label>
              <input
                id="toggle adjustment"
                type="checkbox"
                value={isAdjustment}
                onChange={() => {
                  setisAdjustment(!isAdjustment);
                }}
                className=" cursor-pointer hidden"
              />
            </div>
          </div>
          <span>
            {isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal}
          </span>
        </div>
        <p className=" text-end font-medium 2xl:text-xl xl:text-lg lg:text-base text-xs text-[#606060] ">
          {toWords.convert(
            Number(isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal)
          )}{" "}
          Only
        </p>
      </div>
    </>
  );
};

const TaxDropdown = ({ value, setvalue, isDisabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(-1);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (ind) => {
    setSelectedOption(ind);
    setvalue(TDSDropDown[ind]);
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={`relative mx-auto w-full max-w-[200px] ${
        isDisabled ? "pointer-events-none" : ""
      }`}
    >
      <motion.div
        className="relative"
        initial={false}
        animate={isOpen ? "open" : "closed"}
      >
        <motion.button
          className={`w-full px-2 py-2 ${
            isDisabled ? "bg-gray-500/30" : "bg-white"
          } cursor-pointer  border rounded-md lg:text-sm text-xs text-gray-700 flex items-center justify-between border-gray-400`}
          whileHover={{
            borderColor: "#9CA3AF",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
          }}
          onClick={toggleDropdown}
        >
          {selectedOption >= 0
            ? TDSDropDown[selectedOption].value
            : value
            ? value
            : "Select an option"}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="text-gray-500 w-4 h-4" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              className="absolute left-1/2 -translate-x-1/2 z-10 w-full max-h-[200px] overflow-auto mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {(TDSDropDown || []).map((option, ind) => (
                <motion.li
                  key={ind}
                  className={`px-4 py-2 cursor-pointer text-sm text-gray-700 ${
                    selectedOption === ind ? "bg-[#e8e8e8]" : "bg-white"
                  } hover:bg-[#F3F4F6] cursor-pointer`}
                  onClick={() => handleOptionClick(ind)}
                >
                  {option.name}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
