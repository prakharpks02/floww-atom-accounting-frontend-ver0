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
import { motion, AnimatePresence, number } from "framer-motion";
import { showToast } from "../../utils/showToast";
import {
  useFetcher,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { InputField } from "../../utils/ui/InputField";
import { ToastContainer } from "react-toastify";
import { ShowUploadedFiles } from "../../utils/ui/ShowUploadedFiles";
import {
  customersDropDown,
  PaymentMethodDropDown,
  StatusFieldsDropDown,
  TDSDropDown,
} from "../../utils/dropdownFields";
import { SalesContext } from "../../context/sales/salesContext";
import { CustomerContext } from "../../context/customer/customerContext";
import { ToWords } from "to-words";
import { formatISODateToDDMMYYYY } from "../../utils/formateDate";
import {
  QuotationContext,
  QuotationContextProvider,
} from "../../context/quotation/QuotationContext";

export const AddSales = () => {
  const navigate = useNavigate();
  const { salesid } = useParams();
  const { createSales, updateSales, saleDetails, getSaleDetails } =
    useContext(SalesContext);
  const [isLoading, setisLoading] = useState(false);
  const [isDataFechting, setisDataFechting] = useState(true);

  useEffect(() => {
    getSaleDetails(salesid, setisDataFechting);
  }, []);

  return (
    <>
      <ToastContainer />
      <div className=" p-6 px-3 md:px-4 xl:px-6 2xl:px-8">
        <h1 className=" text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-[#4A4A4A] font-semibold mb-1">
          Add Sale
        </h1>
        <p className="mb-6 font-medium text-xs md:text-sm lg:text-base xl:text-lg 2xl:text-xl text-[#A4A4A4]">
          Create a new sales record
        </p>

        {isDataFechting && (
          <div className=" flex-1 flex justify-center items-center py-10 px-4 min-h-[300px]">
            <Loader2 className=" animate-spin md:w-10 md:h-10 w-8 h-8  text-gray-700" />
          </div>
        )}

        {/* add sale details */}
        {!isDataFechting && (
          <div className="p-3 md:p-4 lg:p-6 xl:p-7 2xl:p-8 border-[1.5px] border-[#0000001A] rounded-2xl ">
            {/* form heading  */}
            <h2 className="2xl:mb-8 xl:mb-7 lg:mb-6 mb-5 text-[#4A4A4A] font-semibold text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl ">
              Sales Information
            </h2>

            {/* sales info */}
            <QuotationContextProvider>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 space-y-8 mb-8">
                <CustomerNameInputField saleDetails={saleDetails} />
                {/* <SalesPersonInputField /> */}
                <CustomerEmailInputField saleDetails={saleDetails} />
                <CustomerMobileInputField saleDetails={saleDetails} />
                <SaleDateInputField saleDetails={saleDetails} />
                <PaymentMethodInputField saleDetails={saleDetails} />
                <SelectStatusInputField saleDetails={saleDetails} />
                <QuotationIDInputField saleDetails={saleDetails} />
                <GSTNumberInputField saleDetails={saleDetails} />
                <PANNumberInputField saleDetails={saleDetails} />
              </div>

              {/* Items info */}
              <ItemDetails saleDetails={saleDetails} />
            </QuotationContextProvider>

            {/* Terms and Conditions */}
            <TermsAndConditions saleDetails={saleDetails} />

            {/* Attachments Section */}
            <div className="mb-8 flex flex-col">
              <span className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-2">
                Attachments
              </span>

              <div className=" grid grid-cols-1  gap-3">
                {/* <div
                  tabIndex={0}
                  onClick={() => {
                    navigate("/sales/createInvoice");
                  }}
                  className="outline-[#00000029] h-fit rounded-lg p-3 border-[1.5px] border-[#0000001A] flex flex-col items-center justify-center cursor-pointer"
                >
                  <PencilLine className=" sm:w-10 w-8 sm:h-8 h-6 text-[#4A4A4A] mb-3" />
                  <p className="font-medium xl:text-base text-sm mb-1 text-[#000000CC]">
                    Create Invoice
                  </p>
                  <p className="text-[#00000080] text-xs">
                    You can create your invoice here itself
                  </p>
                </div> */}

                <UploadDocuments saleDetails={saleDetails} />
              </div>
            </div>

            {/* Create Sales Entry Button */}
            <div className="flex sm:flex-row flex-col sm:items-center gap-x-4 gap-y-4 2xl:text-xl xl:text-lg lg:text-base text-sm">
              <button
                disabled={isLoading}
                tabIndex={0}
                onClick={async (e) => {
                  try {
                    if (salesid?.toLowerCase() === "new") {
                      const newSalesId = await createSales(e, setisLoading);
                      const searchParams = new URLSearchParams(
                        window.location.search
                      );
                      const invoiceNo = searchParams.get("invoiceNo");
                      if (invoiceNo) {
                        navigate(`/sales/createInvoice?salesId=${newSalesId}`);
                      } else {
                        navigate("/sales/salesList");
                      }
                    } else {
                      await updateSales(salesid, setisLoading);
                      navigate(`/sales/saleDetails/${salesid}`);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className=" cursor-pointer justify-center flex items-center gap-2 bg-[#2543B1] hover:bg-[#252eb1] text-white font-medium px-6 py-4 rounded-xl transition-all duration-200"
              >
                {isLoading ? (
                  <Loader2 className=" animate-spin w-5 h-5 text-white" />
                ) : (
                  <div className=" w-full">
                    {salesid?.toLowerCase() !== "new" ? "Update" : "Add"} Sales
                    Entry
                    <Plus className=" ml-2 w-5 h-5 text-white inline-block" />
                  </div>
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
        )}
      </div>
    </>
  );
};

const UploadDocuments = ({ saleDetails }) => {
  const [files, setfiles] = useState(
    saleDetails?.invoice_url &&
      saleDetails?.invoice_url[0]?.invoice_url != "N/A"
      ? saleDetails?.invoice_url?.map((item) => {
          return { name: item.invoice_url, related_doc_url: item.invoice_url };
        })
      : []
  );

  const { createSaleFormDispatch } = useContext(SalesContext);

  useEffect(() => {
    if (!files || files.length == 0) {
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "invoiceUrl",
        value: [
          {
            related_doc_name: "N/A",
            related_doc_url: "N/A",
          },
        ],
      });
      return;
    }
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "invoiceUrl",
      value: (files || []).map((item) => {
        return {
          fileBlob: item || "N/A",
          fileName: item.name || "N/A",
          related_doc_name: item.related_doc_url || "N/A",
          related_doc_url: item.related_doc_url || "N/A",
        };
      }),
    });
  }, [files, createSaleFormDispatch]);

  return (
    <div className=" outline-[#00000029] rounded-lg p-3 border-2 border-[#00000033] border-dashed">
      {files && files.length > 0 && (
        <div>
          <ShowUploadedFiles files={files} setfiles={setfiles} />
          <div className=" flex flex-col gap-2 items-center my-5">
            <label
              htmlFor="upload-invoice"
              className="bg-black cursor-pointer py-3 px-6 text-sm xl:text-base text-white rounded-lg "
            >
              Choose files
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
          <Upload className="sm:w-10 w-8 sm:h-8 h-6 text-[#000000] mb-3" />
          <p className="font-medium xl:text-base text-sm mb-1 text-center">
            Upload invoices, receipts, or related documents
          </p>
          <p className="text-[#00000080] text-xs text-center ">
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
          const maxSizeMB = 25;
          const validFiles = [];
          const invalidFiles = [];

          const files = Array.from(e.target.files);

          files.forEach((file) => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
              validFiles.push(file);
            } else {
              invalidFiles.push(file.name);
              showToast(`"${file.name}" is too large. Max size is 25MB.`, 1);
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

const ItemDetails = ({ saleDetails }) => {
  const blankItem = {
    item_description: "",
    unit_price: "",
    quantity: "",
    gross_amount: "",
    gst_amount: "",
    discount: "",
    hsn_code: "",
    item_name: "",
    base_amount: "",
  };

  const { createSaleFormDispatch, createSaleForm } = useContext(SalesContext);
  const { selectedQuotationItems } = useContext(QuotationContext);
  const [items, setItems] = useState([blankItem]);
  const { pathname } = useLocation();

  // changes fields for particular item row
  const handleCustomItemChange = (index, field, value) => {
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
      createSaleFormDispatch({
        type: "UPDATE_ITEM_FIELD",
        index,
        field: "gross_amount",
        value: temp[index].gross_amount,
      });
      setItems(temp);
    }
  };

  // changes fields for particular item row ... item from the selected quotation
  const handleQuotationItemChange = useCallback(
    (index, field, value) => {
      // Update local items state
      const updatedItems = [...createSaleForm.selectedQuotationItems];
      updatedItems[index][field] = value;
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "selectedQuotationItems",
        value: updatedItems,
      });

      if (
        updatedItems[index].unit_price &&
        updatedItems[index].quantity &&
        updatedItems[index].discount &&
        updatedItems[index].gst_amount
      ) {
        console.log("'hiii");
        updatedItems[index]["gross_amount"] = (
          (Number(updatedItems[index].unit_price) *
            Number(updatedItems[index].quantity) *
            (100 - Number(updatedItems[index].discount)) *
            (100 + Number(updatedItems[index].gst_amount))) /
          10000
        ).toFixed(2);
        console.log(updatedItems);

        //update gross amount on create salea form
        createSaleFormDispatch({
          type: "UPDATE_FIELD",
          field: "selectedQuotationItems",
          value: updatedItems,
        });
      } else {
        updatedItems[index]["gross_amount"] = 0;
        //update gross amount on create salea form
        createSaleFormDispatch({
          type: "UPDATE_FIELD",
          field: "selectedQuotationItems",
          value: updatedItems,
        });
      }
    },
    [createSaleForm]
  );

  // add new row , also add the row to sales reducer
  const addCustomItemRow = () => {
    setItems([...items, blankItem]);
    createSaleFormDispatch({
      type: "ADD_ITEM",
      item: blankItem,
    });
  };

  // remove a existing row , also remove the row to sales reducer
  const removeCustomItemRow = (index) => {
    const updatedItems = items.filter((_, idx) => idx !== index);
    setItems(updatedItems);
    createSaleFormDispatch({
      type: "REMOVE_ITEM",
      index,
    });
  };

  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      value: items,
      field: "listItems",
    });
  }, [items]);

  // reset the create sale form to intial value when not in addSales page
  useEffect(() => {
    !pathname.toLowerCase().includes("sales/addSales") && setItems([blankItem]);
  }, [pathname]);

  useEffect(() => {
    setItems(saleDetails?.list_items || [blankItem]);
  }, [saleDetails]);

  return (
    <>
      {createSaleForm.selectedQuotationItems?.map((item, index) => {
        return (
          <div key={index} className="mb-4">
            <div className=" grid md:grid-cols-12 grid-cols-2 space-x-2 space-y-4 mb-6">
              <div className=" overflow-x-auto md:col-span-6 col-span-2">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.item_description}
                  setvalue={(val) => {
                    handleQuotationItemChange(index, "item_name", val);
                    handleQuotationItemChange(index, "item_description", val);
                  }}
                  label={"Item Details"}
                  placeholder={"Enter Item name"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={4}
                  value={item.hsn_code}
                  setvalue={(val) => {
                    handleQuotationItemChange(index, "hsn_code", val);
                  }}
                  label={"HSN Code"}
                  placeholder={"ABCD"}
                  inputType={"text"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  value={item.unit_price}
                  setvalue={(val) => {
                    handleQuotationItemChange(index, "unit_price", val);
                    handleQuotationItemChange(index, "base_amount", val);
                  }}
                  label={"Rate"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.quantity}
                  setvalue={(val) =>
                    handleQuotationItemChange(index, "quantity", val)
                  }
                  label={"Qnty"}
                  placeholder={"0"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.discount}
                  setvalue={(val) =>
                    handleQuotationItemChange(index, "discount", val)
                  }
                  label={"Discount %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.gst_amount}
                  setvalue={(val) =>
                    handleQuotationItemChange(index, "gst_amount", val)
                  }
                  label={"GST %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-2">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  readOnly={true}
                  value={item.gross_amount}
                  setvalue={(val) =>
                    handleQuotationItemChange(index, "gross_amount", val)
                  }
                  label={"Amount"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            {items.length +
              (createSaleForm.selectedQuotationItems?.length || 0) ==
              1 && (
              <button
                tabIndex={0}
                onClick={addCustomItemRow}
                className="hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium"
              >
                <div className="p-0.5 rounded-full flex items-center bg-[#2543B1]">
                  <Plus className="w-4 h-4 text-white" />
                </div>
                Add new row
              </button>
            )}
            {items.length +
              (createSaleForm.selectedQuotationItems?.length || 0) >
              1 && (
              <div className="flex gap-4 mb-6 w-full">
                <button
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    createSaleFormDispatch({
                      type: "UPDATE_FIELD",
                      field: "selectedQuotationItems",
                      value: createSaleForm.selectedQuotationItems.filter(
                        (_, i) => i !== index
                      ),
                    });
                  }}
                  className="hover:bg-red-100 transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-red-600 bg-red-50 text-base font-medium"
                >
                  <div className="p-0.5 rounded-full flex items-center bg-red-600">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="mb-4">
            <div className=" grid md:grid-cols-12 grid-cols-2 space-x-2 space-y-4 mb-6">
              <div className=" overflow-x-auto md:col-span-6 col-span-2">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.item_description}
                  setvalue={(val) => {
                    handleCustomItemChange(index, "item_name", val);
                    handleCustomItemChange(index, "item_description", val);
                  }}
                  label={"Item Details"}
                  placeholder={"Enter Item name"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={4}
                  value={item.hsn_code}
                  setvalue={(val) => {
                    handleCustomItemChange(index, "hsn_code", val);
                  }}
                  label={"HSN Code"}
                  placeholder={"ABCD"}
                  inputType={"text"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  value={item.unit_price}
                  setvalue={(val) => {
                    handleCustomItemChange(index, "unit_price", val);
                    handleCustomItemChange(index, "base_amount", val);
                  }}
                  label={"Rate"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  value={item.quantity}
                  setvalue={(val) =>
                    handleCustomItemChange(index, "quantity", val)
                  }
                  label={"Qnty"}
                  placeholder={"0"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.discount}
                  setvalue={(val) =>
                    handleCustomItemChange(index, "discount", val)
                  }
                  label={"Discount %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-1">
                <InputField
                  required={true}
                  autoComplete="off"
                  max={100}
                  min={0}
                  value={item.gst_amount}
                  setvalue={(val) =>
                    handleCustomItemChange(index, "gst_amount", val)
                  }
                  label={"GST %"}
                  placeholder={"0.00"}
                  inputType={"number"}
                />
              </div>
              <div className=" overflow-x-auto md:col-span-3 col-span-2">
                <InputField
                  required={true}
                  autoComplete="off"
                  padding={2}
                  readOnly={true}
                  value={item.gross_amount}
                  setvalue={(val) =>
                    handleCustomItemChange(index, "gross_amount", val)
                  }
                  label={"Amount"}
                  placeholder={"0.00"}
                  icon={<IndianRupee className=" w-5 h-5 text-[#4A4A4A]" />}
                  inputType={"rupee"}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6 w-full">
              {isLast && (
                <button
                  tabIndex={0}
                  onClick={addCustomItemRow}
                  className="hover:bg-[#0033662c] transition opacity-80 px-4 py-3 cursor-pointer flex items-center gap-2 rounded-xl text-[#2543B1] bg-[#0033661A] text-base font-medium"
                >
                  <div className="p-0.5 rounded-full flex items-center bg-[#2543B1]">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  Add new row
                </button>
              )}
              {items.length +
                (createSaleForm.selectedQuotationItems?.length || 0) >
                1 && (
                <button
                  tabIndex={0}
                  onClick={() => removeCustomItemRow(index)}
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

      <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-3 gap-y-8 mb-6">
        <div className=" flex flex-col justify-between md:order-1 order-2">
          {/* Additional Notes Section */}
          <AdditionalNotes className={"w-full"} saleDetails={saleDetails} />
        </div>
        <SubTotal saleDetails={saleDetails} className={"md:order-2 order-1"} />
      </div>
    </>
  );
};

const AdditionalNotes = ({ className, saleDetails }) => {
  const [notes, setnotes] = useState(saleDetails?.notes || "N/A");
  const { createSaleFormDispatch } = useContext(SalesContext);

  useEffect(() => {
    if (!notes) {
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "notes",
        value: "N/A",
      });
      return;
    }
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "notes",
      value: notes,
    });
  }, [notes]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setnotes("N/A");
    }
  }, [saleDetails]);

  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor="add-sales-additional-notes"
        className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1"
      >
        Notes
      </label>
      <textarea
        value={notes.includes("N/A") ? "" : notes}
        onChange={(e) => {
          setnotes(e.target.value);
        }}
        required
        tabIndex={0}
        placeholder="Additional notes or description"
        name="additional notes"
        id="add-sales-additional-notes"
        className=" text-[#000000c9] placeholder:text-[#00000080] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};

const TermsAndConditions = ({ className, saleDetails }) => {
  const [conditions, setconditions] = useState(
    saleDetails?.list_toc[0]?.terms_of_service || "N/A"
  );
  const { createSaleFormDispatch } = useContext(SalesContext);

  useEffect(() => {
    if (!conditions) {
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "listToc",
        value: [
          {
            terms_of_service: "N/A",
          },
        ],
      });
      return;
    }
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "listToc",
      value: [
        {
          terms_of_service: conditions,
        },
      ],
    });
  }, [conditions]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setconditions("N/A");
    }
  }, [saleDetails]);
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label
        htmlFor="add-sales-terms-condition"
        className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1"
      >
        Terms and Conditions
      </label>
      <textarea
        value={conditions.includes("N/A") ? "" : conditions}
        onChange={(e) => {
          setconditions(e.target.value);
        }}
        required
        tabIndex={0}
        placeholder="Enter Terms and Conditions of your business for the transaction"
        name="terms and condition"
        id="add-sales-terms-condition"
        className=" text-[#000000c9] placeholder:text-[#00000080] outline-[#00000029] 2xl:text-lg xl:text-base lg:text-sm text-xs min-h-[128px] rounded-lg p-3 border-[1.5px] border-[#0000001A] "
      />
    </div>
  );
};

const CustomerNameInputField = ({ saleDetails }) => {
  const [customer, setcustomer] = useState({
    customer_name: saleDetails?.customer_name || "",
    customer_id: saleDetails?.customer_id || "",
    email: saleDetails?.email || "",
    contact_no: saleDetails?.contact_no || "",
    gst_number: saleDetails?.gstin_number || "",
    pan_number: saleDetails?.pan_number || "",
    address: saleDetails?.address || "",
  });
  const [isLoading, setisLoading] = useState(true);
  const navigate = useNavigate();
  const { createSaleFormDispatch } = useContext(SalesContext);
  const { AllCustomersList, getAllCustomers } = useContext(CustomerContext);

  useEffect(() => {
    customer.customer_id &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "customerId",
        value: customer.customer_id,
      });
    customer.customer_name &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "customerName",
        value: customer.customer_name,
      });
    customer.email &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "email",
        value: customer.email,
      });
    customer.contact_no &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "contactNo",
        value: customer.contact_no,
      });
    customer.gst_number &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "gstinNumber",
        value: customer.gst_number,
      });
    customer.pan_number &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "panNumber",
        value: customer.pan_number,
      });
    customer.pan_number &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "address",
        value: customer.address,
      });
  }, [customer]);

  // get all customer list
  useEffect(() => {
    getAllCustomers(setisLoading);
  }, []);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setcustomer({
        customer_name: "",
        customer_id: "",
        email: "",
        contact_no: "",
        gst_number: "",
        pan_number: "",
      });
    }
  }, [saleDetails]);

  return (
    <>
      <div className=" md:col-span-2 flex flex-col overflow-y-visible relative">
        <InputField
          value={customer.customer_name}
          setvalue={setcustomer}
          required={true}
          isLoading={isLoading}
          label={"Customer Name"}
          placeholder={"Customer name"}
          hasDropDown={true}
          dropDownData={AllCustomersList || []}
          dropDownType="usersData"
          addnew={"customer"}
          onClickAddNew={() => {
            navigate("/customer/addCustomer/new");
          }}
        />
      </div>
    </>
  );
};

const CustomerEmailInputField = ({ saleDetails }) => {
  const { createSaleForm } = useContext(SalesContext);
  const [email, setemail] = useState(createSaleForm?.email || "");

  useEffect(() => {
    createSaleForm && setemail(createSaleForm?.email);
  }, [createSaleForm]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setemail("");
    }
  }, [saleDetails]);

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          value={email}
          required={true}
          readOnly={true}
          setvalue={setemail}
          label={"Customer email address"}
          placeholder={"Enter email address"}
          inputType={"email"}
        />
      </div>
    </>
  );
};

const CustomerMobileInputField = ({ saleDetails }) => {
  const { createSaleForm } = useContext(SalesContext);
  const [customerMobile, setcustomerMobile] = useState("");
  useEffect(() => {
    createSaleForm && setcustomerMobile(createSaleForm?.contactNo);
  }, [createSaleForm]);
  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setcustomerMobile("");
    }
  }, [saleDetails]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          required={true}
          readOnly={true}
          value={customerMobile}
          setvalue={setcustomerMobile}
          label={"Customer phone number"}
          placeholder={"Enter mobile no."}
          inputType={"tel"}
          maxLength={10}
        />
      </div>
    </>
  );
};

const PaymentMethodInputField = ({ saleDetails }) => {
  const { createSaleFormDispatch } = useContext(SalesContext);
  const [paymentMethod, setpaymentMethod] = useState(
    saleDetails?.payment_name_list[0]?.payment_type || ""
  );
  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "paymentNameList",
      value: [
        {
          payment_name: "N/A",
          payment_descriptions: "N/A",
          payment_type: paymentMethod,
          upi_id: "N/A",
          upi_qr_code_url: "N/A",
          bank_account_number: "N/A",
          bank_account_IFSC: "N/A",
          bank_account_receivers_name: "N/A",
          bank_name: "N/A",
          remarks: "N/A",
        },
      ],
    });
  }, [paymentMethod]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setpaymentMethod("");
    }
  }, [saleDetails]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          required={true}
          value={paymentMethod}
          setvalue={setpaymentMethod}
          label={"Payment Method"}
          placeholder={"Select Payment method"}
          hasDropDown={true}
          dropDownData={PaymentMethodDropDown}
        />
      </div>
    </>
  );
};

const SelectStatusInputField = ({ saleDetails }) => {
  const { createSaleFormDispatch } = useContext(SalesContext);
  const [status, setstatus] = useState(saleDetails?.status || "");
  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "status",
      value: status,
    });
  }, [status]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setstatus("");
    }
  }, [saleDetails]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative col-span-2">
        <InputField
          value={status}
          required={true}
          setvalue={setstatus}
          label={"Status"}
          placeholder={"Select status"}
          hasDropDown={true}
          dropDownData={StatusFieldsDropDown}
        />
      </div>
    </>
  );
};

const SaleDateInputField = ({ saleDetails }) => {
  const { createSaleFormDispatch } = useContext(SalesContext);
  const [date, setdate] = useState(
    saleDetails?.sales_ts?.split("-").reverse().join("-") || ""
  );
  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "salesTs",
      value: (date || "").split("-").reverse().join("-"),
    });
  }, [date]);
  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setdate("");
    }
  }, [saleDetails]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          required={true}
          value={date}
          setvalue={setdate}
          label={"Sale Date"}
          placeholder={"dd-mm-yyyy"}
          inputType="date"
          icon={<CalendarDays className="w-4 h-4 text-gray-600" />}
        />
      </div>
    </>
  );
};

const QuotationIDInputField = ({ saleDetails }) => {
  const { createSaleFormDispatch } = useContext(SalesContext);
  const [quotationid, setquotationid] = useState(
    saleDetails?.quotation_id || ""
  );
  const { setselectedQuotationItems, quotationList, getQuotationList } =
    useContext(QuotationContext);
  const [isLoading, setisLoading] = useState(false);
  const [isCustomQuotation, setisCustomQuotation] = useState(false);
  const [isDropdownOpen, setisDropdownOpen] = useState(false);
  const [query, setquery] = useState("");

  const dropDownRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    quotationid &&
      createSaleFormDispatch({
        type: "UPDATE_FIELD",
        field: "quotationId",
        value: quotationid ? quotationid : "N/A",
      });
  }, [quotationid]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setquotationid("");
    }
  }, [saleDetails]);

  const filteredData = useMemo(() => {
    if (!query) return quotationList;
    return (quotationList || []).filter((item) => {
      return item.quotation_id.toLowerCase().includes(query);
    });
  }, [query, quotationList]);

  useEffect(() => {
    getQuotationList(setisLoading);
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

  // console.log(filteredData);

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative col-span-2">
        <label className="2xl:text-lg xl:text-base lg:text-sm text-xs font-normal mb-1">
          Quotation ID (Optional)
        </label>

        {isCustomQuotation && (
          <InputField
            value={quotationid}
            required={true}
            setvalue={setquotationid}
            label={""}
            hasLabel={false}
            placeholder={"Enter Quotation ID"}
          />
        )}

        {!isCustomQuotation && (
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
                placeholder={"Select Quotation ID"}
                value={quotationid}
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

            {/* dropdown quotation list  */}
            <div
              ref={dropDownRef}
              className={`absolute top-[105%] left-0 w-full ${
                isDropdownOpen
                  ? `  overflow-auto border-[1.5px]`
                  : "h-0 overflow-x-hidden border-0 "
              }
              bg-white z-5 rounded-xl border-[#0000001A]`}
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
                placeholder="Search Quotation ID"
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
                            setquotationid(item.quotation_id);
                            // setselectedQuotationItems(item.list_items);
                            createSaleFormDispatch({
                              type: "UPDATE_FIELD",
                              value: item.list_items,
                              field: "selectedQuotationItems",
                            });
                            setisDropdownOpen(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                        >
                          {item.quotation_id}{" "}
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

const GSTNumberInputField = ({ saleDetails }) => {
  const { createSaleForm } = useContext(SalesContext);
  const [gst, setgst] = useState("");
  useEffect(() => {
    createSaleForm && setgst(createSaleForm?.gstinNumber);
  }, [createSaleForm]);

  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setgst("");
    }
  }, [saleDetails]);

  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          readOnly={true}
          value={gst}
          required={true}
          setvalue={setgst}
          label={"GSTIN Number"}
          placeholder={"07ABCDE1234F2Z5"}
        />
      </div>
    </>
  );
};

const PANNumberInputField = ({ saleDetails }) => {
  const { createSaleForm } = useContext(SalesContext);
  const [pan, setpan] = useState("");
  useEffect(() => {
    createSaleForm && setpan(createSaleForm?.panNumber);
  }, [createSaleForm]);
  //clear state value
  useEffect(() => {
    if (!saleDetails) {
      setpan("");
    }
  }, [saleDetails]);
  return (
    <>
      <div className="flex flex-col overflow-y-visible relative">
        <InputField
          readOnly={true}
          value={pan}
          required={true}
          setvalue={setpan}
          label={"PAN Number"}
          placeholder={"AFZPK7190K"}
        />
      </div>
    </>
  );
};

const SubTotal = ({ className, saleDetails }) => {
  const { createSaleForm, createSaleFormDispatch } = useContext(SalesContext);
  const [subtotal, setsubtotal] = useState(createSaleForm?.subtotalAmount || 0);
  const [discount, setdiscount] = useState(
    Number(saleDetails?.discount_amount || 0)
  );
  const [isAdjustment, setisAdjustment] = useState(
    saleDetails?.adjustment_amount &&
      saleDetails?.adjustment_amount.toString().toLowerCase() === "true"
      ? true
      : false
  );
  const [tds, settds] = useState({
    value: saleDetails?.tds_amount || "0%",
    name: saleDetails?.tds_reason || "N/A",
  });
  const [isTdsEnable, setisTdsEnable] = useState(true);
  const [grandTotal, setgrandTotal] = useState(
    saleDetails?.total_amount || 0.0
  );
  const [discountAmount, setdiscountAmount] = useState(0);
  const [taxableAmount, settaxableAmount] = useState(0);

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
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "adjustmentAmount",
      value: isAdjustment,
    });
  }, [isAdjustment]);

  // calculate total when discount changes
  useEffect(() => {
    const tax = Number(tds.value.split("%")[0] || 0);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [discount, tds, subtotal]);

  useEffect(() => {
    //calculate subtotal
    const sum1 =
      createSaleForm?.listItems.reduce((acc, item) => {
        return acc + parseFloat(item.gross_amount || 0);
      }, 0) || 0;
    const sum2 =
      createSaleForm?.selectedQuotationItems.reduce((acc, item) => {
        return acc + parseFloat(item.gross_amount || 0);
      }, 0) || 0;
    setsubtotal(sum1 + sum2);
  }, [createSaleForm]);

  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "discountAmount",
      value: Number(discount).toFixed(2),
    });
    setdiscountAmount(((subtotal * discount) / 100).toFixed(2));
  }, [discount, subtotal]);

  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "subtotalAmount",
      value: subtotal,
    });
    const tax = Number(tds.value.split("%")[0] || 0);
    //update states
    setgrandTotal(
      ((subtotal * (100 - discount) * (100 + tax)) / 10000).toFixed(2)
    );
  }, [tds, subtotal, discount]);

  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "totalAmount",
      value: isAdjustment ? Math.ceil(Number(grandTotal)) : grandTotal,
    });
  }, [grandTotal, isAdjustment]);

  useEffect(() => {
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsAmount",
      value: tds.value,
    });
    createSaleFormDispatch({
      type: "UPDATE_FIELD",
      field: "tdsReason",
      value: tds.name,
    });
    const tax = Number(tds.value.split("%")[0] || 0);
    settaxableAmount(((subtotal * (100 - discount) * tax) / 10000).toFixed(2));
  }, [tds, subtotal, discount]);

  return (
    <>
      <div
        className={`bg-[#EBEFF3] p-3 xl:p-6 md:p-4 rounded-xl border-t-6 border-t-[#2543B1] ${className}`}
        style={{ boxShadow: "0px 4px 10px 0px #00000033" }}
      >
        {/* Subtotal */}
        <div className="text-[#4A4A4A] flex justify-between items-center mb-4 2xl:text-lg xl:text-base text-sm ">
          <span className="font-medium ">Sub Total</span>
          <span className="">{Number(subtotal).toFixed(2)}</span>
        </div>

        {/* Discount */}
        <div className="text-[#4A4A4A] flex justify-between gap-1 items-center mb-4 2xl:text-lg xl:text-base text-sm">
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
              className=" outline-none md:max-w-[100px] max-w-[50px] text-sm placeholder:text-[#8E8E8E] text-[#414141] "
            />
          </div>
          <span>&nbsp; %</span>
          <span className="text-gray-800 ml-auto">-{discountAmount}</span>
        </div>

        {/* Tax Type + Dropdown */}
        <div className="flex items-center justify-between text-[#4A4A4A] gap-3 mb-4">
          {/* Radio buttons */}
          <div className=" flex items-center gap-2 cursor-pointer">
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
        <div className="flex justify-between  items-center 2xl:text-2xl xl:text-xl lg:text-lg text-base font-medium text-[#333333]">
          <div className=" flex items-center gap-4">
            <span>Total</span>
            <div className=" flex items-center gap-2 cursor-pointer">
              <label
                htmlFor="toggle adjustment"
                className=" md:text-sm text-xs font-medium flex items-center gap-2 cursor-pointer select-none text-[#4A4A4A]"
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

const TaxDropdown = ({ isDisabled, value, setvalue }) => {
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
          className={`w-full px-2 py-2 cursor-pointer ${
            isDisabled ? "bg-gray-500/30" : "bg-white"
          }  border rounded-md lg:text-sm text-xs text-gray-700 flex items-center justify-between border-gray-400`}
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
