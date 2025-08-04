import JSZip from "jszip";
import axios from "axios";
import { showToast } from "./showToast";
import { getFileNameFromURL } from "./getFileNameFromURL";

export const downloadAsZip = async (invoiceData, zipName = "invoices.zip") => {
  try {
    const zip = new JSZip();

    for (const item of invoiceData) {
      const url = typeof item === "string" ? item : item.invoice_url;
      // const filename = decodeURIComponent(url.split("/").pop());
      const filename = getFileNameFromURL(url)

      try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const buffer = await resp.arrayBuffer();
        zip.file(filename, buffer);
      } catch (err) {
        console.error(`Failed to download ${url}:`, err);
        zip.file(`${filename}.error.txt`, `Failed to fetch: ${err.message}`);
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = zipName;
    link.click();
  } catch (error) {
    showToast(error.message, 1);
  }
};
