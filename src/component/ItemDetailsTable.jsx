
export const ItemDetailsTable = ({dataList}) => {
  return (
    <div className="w-full lg:p-6 p-4 rounded-xl border-[1.5px] border-[#E8E8E8]">
      <h2 className="2xl:text-3xl xl:text-2xl lg:text-xl md:text-base text-sm font-semibold text-[#4A4A4A] mb-4">
        Items
      </h2>

      <div className="mb-4">
        <div className=" flex flex-wrap justify-between items-center gap-4 mb-4">
          <div>
            <p className=" leading-5 font-semibold 2xl:text-2xl xl:text-xl lg:text-lg text-base text-[#4A4A4A] ">
              Net Amount: ₹{dataList?.total_amount || dataList?.gross_amount}
            </p>
            <span className=" font-medium xl:text-sm text-xs text-[#777777] -translate-y-5">
              (After tax and discount deductions)
            </span>
          </div>
          <div>
            <p className=" leading-5 font-semibold 2xl:text-2xl xl:text-xl lg:text-lg text-base text-[#4A4A4A] ">
              Total Amount: ₹{dataList?.subtotal_amount || dataList?.sub_total_amount}
            </p>
            <span className=" font-medium xl:text-sm text-xs text-[#777777] -translate-y-5">
              (Before Tax Deductions)
            </span>
          </div>
        </div>

        <div className=" gap-x-3 text-[#606060] flex items-center gap-3 font-medium 2xl:text-lg xl:text-base text-sm ">
          {/* <div>
            <span>Discount:</span>&nbsp;
            <span>24%</span>
          </div> */}
          <div>
            <span>TDS:</span>&nbsp;
            <span>{dataList?.tds_amount}</span>&nbsp;
            <span className=" text-[10px]">({dataList?.tds_reason})</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 ">
        {dataList?.list_items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-evenly gap-5 bg-[#0000000D] p-4 rounded-lg text-sm xl:text-base overflow-x-auto"
          >
            <div className=" min-w-[100px] max-w-[150px]">
              <p className="font-medium text-[#777777]">Item Name</p>
              <p className="font-semibold text-[#4A4A4A]">{item.item_name}</p>
            </div>
            <div>
              <p className="font-medium text-[#777777]">Quantity</p>
              <p className="font-semibold text-[#4A4A4A]">{item.quantity}</p>
            </div>
            <div>
              <p className="font-medium text-[#777777]">Rate</p>
              <p className="font-semibold text-[#4A4A4A]">₹{item.base_amount}</p>
            </div>
            <div>
              <p className="font-medium text-[#777777]">DIS%</p>
              <p className="font-semibold text-[#4A4A4A]">{item.discount}%</p>
            </div>
            <div>
              <p className="font-medium text-[#777777]">GST%</p>
              <p className="font-semibold text-[#4A4A4A]">{item.gst_amount}%</p>
            </div>
            <div>
              <p className="font-medium text-[#777777]">Amount</p>
              <p className="font-semibold text-[#4A4A4A]">
                ₹{item.gross_amount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
