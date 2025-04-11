"use client";

import { useState, useCallback } from "react";
import { FormElement, FormElementType } from "@/types/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, Upload, FileIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
export interface UploadedFile {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface FileUploadProps {
  element: FormElement;
  value: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

function isFileUploadElement(element: FormElement): element is FormElement & {
  type: FormElementType.FILE_UPLOAD;
  properties: {
    maxSize: number;
    allowedTypes: string[];
    maxFiles: number;
  };
} {
  return element.type === FormElementType.FILE_UPLOAD;
}

export function FileUpload({ element, value = [], onChange }: FileUploadProps) {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const isValidElement = isFileUploadElement(element);

  // Validate file type and size
  const validateFile = useCallback(
    (file: File): boolean => {
      if (!isValidElement) return false;

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

      // Handle wildcard file types
      const isAllowed = element.properties.allowedTypes.some((type) => {
        if (type.endsWith("/*")) {
          // For wildcards like 'image/*', match the main type
          const mainType = type.split("/")[0];
          return file.type.startsWith(mainType + "/");
        }
        // For specific types, do an exact match
        return type === file.type;
      });

      if (!isAllowed) {
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
    [element, toast, isValidElement]
  );

  // Upload file to R2 storage
  const uploadFile = useCallback(
    async (file: File): Promise<UploadedFile | null> => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/uploads", {
          method: "POST",
          body: formData,
        });
        console.log("response:", response);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload file");
        }

        const data = await response.json();
        return {
          url: data.url,
          fileName: data.fileName,
          fileType: data.fileType,
          fileSize: data.fileSize,
        };
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Upload failed",
          variant: "destructive",
        });
        return null;
      }
    },
    [toast]
  );

  // Process file selection and upload
  const handleFileChange = useCallback(
    async (files: FileList | null) => {
      if (!files || !isValidElement) return;

      // Convert FileList to array and validate each file
      const filesToProcess = Array.from(files).filter(validateFile);

      // Calculate how many more files we can add
      const currentCount = value.length;
      const remainingSlots = element.properties.maxFiles - currentCount;

      if (filesToProcess.length > remainingSlots) {
        toast({
          title: "Too many files",
          description: `Maximum ${element.properties.maxFiles} files allowed. You can add ${remainingSlots} more files.`,
          variant: "destructive",
        });
        // Only take the number of files that will fit
        filesToProcess.splice(remainingSlots);
      }

      if (filesToProcess.length === 0) return;

      setIsUploading(true);
      setUploadProgress(0);

      const uploadedFiles: UploadedFile[] = [];

      // Upload files one by one
      for (let i = 0; i < filesToProcess.length; i++) {
        const file = filesToProcess[i];
        // Update progress based on current file
        setUploadProgress(Math.round((i / filesToProcess.length) * 100));

        const uploadedFile = await uploadFile(file);
        if (uploadedFile) {
          uploadedFiles.push(uploadedFile);
        }
      }

      setUploadProgress(100);

      // Finalize upload and reset UI after a short delay
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);

        // Combine existing files with new ones
        const updatedFiles = [...value, ...uploadedFiles];
        onChange(updatedFiles);
      }, 500);
    },
    [isValidElement, validateFile, value, element, toast, uploadFile, onChange]
  );

  // Drag and drop event handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileChange(e.dataTransfer.files);
    },
    [handleFileChange]
  );

  // Function to remove a file
  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...(value || [])];
      newFiles.splice(index, 1);
      onChange(newFiles);
    },
    [value, onChange]
  );

  // Helper to format file size for display
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }, []);

  // Get appropriate icon based on file type
  const getFileTypeIcon = useCallback((fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileIcon className="h-4 w-4 text-blue-500" />;
    } else if (fileType.startsWith("video/")) {
      return <FileIcon className="h-4 w-4 text-red-500" />;
    } else if (fileType.includes("pdf")) {
      return <FileIcon className="h-4 w-4 text-red-600" />;
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FileIcon className="h-4 w-4 text-blue-600" />;
    } else if (fileType.includes("excel") || fileType.includes("sheet")) {
      return <FileIcon className="h-4 w-4 text-green-600" />;
    } else {
      return <FileIcon className="h-4 w-4 text-muted-foreground" />;
    }
  }, []);

  // Return null if not a valid file upload element
  if (!isValidElement) {
    return null;
  }

  return (
    <div className="space-y-4">
      <Label className="text-xl md:text-2xl font-medium leading-tight">
        {element.question}
        {element.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center",
          isDragging ? "border-primary bg-muted/50" : "border-muted",
          isUploading ? "opacity-70 pointer-events-none" : "",
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
          disabled={isUploading}
        />

        {isUploading ? (
          <div className="py-4 space-y-3">
            <Loader2 className="h-8 w-8 text-primary mx-auto animate-spin" />
            <div className="w-full max-w-xs mx-auto">
              <Progress value={uploadProgress} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
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
        )}
      </div>

      {value && value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                {getFileTypeIcon(file.fileType)}
                <span className="text-sm truncate max-w-[200px]">
                  {file.fileName}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({formatFileSize(file.fileSize)})
                </span>
              </div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-blue-500 h-8 mr-1"
                >
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    View
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="text-muted-foreground hover:text-destructive h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
