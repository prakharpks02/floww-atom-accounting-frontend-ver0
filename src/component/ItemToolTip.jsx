export const ItemToolTip = ({ items, className }) => {
  if (!items || items.length == 0) return;
  return (
    <div className={`z-10 bg-white shadow-xl rounded-md absolute ${className}`}>
      <table className="min-w-full text-left border border-[#b6b6b6] rounded-md overflow-hidden">
        <thead className="text-xs text-[#333333] bg-[#F5F5F5] border-b border-[#D6D6D6]">
          <tr>
            <th
              scope="col"
              className="px-2 py-2 whitespace-nowrap font-medium"
            >
              Item
            </th>
            <th
              scope="col"
              className="px-2 py-2 whitespace-nowrap font-medium text-center"
            >
              Quantity
            </th>
            <th
              scope="col"
              className="px-2 py-2 whitespace-nowrap font-medium text-right"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => {
            return (
              <tr
                key={idx}
                className="hover:bg-[#f0f0f0] cursor-pointer border-b border-[#E5E5E5]"
              >
                <td className="whitespace-nowrap px-2 py-1 text-[#444444] font-medium text-xs">
                  {item.item_name}
                </td>
                <td className="whitespace-nowrap px-2 py-1 text-[#333333] font-semibold text-center text-xs">
                  {item.quantity}
                </td>
                <td className="whitespace-nowrap px-2 py-1 text-[#222222] font-semibold text-right text-xs">
                  ₹
                  {Number(item.gross_amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};