"use client";

import { useState, useCallback } from "react";
import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function isFileUploadElement(element: FormElement): element is FormElement & {
  type: FormElementType.FILE_UPLOAD;
  properties: {
    maxSize: number; // in bytes
    allowedTypes: string[];
    maxFiles: number;
  };
} {
  return element.type === FormElementType.FILE_UPLOAD;
}

interface FileUploadProps {
  element: FormElement;
  value: File[];
  onChange: (files: File[]) => void;
}

export function FileUpload({ element, value, onChange }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = useCallback(
    (file: File): boolean => {
      if (!isFileUploadElement(element)) return false;

      if (file.size > element.properties.maxSize) {
        toast({
          title: "File too large",
          description: `Maximum file size is ${
            element.properties.maxSize / 1024 / 1024
          }MB`,
          variant: "destructive",
        });
        return false;
      }

      if (!element.properties.allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `Allowed types are: ${element.properties.allowedTypes.join(
            ", "
          )}`,
          variant: "destructive",
        });
        return false;
      }

      return true;
    },
    [element, toast]
  );

  if (!isFileUploadElement(element)) {
    return null;
  }

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files)
      .filter(validateFile)
      .slice(0, element.properties.maxFiles - value.length);

    if (newFiles.length + value.length > element.properties.maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${element.properties.maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    onChange([...value, ...newFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <Label>
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center",
          isDragging ? "border-primary bg-muted/50" : "border-muted",
          "transition-colors duration-200"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          type="file"
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          multiple={element.properties.maxFiles > 1}
          accept={element.properties.allowedTypes.join(",")}
          id={`file-upload-${element.id}`}
        />
        <label
          htmlFor={`file-upload-${element.id}`}
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Drag & drop files here or click to browse
          </span>
          <span className="text-xs text-muted-foreground">
            Maximum size: {formatFileSize(element.properties.maxSize)}
          </span>
        </label>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.size)})
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
