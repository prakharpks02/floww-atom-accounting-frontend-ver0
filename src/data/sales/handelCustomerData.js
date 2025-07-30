import data from "../../demo_data/customer.json"

let customerData = -1

export const getAllCustomers = async () => {

    return new Promise((res, rej) => {
        customerData = data
        res(data)
    })
}