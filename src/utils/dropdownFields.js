export const customersDropDown = [
  {
    name: "Person 1",
    email: "person1@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Person 2",
    email: "person2@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Person 3",
    email: "person3@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Person 4",
    email: "person4@estatepilot.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
  },
];

export const StatusFieldsDropDown = [
  {
    name: "Paid",
    value: "Paid",
  },
  {
    name: "Pending",
    value: "Pending",
  },
  {
    name: "Partially paid",
    value: "Partially paid",
  },
];

export const amountDropdown = [
  {
    name: "₹0 - ₹5,000",
    value: "₹0 - ₹5,000",
  },
  {
    name: "₹5,000 - ₹10,000",
    value: "₹5,000 - ₹10,000",
  },
  {
    name: "₹10,000+",
    value: "₹10,000+",
  },
];

export const PaymentMethodDropDown = [
  {
    name: "Cash",
    value: "Cash",
  },
  {
    name: "Bank transfer",
    value: "Bank transfer",
  },
  {
    name: "UPI",
    value: "UPI",
  },
  {
    name: "Cheque",
    value: "Cheque",
  },
];

export const PaymentTermsDropDown = [
  {
    name: "Due on receipt",
    value: "Due on receipt",
  },
];

export const indianStates = [
  { name: "Andhra Pradesh", value: "Andhra Pradesh" },
  { name: "Arunachal Pradesh", value: "Arunachal Pradesh" },
  { name: "Assam", value: "Assam" },
  { name: "Bihar", value: "Bihar" },
  { name: "Chhattisgarh", value: "Chhattisgarh" },
  { name: "Goa", value: "Goa" },
  { name: "Gujarat", value: "Gujarat" },
  { name: "Haryana", value: "Haryana" },
  { name: "Himachal Pradesh", value: "Himachal Pradesh" },
  { name: "Jharkhand", value: "Jharkhand" },
  { name: "Karnataka", value: "Karnataka" },
  { name: "Kerala", value: "Kerala" },
  { name: "Madhya Pradesh", value: "Madhya Pradesh" },
  { name: "Maharashtra", value: "Maharashtra" },
  { name: "Manipur", value: "Manipur" },
  { name: "Meghalaya", value: "Meghalaya" },
  { name: "Mizoram", value: "Mizoram" },
  { name: "Nagaland", value: "Nagaland" },
  { name: "Odisha", value: "Odisha" },
  { name: "Punjab", value: "Punjab" },
  { name: "Rajasthan", value: "Rajasthan" },
  { name: "Sikkim", value: "Sikkim" },
  { name: "Tamil Nadu", value: "Tamil Nadu" },
  { name: "Telangana", value: "Telangana" },
  { name: "Tripura", value: "Tripura" },
  { name: "Uttar Pradesh", value: "Uttar Pradesh" },
  { name: "Uttarakhand", value: "Uttarakhand" },
  { name: "West Bengal", value: "West Bengal" },
];

export const salutations = [
  { name: "Mr.", value: "Mr." },
  { name: "Mrs.", value: "Mrs." },
  { name: "Ms.", value: "Ms." },
  { name: "Miss", value: "Miss" },
  { name: "Dr.", value: "Dr." },
];

export const TDSDropDown = [
  { name: "Commission or Brokerage", value: "2%" },
  { name: "Commission or Brokerage (Reduced)", value: "3.75%" },
  { name: "Dividend", value: "10%" },
  { name: "Dividend (Reduced)", value: "7.5%" },
  { name: "Other Interest than securities", value: "10%" },
  { name: "Other Interest than securities (Reduced)", value: "7.5%" },
  { name: "Payment of contractors for Others", value: "2%" },
  { name: "Payment of contractors for Others (Reduced)", value: "1.5%" },
  { name: "Payment of contractors HUF/Indiv", value: "1%" },
  { name: "Payment of contractors HUF/Indiv (Reduced)", value: "0.75%" },
  { name: "Professional Fees", value: "10%" },
  { name: "Professional Fees (Reduced)", value: "7.5%" },
  { name: "Rent on land or furniture etc", value: "10%" },
  { name: "Rent on land or furniture etc (Reduced)", value: "7.5%" },
  { name: "Technical Fees (2%)", value: "2%" },
];

export const getLast10FinancialYears = () => {
  const currentDate = new Date();
  const currentYear =
    currentDate.getMonth() >= 3
      ? currentDate.getFullYear()
      : currentDate.getFullYear() - 1;

  const years = [];

  for (let i = 9; i >= 0; i--) {
    const startYear = currentYear - i;
    const endYear = (startYear + 1) % 100; // Two-digit format
    const fyString = `FY ${String(startYear % 100).padStart(2, "0")}-${String(
      endYear
    ).padStart(2, "0")}`;

    years.push({ name: fyString, value: fyString });
  }

  return years;
};

export const currentFinancialYear = `FY ${String(
  (new Date().getMonth() >= 3
    ? new Date().getFullYear()
    : new Date().getFullYear() - 1) % 100
).padStart(2, "0")}-${String(
  (new Date().getMonth() >= 3
    ? new Date().getFullYear() + 1
    : new Date().getFullYear()) % 100
).padStart(2, "0")}`;

export const getAllMonths = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(0, i).toLocaleString("default", { month: "long" });
  return { name: month, value: month };
});
