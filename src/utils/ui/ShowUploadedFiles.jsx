import { X } from "lucide-react";
import { defaultStyles, FileIcon } from "react-file-icon";

export const ShowUploadedFiles = ({ files, setfiles = () => {} }) => {
  const getFileExtension = (filename) => {
    return filename?.split(".").pop().toLowerCase();
  };

  const isImage = (ext) => {
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  };

  const getFilePreview = (file, ext) => {
    if (isImage(ext)) {
      return (
        <img
          src={ file?.related_doc_url || URL.createObjectURL(file)}
          alt={`preview ${file?.name || file?.related_doc_name}`}
          className="object-cover w-full h-full text-[10px]"
        />
      );
    } else {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="w-12 h-12">
            <FileIcon
              extension={ext}
              {...(defaultStyles[ext] || defaultStyles.doc)}
            />
          </div>
        </div>
      );
    }
  };

  const handleFileClick = (file, ext) => {
    if (isImage(ext)) {
      const imageUrl = URL.createObjectURL(file);
      window.open(imageUrl, "_blank");
    } else {
      // For non-image files, you might want to handle differently
      // This is a basic implementation that might not work for all files
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="max-h-[200px] w-full overflow-auto flex flex-wrap gap-3 pt-5">
      {files.map((file, index) => {
        const ext = getFileExtension(file?.name || file?.related_doc_name);
        return (
          <div
            key={index}
            className="relative w-[100px] flex flex-col items-center gap-1"
          >
            <div
              className="w-[100px] h-[100px] bg-gray-100 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden"
              onClick={(e) => {
                e.preventDefault();
                if (file?.related_doc_url) {
                  window.open(file?.related_doc_url, "_blank");
                } else handleFileClick(file, ext);
              }}
            >
              {getFilePreview(file, ext)}
            </div>
            <p className="text-[#606060] text-xs text-center w-full truncate">
              {file?.name || file?.related_doc_name}
            </p>
            {/* cancel button */}
            <button
              aria-label="cancel file"
              onClick={(e) => {
                e.stopPropagation();
                const updatedFiles = files?.filter(
                  (item, ind) => ind !== index
                );
                setfiles(updatedFiles);
              }}
              className="absolute w-fit h-fit -top-2 -right-2 p-1 border border-gray-400 rounded-full bg-gray-300 cursor-pointer hover:bg-gray-400 transition"
            >
              <X className="w-3 h-3 text-gray-800" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
