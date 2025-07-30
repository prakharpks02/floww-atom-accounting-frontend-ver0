import JSZip from "jszip";

export const downloadAsZip = async (files) => {

  if (!files || files.length === 0) return;

  const zip = new JSZip();

  // Add each file to the zip
  files.forEach((file) => {
    zip.file(file.name, file); // add file directly
  });

  try {
    const content = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "all-files.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // cleanup
  } catch (err) {
    console.error("ZIP download failed:", err);
    throw new Error("ZIP download failed.")
  }
};
