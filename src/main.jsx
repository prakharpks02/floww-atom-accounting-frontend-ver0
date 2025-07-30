import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";
import { CompanyContextProvider } from "./context/company/CompanyContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { CustomerContextProvider } from "./context/customer/customerContext.jsx";
import { VendorContextProvider } from "./context/vendor/VendorContext.jsx";
import { SalesContextProvider } from "./context/sales/salesContext.jsx";
import { QuotationContextProvider } from "./context/quotation/QuotationContext.jsx";
import { PurchaseOrderContextProvider } from "./context/purchaseOrder/PurchaseOrderContext.jsx";
import { PurchaseListContextProvider } from "./context/purchaseList/PurchaseListContext.jsx";
import { AddMemberContextProvider } from "./context/addMember/AddmemberContext.jsx";
import { DocumentContextProvider } from "./context/document/DocumentContext.jsx";
import { DashBoardContextProvider } from "./context/dashBoard/DashBoardContext.jsx";
import { LedgerContextProvider } from "./context/ledger/LedgerContext.jsx";
import { ExpenseContextprovider } from "./context/expense/ExpenseContext.jsx";
import { UserContextProvider } from "./context/userContext/UserContext.jsx";
import { InvoiceContextProvider } from "./context/invoiceContext/InvoiceContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
    <CompanyContextProvider>
      <CustomerContextProvider>
        <VendorContextProvider>
          <SalesContextProvider>
            <InvoiceContextProvider>
              <QuotationContextProvider>
                <PurchaseOrderContextProvider>
                  <PurchaseListContextProvider>
                    <AddMemberContextProvider>
                      <DocumentContextProvider>
                        <DashBoardContextProvider>
                          <LedgerContextProvider>
                            <ExpenseContextprovider>
                              <App />
                            </ExpenseContextprovider>
                          </LedgerContextProvider>
                        </DashBoardContextProvider>
                      </DocumentContextProvider>
                    </AddMemberContextProvider>
                  </PurchaseListContextProvider>
                </PurchaseOrderContextProvider>
              </QuotationContextProvider>
            </InvoiceContextProvider>
          </SalesContextProvider>
        </VendorContextProvider>
      </CustomerContextProvider>
    </CompanyContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
