import React, { useState } from 'react';
import { X, UploadCloud, File, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
}

export function FileUploadModal({ isOpen, onClose, onUpload }: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setFiles([...files, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const removeFile = (file: File) => {
    setFiles(files.filter(f => f !== file));
  };

  const handleUpload = () => {
    onUpload(files);
    setFiles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Files</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div
            {...getRootProps()}
            className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${
              isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive ? 'Drop the files here ...' : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">We support documents and audio files. 20MB maximum.</p>
          </div>
          <div className="mt-4">
            <h4 className="font-medium">Uploaded files</h4>
            {files.length === 0 ? (
              <p className="text-sm text-gray-500">Nothing uploaded yet</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {files.map((file, i) => (
                  <li key={i} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <File className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(file)}>
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={handleUpload} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
