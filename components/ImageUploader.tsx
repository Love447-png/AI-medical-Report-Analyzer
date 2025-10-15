import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageUrl: string | null;
  file: File | null;
}

const UploadIcon: React.FC = () => (
  <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PdfIcon: React.FC = () => (
  <svg className="w-20 h-20 mx-auto text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.5 11.5c0 .83.67 1.5 1.5 1.5h.5a1.5 1.5 0 0 0 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5h-.5A1.5 1.5 0 0 0 9.5 9v1.5zm-2 0v-1A1.5 1.5 0 0 1 9 9h.5a1.5 1.5 0 0 1 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5zm8-1.5c.83 0 1.5.67 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-1c0-.83.67-1.5 1.5-1.5h2zM6 18h12v-2H6v2z"/>
  </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imageUrl, file }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp, application/pdf" />

      <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload your report</label>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md transition-all duration-300`}
      >
        <div className="space-y-1 text-center py-4">
          {imageUrl && file ? (
            file.type.startsWith('image/') ? (
              <img src={imageUrl} alt="Report preview" className="max-h-96 mx-auto rounded-md shadow-lg" />
            ) : (
              <div className="flex flex-col items-center justify-center p-4">
                <PdfIcon />
                <p className="mt-2 font-semibold text-gray-700 dark:text-gray-200">{file.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{Math.round(file.size / 1024)} KB</p>
              </div>
            )
          ) : (
            <>
              <UploadIcon />
              <div className="flex text-sm text-gray-600 dark:text-gray-400">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                PDF, PNG, JPG, WEBP up to 10MB
              </p>
            </>
          )}
        </div>
      </div>
      {imageUrl && (
        <div className="text-center mt-4">
          <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
            Choose a different file
          </label>
        </div>
      )}
    </div>
  );
};