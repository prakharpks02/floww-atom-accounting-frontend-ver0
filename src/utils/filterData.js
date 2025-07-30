import { formatISODateToDDMMYYYY } from "./formateDate";
import { monthMap, parseDate } from "./parseDate";

export const FilterDataOnStatus = async (status, data) => {
  if (!data) return;

  if (!status || status.toLowerCase() === "all") return data;

  const filterData = data.filter(
    (item) =>
      (item.status || item.expense_status).toLowerCase() ===
      status.toLowerCase()
  );
  return filterData;
};

export const FilterDataOnType = async (type, data) => {
  if (!data) return;

  if (!type || type.toLowerCase() === "all") return data;

  const filterData = data.filter(
    (item) => (item.type || "").toLowerCase() === type.toLowerCase()
  );
  return filterData;
};

export const FilterDataOnName = async (name, data) => {
  if (!data) return;

  if (!name || name.toLowerCase() === "all") return data;

  const filterData = data.filter(
    (item) => (item.name || "").toLowerCase() === name.toLowerCase()
  );
  return filterData;
};

export const FilterDataOnCategory = async (category, data) => {
  if (!data) return;

  if (!category || category.toLowerCase() === "all") return data;

  const filterData = data.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );
  return filterData;
};

export const FilterDataOnCreatedBy = async (creater, data) => {
  if (!data) return;

  if (!creater || creater.toLowerCase() === "all") return data;

  const filterData = data.filter(
    (item) =>
      item.created_by_member_name.toLowerCase() === creater.toLowerCase()
  );
  return filterData;
};

export const FilterDataOnExpenseAmount = async (amount, data) => {
  if (!data) return;

  if (!amount || amount.toLowerCase() === "all") return data;

  let min = 0,
    max = Infinity;

  if (amount.includes("-")) {
    const [minStr, maxStr] = amount
      .replace(/₹|,/g, "") // remove ₹ and commas
      .split(" - ")
      .map(Number);
    min = minStr;
    max = maxStr;
  } else if (amount.includes("+")) {
    min = Number(amount.replace(/₹|,/g, "").replace("+", ""));
    max = Infinity;
  }

  console.log(min, max);

  return data.filter(
    (item) =>
      Number(item.debit_amount || item.credit_amount || item.amount) >= min &&
      Number(item.debit_amount || item.credit_amount || item.amount) <= max
  );
};

export const FilterDataOnAmount = async (amount, data) => {
  if (!data) return;

  if (!amount || amount.toLowerCase() === "all") return data;

  let min = 0,
    max = Infinity;

  if (amount.includes("-")) {
    const [minStr, maxStr] = amount
      .replace(/₹|,/g, "") // remove ₹ and commas
      .split(" - ")
      .map(Number);
    min = minStr;
    max = maxStr;
  } else if (amount.includes("+")) {
    min = Number(amount.replace(/₹|,/g, "").replace("+", ""));
    max = Infinity;
  }

  console.log(min, max);

  return data
    .map((elem) => {
      const filteredItems = elem.list_items?.filter(
        (item) => item.gross_amount >= min && item.gross_amount <= max
      );

      // Only return the item if it has at least one matching item
      if (filteredItems && filteredItems.length > 0) {
        return {
          ...elem,
          list_items: filteredItems, // updated list
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls
};

export const FilterDataOnItemName = async (itemName, data) => {
  if (!data) return;

  if (!itemName || itemName.toLowerCase() === "all") return data;

  return data
    .map((elem) => {
      const filteredItems = elem.list_items?.filter(
        (item) => item.item_name?.toLowerCase() === itemName.toLowerCase()
      );

      if (filteredItems && filteredItems.length > 0) {
        return {
          ...elem,
          list_items: filteredItems,
        };
      }

      return null;
    })
    .filter(Boolean); // remove nulls
};

export const FilterDataOnDate = async (date, data) => {
  if (!data) return;

  if (!date || date.toLowerCase() === "all") return data;
  console.log(date);

  return data.filter((item) => {
    console.log(item.purchase_date);
    return (
      (item.sales_ts ||
        item.purchase_date ||
        item.po_date ||
        item.quotation_date ||
        item.date) === date
    );
  });
};

export const FilterDataOnFinancialYear = async (fyString = "", data) => {
  if (!data) return;

  if (!fyString || fyString.toLowerCase() === "all") return data;

  const [start, end] = fyString.split(" ")[1].split("-"); // Note: EN DASH

  const startYear = `20${start}`;
  const endYear = `20${end}`;

  const startDate = new Date(`${startYear}-04-01`);
  const endDate = new Date(`${endYear}-03-31`);

  return data.filter((item) => {
    const date = parseDate(
      item.sales_ts || item.purchase_date || item.po_date || item.quotation_date
    );
    return date >= startDate && date <= endDate;
  });
};

export const FilterOnMonthRange = (startMonth, endMonth, data) => {
  if (!data) return;

  if (
    !startMonth ||
    !endMonth ||
    startMonth.toLowerCase() === "default" ||
    endMonth.toLowerCase() === "default"
  )
    return data;

  const currentYear = new Date().getFullYear();

  const startMonthIndex = monthMap[startMonth.toLowerCase()];
  const endMonthIndex = monthMap[endMonth.toLowerCase()];

  if (startMonthIndex === undefined || endMonthIndex === undefined) return data;

  const startDate = new Date(currentYear, startMonthIndex, 1);
  const endDate = new Date(currentYear, endMonthIndex + 1, 0); // last day of end month

  if (startDate > endDate) return data;

  console.log(startDate, endDate);

  return data.filter((item) => {
    const date = parseDate(
      item.sales_ts || item.purchase_date || item.po_date || item.quotation_date
    );
    return date >= startDate && date <= endDate;
  });
};

export const SortDataOnExpenseAmount = async (type, data) => {
  if (!data) return;
  if (!type || type.toLowerCase() === "default") return data;

  //  Sort based on expense amount
  const sorted = data.sort((a, b) => {
    const aAmount = Number(a.debit_amount || a.credit_amount || a.amount);
    const bAmount = Number(b.debit_amount || b.credit_amount || b.amount);
    console.log(aAmount, bAmount);
    return type === "High to low" ? bAmount - aAmount : aAmount - bAmount;
  });

  return sorted;
};

export const SortDataOnAmount = async (type, data) => {
  if (!data) return;

  if (!type || type.toLowerCase() === "default") return data;

  // Step 1: Flatten all list_items into individual objects with sale info
  const flattened = data.flatMap((elem) =>
    (elem.list_items || []).map((item) => ({
      ...elem,
      list_items: [item],
    }))
  );

  // Step 2: Sort based on gross_amount
  const sorted = flattened.sort((a, b) => {
    const aAmount = a.list_items[0].gross_amount;
    const bAmount = b.list_items[0].gross_amount;
    return type === "High to low" ? bAmount - aAmount : aAmount - bAmount;
  });

  return sorted;
};

export const SortDataOnDate = (type, data) => {
  if (!data) return [];
  if (!type || type.toLowerCase() === "default") return data;

  const flattened = data.flatMap((elem) =>
    (elem.list_items || []).map((item) => ({
      ...elem,
      list_items: [item],
    }))
  );

  const sortKey = type.split(" ").join("").toLowerCase();
  const sorted = flattened.sort((a, b) => {
    const dateA = parseDate(
      a.sales_ts || a.purchase_date || a.po_date || a.quotation_date || a.date
    );
    const dateB = parseDate(
      b.sales_ts || b.purchase_date || b.po_date || b.quotation_date || b.date
    );
    console.log(dateA, dateB);
    return sortKey.toLowerCase().includes("recent")
      ? dateB - dateA
      : dateA - dateB;
  });

  console.log(sortKey.toLowerCase().includes("recent"));

  return sorted;
};

export const SortDataOnExpenseDate = (type, data) => {
  if (!data) return [];
  if (!type || type.toLowerCase() === "default") return data;

  const sortKey = type.split(" ").join("").toLowerCase();
  const sorted = data.sort((a, b) => {
    const dateA = parseDate(a.date || formatISODateToDDMMYYYY(a.ts));
    const dateB = parseDate(b.date || formatISODateToDDMMYYYY(b.ts));
    console.log(dateA, dateB);
    return sortKey.toLowerCase().includes("recent")
      ? dateB - dateA
      : dateA - dateB;
  });

  console.log(sortKey.toLowerCase().includes("recent"));

  return sorted;
};

export const SortDataOnQuantity = async (type, data) => {
  if (!data) return;
  if (!type || type.toLowerCase() === "default") return data;

  const flattened = data.flatMap((elem) =>
    (elem.list_items || []).map((item) => ({
      ...elem,
      list_items: [item],
    }))
  );
  const sorted = [...flattened].sort((a, b) => {
    const q1 = a.list_items?.[0]?.quantity || 0;
    const q2 = b.list_items?.[0]?.quantity || 0;
    // console.log(q1, q2);
    return type?.toLowerCase().includes("descending") ? q2 - q1 : q1 - q2;
  });

  return sorted;
};
