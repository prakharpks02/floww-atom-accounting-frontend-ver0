import data from "../../demo_data/allSales.json"
import {
    getAllCustomers
} from "./handelCustomerData";

let allSalesData = -1

export const getAllSales = async () => {
    const customersData = await getAllCustomers()
    return new Promise((res, rej) => {

        allSalesData = data.map(sale => {
            const customer = customersData.find(c => c.customer_id === sale.customer_id);
            return {
                status: ["Paid", "Unpaid", "Pending"][
                    Math.floor(Math.random() * 2)
                ],
                ...sale,
                ...(customer || {}) // attach full customer object
            };
        });
        res(allSalesData)
    })
}

export const getTotalSales = async () => {
    if (allSalesData === -1) getAllSales()

    console.log(allSalesData)

    return allSalesData.reduce((total, sale) => {
        const saleTotal = sale.list_items.reduce((sum, item) => {
            return sum + parseFloat(item.gross_amount || 0);
        }, 0);
        return total + saleTotal;
    }, 0);
}

export const getTotalExpense = async () => {

    return allSalesData.reduce((total, sale) => {
        // Assuming ~40% of gross amount is expense (e.g., cost of goods/services)
        const expense = sale.list_items.reduce((sum, item) => {
            return sum + (parseFloat(item.gross_amount || 0) * 0.4);
        }, 0);
        return total + expense;
    }, 0);
}

export const FilterSalesOnStatus = async (status, data) => {

    if (data === -1 || !data) {
        data = await getAllSales()
    }
    if (!status || status.toLowerCase() === "all") return data

    const filterData = data.filter((sale) => sale.status.toLowerCase() === status.toLowerCase())
    return filterData
}

export const FilterSalesOnAmount = async (amount, data) => {
    if (data === -1 || !data) {
        data = await getAllSales()
    }

    if (!amount) return data

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

    console.log(min, max)

    return data.filter(
        (sale) => sale.list_items[0].gross_amount >= min && sale.list_items[0].gross_amount <= max
    );
}

export const SortSalesOnAmount = async (type, data) => {
    if (data === -1 || !data) {
        data = await getAllSales()
    }

    if (!type) return data

    let sortedByAmount

    if (type === "High to low") sortedByAmount = [...data].sort((a, b) => b.list_items[0].gross_amount - a.list_items[0].gross_amount);
    else sortedByAmount = [...data].sort((a, b) => a.list_items[0].gross_amount - b.list_items[0].gross_amount);

    return sortedByAmount
}

export const SortSalesOnDate = async (type, data) => {
    if (data === -1 || !data) {
        data = await getAllSales()
    }
    if (!type) return data

    let sortedByDate

    if (type === "Recent First") sortedByDate = [...data].sort((a, b) => new Date(b.invoice_date) - new Date(a.invoice_date));
    else sortedByDate = sortedByDate = [...data].sort((a, b) => new Date(a.invoice_date) - new Date(b.invoice_date));

    return sortedByDate
}

export const SortSalesOnQuantity = async (type, data) => {
    if (data === -1 || !data) {
        data = await getAllSales()
    }
    if (!type) return data

    let sortedByDate

    if (type === "Descending") sortedByDate = [...data].sort((a, b) => b.list_items[0].quantity - a.list_items[0].quantity);
    else sortedByDate = sortedByDate = [...data].sort((a, b) => a.list_items[0].quantity - b.list_items[0].quantity);

    return sortedByDate
}

export const handelMultipleFilter = async ({
    statusFilter,
    amountFilter,
    amountSort,
    dateSort,
    quantitySort
}) => {
    if (allSalesData === -1) {
        allSalesData = await getAllSales()
    }

    let result = [];
    if (statusFilter) result = await FilterSalesOnStatus(statusFilter, allSalesData)
    if (amountFilter) result = await FilterSalesOnAmount(amountFilter, result)
    if (amountSort) result = await SortSalesOnAmount(amountSort, result)
    if (dateSort) result = await SortSalesOnDate(dateSort, result)
    if (quantitySort) result = await SortSalesOnQuantity(quantitySort, result)

    return result
}

export const searchSales = async (searchQuery) => {
    const query = searchQuery.toLowerCase();

    const filteredSales = allSalesData
        .map((sale) => {
            const saleIdMatch = sale.sales_id?.toLowerCase().includes(query);
            const customerMatch = sale.contact_person?.toLowerCase().includes(query);
            const emailMatch = sale.email?.toLowerCase().includes(query);
            const statusMatch = sale.status?.toLowerCase() === query;
            const dateMatch = new Date(sale.sales_ts).toLocaleDateString().toLowerCase().includes(query);

            // filter list_items first
            const filteredItems = sale.list_items.filter((item) => {
                const itemNameMatch = item.item_name?.toLowerCase().includes(query);
                const amountMatch = item.gross_amount?.toString() === query;
                const quantityMatch = item.quantity?.toString() === query;
                return itemNameMatch || amountMatch || quantityMatch;
            });

            // If sale level fields match OR list_items have match
            const saleLevelMatch = saleIdMatch || customerMatch || emailMatch || statusMatch || dateMatch;

            if (saleLevelMatch || filteredItems.length > 0) {
                return {
                    ...sale,
                    list_items: filteredItems.length > 0 ? filteredItems : sale.list_items
                };
            }

            return null;
        })
        .filter((sale) => sale !== null); // remove nulls

    return filteredSales;
};