import jsPDF from "jspdf";

export const generatePDF = (saleData) => {
  const doc = new jsPDF();
  let y = 20;

  // Helper function to add section title
  const addSectionTitle = (title) => {
    doc.setFontSize(14);
    doc.text(title, 15, y);
    y += 8;
  };

  // Helper function to add text
  const addText = (label, value) => {
    doc.setFontSize(11);
    doc.text(`${label}: ${value || "N/A"}`, 20, y);
    y += 6;
  };

  // Sale Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Sale Details", 20, y + 10);
  y += 18;

  // Row 1: Sale ID and Total Payment
  doc.setFontSize(11);

  // Sale ID Label
  doc.setTextColor(100);
  doc.text("Sale ID", 20, y);
  doc.text("Total Payment", 120, y);
  y += 6;

  // Sale ID Value (Blue Link)
  doc.setTextColor(0, 102, 204); // Blue
  doc.text(saleData.sales_id || "N/A", 20, y);

  // Total Payment Value
  doc.setTextColor(0, 0, 0); // Black
  doc.setFont("helvetica", "bold");
  doc.text(`Rs. ${saleData.total_amount || "0.00"}`, 120, y);
  y += 10;

  // Row 2: Sales Deadline and Payment Status
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text("Sales Deadline", 20, y);
  doc.text("Payment Status", 120, y);
  y += 6;

  // Sales Deadline Value
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(saleData.sales_ts || "N/A", 20, y);

  // Payment Status Value (Green if Paid)
  doc.setTextColor(0, 170, 68); // Green
  doc.text(saleData.status || "N/A", 120, y);
  y += 16;

  // Company & Customer Info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Client Details", 20, y + 10);
  y += 18;

  // Label font style
  const labelFont = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100); // Grey for labels
  };

  // Value font style
  const valueFont = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0); // Black for values
  };

  // Company Name
  labelFont();
  doc.text("Company Name", 20, y);
  y += 6;
  valueFont();
  doc.text(saleData.customer_name || "N/A", 20, y);
  y += 10;

  // Email
  labelFont();
  doc.text("Email", 20, y);
  y += 6;
  valueFont();
  doc.text(saleData.email || "N/A", 20, y);
  y += 10;

  // Phone
  labelFont();
  doc.text("Phone", 20, y);
  y += 6;
  valueFont();
  doc.text(saleData.contact_no || "N/A", 20, y);
  y += 10;

  // Address
  labelFont();
  doc.text("Address", 20, y);
  y += 6;
  valueFont();

  // Wrap the address text if long
  const address = saleData.address || "N/A";
  const wrappedAddress = doc.splitTextToSize(address, 160);
  doc.text(wrappedAddress, 20, y);
  y += wrappedAddress.length * 6 + 4; // Adjust vertical spacing

  y += 6;

  // Items
  addSectionTitle("Items");
  saleData.list_items.forEach((item, index) => {
    doc.setFontSize(12);
    doc.text(`Item ${index + 1}`, 20, y);
    y += 6;
    addText("Name", item.item_name);
    addText("Description", item.item_description);
    addText("Quantity", item.quantity);
    addText("Unit Price", item.unit_price);
    addText("HSN Code", item.hsn_code);
    addText("GST", item.gst_amount);
    addText("Discount", item.discount);
    addText("Gross Amount", item.gross_amount);
    y += 4;
  });

  y += 6;

  // Payment Details
  addSectionTitle("Payment Details");
  const payment = saleData.payment_name_list[0];
  addText("Payment Type", payment.payment_type);
  addText("Bank Name", payment.bank_name);
  addText("Receiver", payment.bank_account_receivers_name);
  addText("Account No.", payment.bank_account_number);
  addText("IFSC", payment.bank_account_IFSC);

  y += 6;

  // Payment Transactions
  addSectionTitle("Payment Transactions");
  saleData.payment_transactions_list.forEach((txn, index) => {
    doc.setFontSize(12);
    doc.text(`Transaction ${index + 1}`, 20, y);
    y += 6;
    addText("Amount", txn.amount);
    addText("Remark", txn.remark);
    y += 4;
  });

  y += 6;

  // Totals
  addSectionTitle("Totals");
  addText("Subtotal", saleData.subtotal_amount);
  addText("TDS Amount", saleData.tds_amount);
  addText("TDS Reason", saleData.tds_reason);
  addText("Total Amount", saleData.total_amount);

  y += 6;

  // Notes
  addSectionTitle("Notes");
  addText("Additional Notes", saleData.notes);

  y += 6;

  // Related Documents (as links)
  addSectionTitle("Related Documents");
  saleData.invoice_url.forEach((urlObj, i) => {
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(`Document ${i + 1}`, 20, y, {
      url: urlObj.invoice_url,
    });
    y += 6;
  });

  // Save PDF
  doc.save(`${saleData.customer_name || "invoice"}.pdf`);
};
