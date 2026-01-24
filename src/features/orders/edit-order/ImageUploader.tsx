"use client";
import { DOMAIN } from "@/core/config/constants";
import { usePathname } from "next/navigation";
import React from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

interface ImageUploaderProps {
  onFilesChange?: (files: File[]) => void;
  files: File[]; // Ahora lo recibimos como prop
  accept?: { [mime: string]: string[] };
  existingFiles?: string[];
  onRemoveExistingFile?: (name: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFilesChange,
  files,
  accept = { "image/*": [], "application/pdf": [] },
  existingFiles = [],
  onRemoveExistingFile,
}) => {
  const pathname = usePathname();
  const onDrop = (acceptedFiles: FileWithPath[]) => {
    const renamedFiles: File[] = acceptedFiles.map((file) => {
      const extension = file.name.split(".").pop();
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
      const uniqueId = crypto.randomUUID(); // o uuidv4()
      const newName = `${timestamp}-${uniqueId}.${extension}`;
      return new File([file], newName, { type: file.type });
    });

    const updated = [...files, ...renamedFiles];

    // ❌ Eliminar esta línea:
    // setFiles(updated);

    // ✅ Esta es la forma correcta:
    onFilesChange?.(updated);
  };

  const removeFile = (indexToRemove: number) => {
    const updated = files.filter((_, i) => i !== indexToRemove);
    onFilesChange?.(updated);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    onDrop,
    multiple: true,
  });

  return (
    <div className="mb-6">
      <h3 className="font-bold mb-2">Attach Photos or Take Pictures</h3>

      <div
        {...getRootProps()}
        className="border-1 border-dashed border-gray-300 p-4 rounded-md text-center cursor-pointer bg-[#f6f3f4] py-10"
      >
        <input {...getInputProps({ capture: "environment" })} />
        <p>
          {isDragActive
            ? "Drop the files here ..."
            : "Click to upload or take a photo with your camera"}
        </p>
      </div>

      {(existingFiles.length > 0 || files.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Archivos existentes */}
          {existingFiles.map((name, index) => (
            <div
              key={`existing-${index}`}
              className="relative border rounded-md overflow-hidden w-[100px] h-[100px] flex-shrink-0"
            >
              <img
                src={`${DOMAIN}uploads/workorders/${name}`}
                alt={`existing-${index}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onRemoveExistingFile?.(name)}
                type="button"
                className="btn bg-red-500 text-white absolute right-0 top-0 rounded-full cursor-pointer transition-all hover:bg-red-400 min-w-[20px] max-h-[20px] flex items-center justify-center font-normal p-0"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}

          {/* Archivos nuevos */}
          {files.map((file, index) => (
            <div
              key={`new-${index}`}
              className="relative border rounded-md overflow-hidden w-[100px] h-[100px] flex-shrink-0"
            >
              {file.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-200 text-xs text-center px-2">
                  {file.name}
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                type="button"
                className="btn bg-red-500 text-white absolute right-0 top-0 rounded-full cursor-pointer transition-all hover:bg-red-400 min-w-[20px] max-h-[20px] flex items-center justify-center font-normal p-0"
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
