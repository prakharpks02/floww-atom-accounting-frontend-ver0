export const formatISODateToDDMMYYYY  = (timestampInSeconds) => {
    const date = new Date(timestampInSeconds * 1000); // Convert to milliseconds

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

// export const formatISODateToDDMMYYYY = (inputDate) => {
//   // If input is already in "DD-MM-YYYY", return as-is
//   if (typeof inputDate === "string" && /^\d{2}-\d{2}-\d{4}$/.test(inputDate)) {
//     return inputDate;
//   }

//   let date;

//   if (typeof inputDate === "number") {
//     // Timestamp: detect seconds vs milliseconds
//     date = new Date(inputDate < 1e12 ? inputDate * 1000 : inputDate);
//   } else if (typeof inputDate === "string" || inputDate instanceof String) {
//     date = new Date(inputDate);
//   } else if (inputDate instanceof Date) {
//     date = inputDate;
//   } else {
//     throw new Error("Invalid date input");
//   }

//   if (isNaN(date)) throw new Error("Invalid date value");

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${day}-${month}-${year}`;
// };
