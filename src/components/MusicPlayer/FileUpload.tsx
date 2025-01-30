import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoCloudUpload, IoMusicalNotes } from 'react-icons/io5';

interface FileUploadProps {
  onFilesSelected: (files: FileList) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.classList.add('border-violet-400', 'bg-violet-950/50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    target.classList.remove('border-violet-400', 'bg-violet-950/50');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(files);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div
        className="w-full rounded-2xl p-8 cursor-pointer border-2 border-dashed border-violet-700/50 
                   bg-violet-950/20 backdrop-blur-sm transition-all duration-300 
                   hover:border-violet-500 hover:bg-violet-900/20 
                   shadow-[0_0_20px_rgba(120,0,255,0.05)]"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          id="file-input"
          className="hidden"
          multiple
          accept="audio/*"
          onChange={handleFileInput}
        />
        <label htmlFor="file-input" className="flex flex-col items-center justify-center text-center cursor-pointer">
          <motion.div
            className="relative mb-6 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl group-hover:bg-violet-400/30 transition-colors duration-300" />
            <div className="relative">
              <IoCloudUpload className="w-16 h-16 text-violet-300" />
              <IoMusicalNotes className="w-8 h-8 text-violet-200 absolute -bottom-1 -right-1" />
            </div>
          </motion.div>
          <h3 className="text-xl font-bold text-violet-100 mb-2">
            Drop your music files here
          </h3>
          <p className="text-violet-300 mb-2">
            or click to browse
          </p>
          <p className="text-violet-400/60 text-sm">
            Supports MP3, WAV, OGG, and more
          </p>
        </label>
      </div>
    </motion.div>
  );
}; 