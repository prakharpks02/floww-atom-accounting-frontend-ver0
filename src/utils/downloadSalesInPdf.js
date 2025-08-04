import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getFileNameFromURL } from "./getFileNameFromURL";

export const generatePDF = (saleData) => {
  const doc = new jsPDF();
  let y = 20;

  y = saleSection(doc, saleData, y);
  y = addLine(doc, y);
  y = clientSection(doc, saleData, y);
  y = addLine(doc, y);
  y = itemTable(doc, saleData, y);
  y = relatedDocuments(doc, saleData, y);
  y = addLine(doc, y);
  y = timeLine(doc, saleData, y);
  y = addLine(doc, y);

  // Notes
  y = checkPageBreak(doc, y);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Notes", 15, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${saleData.notes}`, 20, y, { charSpace: 0 });
  y += 6;

  // Save PDF
  doc.save(`${saleData.customer_name || "invoice"}.pdf`);
};

const saleSection = (doc, saleData, y) => {
  // Sale Details
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Sale Details", 15, y );
  y += 8;

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
  y += 5;
  return y;
};

const clientSection = (doc, saleData, y) => {
  // Company & Customer Info
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Client Details", 15, y);
  y += 8;

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

  // y += 6;

  return y;
};

const itemTable = (doc, saleData, y) => {
  // Net and Total Amount Section
  doc.setFontSize(14);
  // doc.setFont("helvetica", "bold");
  doc.text(`Net Amount: Rs. ${saleData.total_amount}`, 15, y);
  doc.text(
    `Total Amount: Rs. ${
      saleData.subtotal_amount || saleData.sub_total_amount
    }`,
    120,
    y
  );
  y += 6;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100); // grey
  doc.text("(After tax and discount deductions)", 15, y);
  doc.text("(Before Tax Deductions)", 120, y);
  y += 10;

  // TDS Line
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0); // black
  doc.text(`TDS: ${saleData.tds_amount}`, 15, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`(${saleData.tds_reason})`, 48, y);
  y += 10;

  // Items
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0); // black
  doc.text("Items", 15, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    head: [["Item Name", "Description", "Rate", "Quantity", "Gross Amount"]],
    body: saleData.list_items.map((item) => [
      item.item_name || "-",
      item.item_description || "-",
      `Rs. ${item.unit_price}`,
      item.quantity,
      `Rs. ${item.gross_amount}`,
    ]),
    styles: { fontSize: 11 },
    headStyles: {
      fillColor: [240, 240, 240],
      textColor: 20,
      fontStyle: "bold",
    },
    theme: "grid",
    margin: { top: y },
    didDrawPage: (data) => {
      y = data.cursor.y + 10;
    },
  });

  y = doc.lastAutoTable.finalY + 15;

  return y;
};

const relatedDocuments = (doc, saleData, y) => {
  if (
    !Array.isArray(saleData.invoice_url) ||
    saleData.invoice_url.length === 0
  ) {
    return y;
  }

  y = checkPageBreak(doc, y);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Related Documents", 15, y);
  y += 8;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 255); // blue for links

  saleData.invoice_url.forEach((urlObj, i) => {
    const fullUrl = urlObj.invoice_url;
    if (!fullUrl) return; // skip empty

    const fileName = decodeURIComponent(getFileNameFromURL(fullUrl));
    doc.text(`${i + 1})`, 22, y);
    doc.textWithLink(fileName, 30, y, { url: fullUrl });
    y += 6;
  });

  return y;
};

const timeLine = (doc, saleData, y) => {
  const list = saleData.payment_transactions_list;
  if (!Array.isArray(list) || list.length === 0) return y;
  y = checkPageBreak(doc, y);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Payment Timeline", 15, y);
  y += 8;

  [...list].reverse().forEach((txn, index) => {
    y = checkPageBreak(doc, y);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`${index + 1}) ${txn.remark}`, 20, y, { charSpace: 0 });
    y += 6;

    if (txn.transaction_url && txn.transaction_url !== "N/A") {
      const fileNameRaw = txn.transaction_url.substring(
        txn.transaction_url.lastIndexOf("/") + 1
      );
      const secondDashIndex = fileNameRaw.indexOf(
        "-",
        fileNameRaw.indexOf("-") + 1
      );
      const dotIndex = fileNameRaw.lastIndexOf(".");
      const fileName =
        secondDashIndex !== -1 && dotIndex !== -1 && secondDashIndex < dotIndex
          ? fileNameRaw.substring(secondDashIndex + 1, dotIndex)
          : fileNameRaw;

      doc.setTextColor(0, 0, 255); // link color
      doc.textWithLink(fileName, 25, y, {
        url: txn.transaction_url,
      });
      y += 6;
    }
  });
  y += 8;
  return y;
};

const checkPageBreak = (doc, y, buffer = 20) => {
  const pageHeight = doc.internal.pageSize.height;
  if (y + buffer >= pageHeight) {
    doc.addPage();
    return 20; // reset Y to top of new page
  }
  return y;
};

const addLine = (doc, y) => {
  doc.setDrawColor(150); // Set line color (gray)
  doc.setLineWidth(0.2); // Thin line
  doc.setLineDash([1, 1], 0); // Dotted line (on, off)
  doc.line(10, y, 200, y);
  y += 8;
  return y;
};
