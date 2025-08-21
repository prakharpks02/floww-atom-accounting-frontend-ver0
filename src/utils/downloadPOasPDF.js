import { showToast } from "./showToast";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const downloadPOasPDF = async (
  data,
  companyDetails,
  setisLoading = () => {}
) => {
  if (!data || !companyDetails || !setisLoading) return;

  try {
    setisLoading(true);
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const drawText = (text, x, y, size = 10, isBold = false) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    let y = 800;
    drawText("Purchase Order", 230, y, 18, true);

    // Labels
    y -= 30;
    drawText("From:", 40, y, 11, true);
    drawText("Bill To:", 320, y, 11, true);

    // Addresses
    y -= 15;
    const fromText = `${companyDetails?.company_name ?? ""}, ${
      companyDetails?.company_address ?? ""
    }`;
    const billToText = `${
      data?.deliveryAddress || data?.delivery_address || ""
    }`;

    const leftLineCount = wrapAndDrawText(page, fromText, 40, y, 250, 10, font);
    const rightLineCount = wrapAndDrawText(
      page,
      billToText,
      320,
      y,
      230,
      10,
      font
    );

    y -= Math.max(leftLineCount, rightLineCount) * 12;

    // Dates and GST
    y -= 10;
    drawText(`From: ${data?.poDate || data?.po_date}`, 40, y, 11, true);
    drawText(
      `Delivery Date: ${data?.deliveryDate || data?.delivery_date}`,
      320,
      y,
      11,
      true
    );

    y -= 20;
    drawText(
      `Phone: +91${data?.contactNo || data?.contact_no}`,
      40,
      y,
      11,
      true
    );
    drawText(`GST: ${data?.gstNumber || data?.gst_number}`, 320, y, 11, true);

    // Table headers
    y -= 35;
    const headers = ["Description", "Rate", "Qty", "Disc%", "GST%", "Amount"];
    const colX = [40, 220, 270, 310, 360, 420];
    headers.forEach((text, i) => drawText(text, colX[i], y, 10, true));

    y -= 10;
    page.drawLine({
      start: { x: 40, y },
      end: { x: 550, y },
      thickness: 0.8,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Table items
    const items = data?.listItems || data?.list_items || [];
    y -= 20;
    items.forEach((item) => {
      drawText(item.item_description, colX[0], y);
      drawText(item.base_amount, colX[1], y);
      drawText(String(item.quantity), colX[2], y);
      drawText(`${item.discount}%`, colX[3], y);
      drawText(`${item.gst_amount}%`, colX[4], y);
      drawText(
        `${Number(item.gross_amount).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        colX[5],
        y
      );
      y -= 20;
    });

    // Line after items
    page.drawLine({
      start: { x: 40, y: y + 10 },
      end: { x: 550, y: y + 10 },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Totals
    y -= 10;
    drawText("Subtotal:", 40, y, 11, true);
    drawText(`Rs.${data?.subTotalAmount || data?.sub_total_amount}`, 420, y);

    y -= 20;
    drawText(`Tax(${data?.tdsAmount || data?.tds_amount}):`, 40, y, 11, true);
    drawText(
      `+Rs.${Number(
        ((Number(data?.subTotalAmount || data?.sub_total_amount) || 0) *
          (100 - Number(data?.discountAmount || data?.discount_amount)) *
          (Number((data?.tdsAmount || data?.tds_amount)?.split("%")[0]) || 0)) /
          10000
      ).toFixed(2)}`,
      420,
      y
    );

    y -= 20;
    drawText(`Discount(${data?.discountAmount}%):`, 40, y, 11, true);
    drawText(
      `-Rs.${Number(
        ((data?.subTotalAmount || data?.sub_total_amount || 0) *
          (data?.discountAmount || data?.discount_amount || 0)) /
          100
      ).toFixed(2)}`,
      420,
      y
    );

    y -= 25;
    drawText("Total:", 40, y, 12, true);
    drawText(`Rs.${data?.totalAmount || data?.total_amount}`, 420, y, 12, true);

    page.drawLine({
      start: { x: 40, y: y - 10 },
      end: { x: 550, y: y - 10 },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });

    // Notes and T&C
    y -= 40;
    drawText(`Customer note: ${data?.notes || data?.notes || ""}`, 40, y);
    y -= 20;
    drawText(
      `Terms & Conditions: ${
        (data?.listToc || data?.list_toc)?.[0]?.terms_of_service ?? ""
      }`,
      40,
      y
    );

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "Purchase order.pdf");
  } catch (error) {
    console.log(error);
    showToast(error.message || "Download pdf failed", 1);
  } finally {
    setisLoading(false);
  }
};

const wrapAndDrawText = (
  page,
  text,
  x,
  yStart,
  maxWidth,
  fontSize,
  fontObj
) => {
  const lines = [];
  const words = text?.split(" ") || [];
  let line = "";
  for (const word of words) {
    const testLine = line + word + " ";
    const testWidth = fontObj.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth) {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line.trim());

  lines.forEach((lineText, idx) => {
    page.drawText(lineText, {
      x,
      y: yStart - idx * (fontSize + 2),
      size: fontSize,
      font: fontObj,
      color: rgb(0, 0, 0),
    });
  });
  return lines.length;
};
