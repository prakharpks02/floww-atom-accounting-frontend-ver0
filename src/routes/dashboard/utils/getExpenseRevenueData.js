import data from "../../../demo_data/ExpenseRevenueData.json"

export const getExpenseRevenueData = async () => {
    // console.log(data)
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(data)
        }, 2000);
    })
}

