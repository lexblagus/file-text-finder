import {
  useState,
  type ChangeEventHandler,
  type DragEventHandler,
} from "react";

import type {FC} from 'react';

import "./Uploader.css";

const MAX_FILE_SIZE = 1024 * 1024; // in bytes, e.g.: 50 * 1024 * 1024 for 50MB

const humanByteSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} bytes`
    : bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${Math.round(bytes / 1024 / 1024)} MB`;

const isProbablyText = async (
  file: File,
  sampleSize = 512
): Promise<boolean> => {
  const blob = file.slice(0, sampleSize);
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  for (const byte of bytes) {
    if (byte === 0) return false; // Null byte -> likely binary
  }

  return true;
};

const Uploader: FC<{
  maxSizeBytes?: number;
  onLoaded: (contents: string) => void;
}> = ({
  maxSizeBytes = MAX_FILE_SIZE,
  onLoaded,
}) => {
  const acceptedFileTypes = "text/*,application/json";

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    setError(null);
    setFile(null);

    if (!files || files.length === 0) return;

    const file = files[0]; // single-file mode

    if (file.size > maxSizeBytes) {
      setError(
        `File too large (${humanByteSize(file.size)}): maximum ${humanByteSize(
          maxSizeBytes
        )}.`
      );
      return;
    }

    setFile(file);

    const isText = isProbablyText(file);

    if (!isText) {
      setError("Not a text file.");
      return;
    }

    const acceptedFileType = acceptedFileTypes
      .split(',')
      .map((t) => t.trim())
      .some((acceptedType) => {
        if (acceptedType.endsWith("/*")) {
          return file.type.startsWith(acceptedType.replace("/*", "/"));
        } else {
          return file.type === acceptedType;
        }
      });

    if (!acceptedFileType) {
      setError("File type not acceptable.");
      return;
    }

    try {
      const text = await file.text();
      onLoaded(text);
      return;
    } catch (err: any) {
      setError(err?.message ?? String(err));
    }
  }

  const onDrop: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const onDragOver: DragEventHandler<HTMLLabelElement> = (event) => {
    event.preventDefault();
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    handleFiles(event.target.files);
  };

  return (
    <div className="upload">
      <label onDrop={onDrop} onDragOver={onDragOver}>
        <div>your file here</div>
        {file && (
          <div>
            <small className="success">
              {file.name} (type: {file.type || "unknow"})
            </small>
          </div>
        )}
        {error && (
          <div>
            <small className="error">{error}</small>
          </div>
        )}
        <input
          type="file"
          accept={acceptedFileTypes}
          multiple={false}
          onChange={onInputChange}
        />
      </label>
    </div>
  );
};

export default Uploader;
