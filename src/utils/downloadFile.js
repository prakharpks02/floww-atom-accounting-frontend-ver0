//download document
export const downloadFile = async (url, filename) => {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`Download failed: ${resp.statusText}`);
    const blob = await resp.blob();
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${
      filename.includes(".")
        ? filename.substring(0, filename.lastIndexOf("."))
        : filename
    }`; // e.g. "Paper Art Ideas.jpg"
    document.body.appendChild(a);
    a.click();
    a.remove();

    // cleanup
    setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
  } catch (err) {
    console.error("Download error:", err);
    showToast("Failed to download file.", 1);
  }
};
