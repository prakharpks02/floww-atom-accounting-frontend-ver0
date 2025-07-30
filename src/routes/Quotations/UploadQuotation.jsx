import { File, FileText, Image, Upload } from "lucide-react"

export const UploadQuotation = () => {
    return (<>
        <div className="p-6 md:px-4 xl:px-6 2xl:px-8">
            <h1 className="2xl:text-2xl xl:text-xl lg:text-lg text-base font-medium text-black mb-4">
                Upload existing purchase order
            </h1>
            <div className="flex flex-col items-center text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg w-full mb-6">
                    <label
                        htmlFor="upload-existing-quotation"
                        className=" p-8 w-full h-full cursor-pointer flex flex-col items-center">
                        <Upload className="text-gray-400 mb-2" size={24} />
                        <p className="text-[#000000CC] xl:text-base md:text-sm text-xs font-medium ">Upload Purchase Orders, receipts, or related documents</p>
                        <p className="text-[#00000080] font-normal xl:text-sm text-xs  mt-1">Supported formats: PDF, JPG, PNG, DOC (Max 10MB)</p>
                    </label>
                    <input
                        id="upload-existing-quotation"
                        type="file"
                        accept=".pdf, .jpg, .png, .doc, .docx"
                        className=" hidden"
                    />
                </div>
            </div>
        </div>
    </>)
}