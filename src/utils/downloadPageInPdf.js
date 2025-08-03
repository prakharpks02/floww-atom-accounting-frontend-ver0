import { jsPDF } from "jspdf";

export const downloadElementAsPDF = async (
  elementOrSelector,
  filename = "sale-details.pdf",
  opts = {}
) => {
  const html2canvas = await loadHtml2CanvasPro(); // dynamic load
  const { scale = 2, orientation = "p" } = opts;

  const element =
    typeof elementOrSelector === "string"
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;

  if (!element || !(element instanceof HTMLElement)) {
    console.error("Invalid element passed");
    return;
  }

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const prevOverflow = element.style.overflow;
  element.style.overflow = "visible";

  const styleTag = document.createElement("style");
  styleTag.setAttribute("data-pdf-cleanup", "true");
  styleTag.textContent = `
    *:focus { outline: none !important; }
    * { box-shadow: none !important; }
    ::-webkit-scrollbar { display: none; }
  `;
  document.head.appendChild(styleTag);

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      scrollY: -window.scrollY,
      backgroundColor:
        window.getComputedStyle(element).backgroundColor || "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF(orientation, "pt", "a4");
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();

    const imgW = canvas.width;
    const imgH = canvas.height;
    const ratio = pdfW / imgW;
    const renderedH = imgH * ratio;

    if (renderedH <= pdfH) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, renderedH);
    } else {
      const pxPerPt = imgW / pdfW;
      const sliceH = Math.floor(pdfH * pxPerPt);
      let y = 0;
      const sliceCanvas = document.createElement("canvas");
      const sliceCtx = sliceCanvas.getContext("2d");
      if (!sliceCtx) throw new Error("Cannot get canvas context");

      while (y < imgH) {
        const fragmentHeight = Math.min(sliceH, imgH - y);
        sliceCanvas.width = imgW;
        sliceCanvas.height = fragmentHeight;
        sliceCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        sliceCtx.drawImage(
          canvas,
          0,
          y,
          imgW,
          fragmentHeight,
          0,
          0,
          imgW,
          fragmentHeight
        );
        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceRenderedH = fragmentHeight * ratio;

        if (y > 0) pdf.addPage();
        pdf.addImage(sliceData, "PNG", 0, 0, pdfW, sliceRenderedH);
        y += sliceH;
      }
    }

    pdf.save(filename);
  } catch (err) {
    console.error("PDF generation failed:", err);
    alert("Failed to generate PDF. See console for details.");
  } finally {
    element.style.overflow = prevOverflow;
    document.querySelectorAll("[data-pdf-cleanup]").forEach((n) => n.remove());
  }
};

async function loadHtml2CanvasPro(retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const mod = await import("html2canvas-pro");
      return mod.default ? mod.default : mod;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
