import React, { useState, useRef } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { Button } from './button';

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    onFileChange(null);
    setPreview(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ease-in-out border-gray-300">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="mx-auto h-40 rounded-lg object-contain" />
          <p className="text-sm text-gray-600 mt-2">{fileName}</p>
          <button
            onClick={removeFile}
            className="absolute top-0 right-0 mt-[-8px] mr-[-8px] bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 text-gray-500">
          <UploadCloud size={40} className="text-gray-400" />
          <div>
            <p className="font-semibold">Click to upload or drag & drop</p>
            <p className="text-sm">PNG, JPG, or WebP</p>
          </div>
          <Button type="button" variant="outline" onClick={openFileDialog}>
            Browse File
          </Button>
        </div>
      )}
    </div>
  );
}; 