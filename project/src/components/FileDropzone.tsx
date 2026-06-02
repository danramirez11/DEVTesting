import { useState } from "react";

interface FileDropzoneProps {
  onBrowse: () => void;
  onDropFiles: (files: FileList | null) => void;
}

export default function FileDropzone({ onBrowse, onDropFiles }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <button
      className={`file-dropzone ${isDragging ? "dragging" : ""}`.trim()}
      type="button"
      onClick={onBrowse}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        onDropFiles(event.dataTransfer.files);
      }}
    >
      <div className="dropzone-icon" aria-hidden="true">
        [_]
      </div>
      <p>Click or drag file to this area to upload</p>
      <small>Support for a single or bulk upload.</small>
    </button>
  );
}
