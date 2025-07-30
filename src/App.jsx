import { useEffect, useRef, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";

// components
import TopBar from "./component/topBar/TopBar";
import ImgUpload from "./component/uploads/ImgUpload";

// sales
import { AllSalesList } from "./routes/sales/AllSalesList.jsx";
import { AddSales } from "./routes/sales/AddSales";
import { CreateInvoice } from "./routes/sales/CreateInvoice";
import { SaleInfo } from "./routes/sales/SaleDetails";
import { EditSalesEntry } from "./routes/sales/EditSalesEntry";
import { SalesContextProvider } from "./context/sales/salesContext";

// purchase
import { PurchaseList } from "./routes/purchase/PurchaseList";
import { AddPurchase } from "./routes/purchase/AddPurchase";
import { CreatePurchaseOrder } from "./routes/purchase/CreatePurchaseOrder";
import { PurchaseDetails } from "./routes/purchase/PurchaseDetails";
import { PurchaseOrderList } from "./routes/purchase/PurchaseOrderList";
import { EditPurchase } from "./routes/purchase/EditPurchase";
import { EditPurchaseOrder } from "./routes/purchase/EditPurchaseOrder";
import { PurchaseOrderDetails } from "./routes/purchase/PurchaseOrderDetails";

// quotation
import { QuotationList } from "./routes/Quotations/QuotationList";
import { QuotationDetails } from "./routes/Quotations/QuotationDetails";
import { CreateQuotation } from "./routes/Quotations/CreateQuotation";

// customers
import { CustomerDetails } from "./routes/customer/CustomerDetails";
import { AllCustomersList } from "./routes/customer/CustomerList";
import { AddCustomer } from "./routes/customer/AddCustomer";
import { CustomerContextProvider } from "./context/customer/customerContext";

// vendors
import { VendorList } from "./routes/vendors/VendorList";
import { VendorDetails } from "./routes/vendors/VendorDetails";
import { AddVendor } from "./routes/vendors/AddVendor";
import { VendorContextProvider } from "./context/vendor/VendorContext";

// documents
import { DocumentRepo } from "./routes/document/DocumentRepo";

// members
import { AllMembersList } from "./routes/members/MemberList";

// ledger
import { Ledger } from "./routes/ledger/Ledger";

//dashboard
import { Dashboard } from "./routes/dashboard/DashBoard";
import SideNavbar from "./component/sidenavbar/SideNavBar.jsx";
import { ExpenseContextprovider } from "./context/expense/ExpenseContext.jsx";
import { AllExpenseList } from "./routes/expense/AllExpenseList.jsx";
import { AddExpense } from "./routes/expense/AddExpense.jsx";
import { ExpenseDetails } from "./routes/expense/ExpenseDetails.jsx";

// onboarding
import { OnBoardingPage } from "./routes/onBoarding/OnBoarding.jsx";

// context
import { CompanyContextProvider } from "./context/company/CompanyContext.jsx";
import { UserLoginPage } from "./routes/userAuth/UserLoginPage.jsx";
import { UserSignupPage } from "./routes/userAuth/UserSignupPage.jsx";

function App() {
  const containerRef = useRef(null);

  return (
    <>
      <div className=" flex h-[100dvh] ">
        <SideNavbar />
        <ScrollToTop containerRef={containerRef} />
        <div
          ref={containerRef}
          className="h-full w-full overflow-auto relative"
        >
          <nav>
            <TopBar />
          </nav>
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/anirban" element={<ImgUpload />} />

              <Route path="/sales/salesList" element={<AllSalesList />} />
              <Route path="/sales/saleDetails/:saleid" element={<SaleInfo />} />
              <Route path="/sales/addSales/:salesid" element={<AddSales />} />
              <Route
                path="/sales/editSalesEntry"
                element={<EditSalesEntry />}
              />
              <Route path="/sales/createInvoice" element={<CreateInvoice />} />

              <Route path="/purchase/purchaseList" element={<PurchaseList />} />
              <Route
                path="/purchase/addPurchase/:purchaseid"
                element={<AddPurchase />}
              />
              <Route
                path="/purchase/createOrder/:purchaseorderid"
                element={<CreatePurchaseOrder />}
              />
              <Route
                path="/purchase/OrderList"
                element={<PurchaseOrderList />}
              />
              <Route
                path="/purchase/purchaseDetails/:purchaseid"
                element={<PurchaseDetails />}
              />
              <Route
                path="/purchase/purchaseOrderDetails/:purchaseid"
                element={<PurchaseOrderDetails />}
              />
              <Route
                path="/quotation/quotationList"
                element={<QuotationList />}
              />
              <Route
                path="/quotation/createQuotation/:quotationid"
                element={<CreateQuotation />}
              />
              <Route
                path="/quotation/quotationDetails/:quotationid"
                element={<QuotationDetails />}
              />
              <Route
                path="/customer/customerList"
                element={<AllCustomersList />}
              />
              <Route
                path="/customer/addCustomer/:customerid"
                element={<AddCustomer />}
              />
              <Route
                path="/customer/customerDetails/:customerid"
                element={<CustomerDetails />}
              />
              <Route path="/vendor/vendorsList" element={<VendorList />} />
              <Route
                path="/vendor/addVendors/:vendorid"
                element={<AddVendor />}
              />
              <Route
                path="/vendor/vendorDetails/:vendorid"
                element={<VendorDetails />}
              />
              <Route path="/documents" element={<DocumentRepo />} />

              <Route path="/expense/expenseList" element={<AllExpenseList />} />
              <Route
                path="/expense/addExpense/:expenseid"
                element={<AddExpense />}
              />
              <Route
                path="/expense/expenseDetails/:expenseid"
                element={<ExpenseDetails />}
              />

              <Route path="/ledger" element={<Ledger />} />
              <Route path="/addMembers" element={<AllMembersList />} />
              <Route path="/onBoarding" element={<OnBoardingPage />} />
              <Route path="/login" element={<UserLoginPage />} />
              <Route path="/signup" element={<UserSignupPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}

export default App;
