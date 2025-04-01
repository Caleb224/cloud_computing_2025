"use client";

import { list } from "aws-amplify/storage";
import { downloadData } from "aws-amplify/storage";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAIGeneration } from "@/hooks/AIClientHooks";

/* Client side JSON parsing to avoid high lambda costs*/
type JsonObject = { [key: string]: any };

// Function to recursively strip unwanted fields from a JSON object
function stripFields<T extends JsonObject>(
  obj: T,
  fieldsToRemove: string[],
): T {
  // Create a new object to avoid mutating the original one
  const result: JsonObject = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      // If the current key is in the fieldsToRemove array, skip it
      if (fieldsToRemove.includes(key)) {
        continue;
      }

      // If the value is an object, recursively process it
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result[key] = stripFields(obj[key], fieldsToRemove);
      } else {
        result[key] = obj[key];
      }
    }
  }

  return result as T;
}

export default function Page() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [{ data, isLoading }, generateInsight] =
    useAIGeneration("generateInsight");

  const retrieveDocuments = async (filename: string, path: string) => {
    try {
      const photoResponse = await downloadData({
        path: ({ identityId }) => `users/${identityId}/${filename}.jpg`,
      }).result;

      const analysisResponse = await downloadData({
        path,
      }).result;

      const photoBlob = await photoResponse.body.blob();

      const blob = new Blob([photoBlob], { type: "image/jpeg" });
      setPreviewPhoto(URL.createObjectURL(blob));

      const analysisText = await analysisResponse.body.text();
      const parsed = JSON.parse(analysisText);

      const sanitizedText = stripFields(parsed, [
        "$metadata",
        "Geometry",
        "PageNumber",
        "Blocks",
      ]);

      generateInsight({
        input: sanitizedText,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getDocs = async () => {
      try {
        const documents = await list({
          path: ({ identityId }) => `users/${identityId}/documents/`,
        });
        setDocuments(documents.items);
      } catch (error) {
        console.error(error);
      }
    };

    getDocs();
  }, []);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-10 h-full">
      <div className="col-span-1">
        <Card className="min-h-min">
          <CardHeader>
            <CardTitle className="text-xl">Your Documents</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            {documents.map((item) => {
              const tokens = item.path.split("/");
              const filename = tokens[3].split("_")[1].split(".");
              return (
                <Button
                  onClick={() => retrieveDocuments(filename[0], item.path)}
                  key={item.name}
                >{`${filename[0]}`}</Button>
              );
            })}
          </CardContent>
        </Card>
      </div>
      <Card className="min-h-1/2 col-span-2">
        <CardHeader>
          <CardTitle className="text-xl">Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          {previewPhoto && (
            <Image
              className="rounded-sm"
              width={200}
              height={200}
              alt="Receipt Preview Image"
              src={previewPhoto}
            />
          )}
        </CardContent>
      </Card>
      <Card className="col-start-2 col-span-2 min-h-min">
        <CardHeader>
          <CardTitle className="text-xl">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {data && JSON.stringify(data, null, 2)}
        </CardContent>
      </Card>
    </div>
  );
}
