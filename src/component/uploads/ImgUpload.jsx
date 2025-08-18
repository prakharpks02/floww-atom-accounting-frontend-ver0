import React, { useState } from "react";
import { BlobServiceClient } from "@azure/storage-blob";

async function uploadEmployeeFile(datafile, fileName, userId, sasUrl) {
  // Extract file extension
  const fileParts = datafile.name.split(".");
  const fileType = fileParts[fileParts.length - 1].toLowerCase();

  // Generate random name
  const randomChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomName = "emp-";
  for (let i = 0; i < 6; i++) {
    randomName += randomChars.charAt(
      Math.floor(Math.random() * randomChars.length)
    );
  }

  // Construct full path
  const fullFileName = `${userId}/hr/employee/${randomName}-${fileName}.${fileType}`;

  // Create blob client using SAS URL
  // const sasUrl = `https://${YOUR_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${YOUR_CONTAINER_NAME}?${sasToken}`;
  const blobServiceClient = new BlobServiceClient(sasUrl);
  const blobClient = blobServiceClient
    .getContainerClient()
    .getBlockBlobClient(fullFileName);

  // Set content type based on file extension
  let options = {};
  const contentTypeMap = {
    pdf: "application/pdf",
    png: "image/png",
    jpeg: "image/jpeg",
    jpg: "image/jpg",
    gif: "image/gif",
  };

  if (contentTypeMap[fileType]) {
    options = {
      blobHTTPHeaders: {
        blobContentType: contentTypeMap[fileType],
      },
    };
  }

  // Upload the file
  await blobClient.uploadData(await datafile.arrayBuffer(), options);

  return blobClient.url;
}

const ImgUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Get SAS token from environment variables
  const storageAccount = "floww0"; // From your existing code
  const containerName = "consoleupload"; // From your existing code
  const sasToken = import.meta.env.VITE_SAS_TOKEN ; 

  const sasUrl = `https://cdn.gofloww.co/consoleupload?${sasToken}`;
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      if (!fileName) {
        setFileName(selectedFile.name.split(".")[0]);
      }
    } else {
      setPreviewUrl("");
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    if (!fileName) return alert("Please enter a file name.");

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadEmployeeFile(
        file,
        fileName,
        "guest", // Replace with actual user ID
        sasUrl
      );
      setUploadUrl(uploadedUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container">
      <h2>File Upload</h2>
      <div>
        <div className="input-group">
          <label>
            Select File:
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input"
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            File Name (without extension):
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </label>
        </div>

        {previewUrl && (
          <div className="preview-container">
            {file.type.startsWith("image/") ? (
              <img src={previewUrl} alt="Preview" className="preview-image" />
            ) : (
              <div className="file-preview">
                <span>{file.name}</span>
                <span>({Math.round(file.size / 1024)} KB)</span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="upload-button"
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>

        {uploadUrl && (
          <div className="result-container">
            <p>Upload successful!</p>
            <a href={uploadUrl} target="_blank" rel="noopener noreferrer">
              View uploaded file
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(uploadUrl)}
              className="copy-button"
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImgUpload;
