"use client";

import { TransferProgressEvent, uploadData } from "aws-amplify/storage";
import { AlertCircle, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Reset states
      setError(null);
      setFile(selectedFile);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await uploadData({
        path: ({ identityId }) => `users/${identityId}/${file.name}`,
        data: file,
        options: {
          bucket: "cloud-computing-2025",
          onProgress(event: TransferProgressEvent) {
            setUploadProgress(
              Math.round(
                (event.transferredBytes /
                  (event?.totalBytes || event.transferredBytes * 10)) *
                  100,
              ),
            );
          },
          metadata: {
            toProcess: "true",
          },
        },
      }).result;

      setIsUploading(false);
    } catch (err) {
      setError(JSON.stringify(err));
      setIsUploading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-10">
      <Card>
        <CardHeader>
          <CardDescription>
            Upload a picture of the receipt you would like to scan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                preview
                  ? "border-gray-300"
                  : "border-gray-300 hover:border-primary"
              }`}
              onClick={() =>
                !isUploading &&
                document.getElementById("receipt-upload")?.click()
              }
            >
              {preview ? (
                <div className="relative">
                  <Image
                    src={preview || "/placeholder.svg"}
                    alt="Receipt preview"
                    width={200}
                    height={200}
                    className="mx-auto max-h-64 rounded-md"
                  />
                  {!isUploading && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        setPreview(null);
                      }}
                    >
                      Change
                    </Button>
                  )}
                </div>
              ) : (
                <div className="py-4 cursor-pointer">
                  <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PNG or JPG up to 10MB
                  </p>
                </div>
              )}
              <input
                id="receipt-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Uploading and analyzing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={!file || isUploading}
            >
              {isUploading ? "Processing..." : "Upload Receipt"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
