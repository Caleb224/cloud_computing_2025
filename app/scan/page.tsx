"use client";

import {Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {AlertCircle, Upload} from "lucide-react";
import {Progress} from "@/components/ui/progress";
import Image from "next/image";
import {receiptUploadInfo} from "@/lib/DTO/receiptUploadInfo";
import {useAuthenticator} from "@aws-amplify/ui-react";
import {generateClient} from "aws-amplify/data";
import {Schema} from "@/amplify/data/resource";

import {post} from "aws-amplify/api";

export type DeductionItem = {
    category: string
    description: string
    amount: number
    confidence: number
}

export type AnalysisResult = {
    totalAmount: number
    date: string
    vendor: string
    possibleDeductions: DeductionItem[]
    rawText: string
}

const client = generateClient<Schema>();

const uploadReceipt = async (data: receiptUploadInfo) => {
    try {
        const RESToperation = post({
            apiName: "gateway-api",
            path: "/receipts",
            options: {
                body: data as unknown as undefined
            }
        });

        const { body } = await RESToperation.response;
        return await body.json();
    } catch (error) {
        console.error(error)
    }
}

export default function Page() {
    const { user } = useAuthenticator();
    const [userId, setUserId] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [error, setError] = useState<string | null>(null)
    const [result, setResult] = useState<AnalysisResult | null>(null)


    const getUserId = async () => {
        try {
            const { data} = await client.models.UserProfile.list({
                filter: {
                    email: {
                        eq: user.signInDetails!.loginId!
                    }
                }
            });
            setUserId(data[0].id);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserId();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            // Reset states
            setError(null)
            setResult(null)
            setFile(selectedFile)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreview(e.target?.result as string)
            }
            reader.readAsDataURL(selectedFile)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setError("Please select a file to upload")
            return
        }

        if (!userId) {
            await getUserId()
        }

        try {
            setIsUploading(true)
            setUploadProgress(0)

            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return prev
                    }
                    return prev + 10
                })
            }, 300)

            const uploadInfo: receiptUploadInfo = {
                userId: userId!,
                filename: file?.name,
                file: file
            }

            const uploadResponse = await uploadReceipt(uploadInfo);

            alert(JSON.stringify(uploadResponse, null, 2));

            setResult({
                totalAmount: 0,
                date: "",
                vendor: "",
                possibleDeductions: [],
                rawText:""
            })

            // Call server action to analyze receipt
            // const analysisResult = await analyzeReceipt(formData)

            clearInterval(progressInterval)
            setUploadProgress(100)

            setTimeout(() => {
                setIsUploading(false)
                // setResult(analysisResult)
            }, 500)
        } catch (err) {
            setError(JSON.stringify(err))
            setIsUploading(false)
        }
    }


    return (
        <div className="h-full w-full flex flex-col p-10">
            <Card>
                <CardHeader>
                    <CardDescription>Upload a picture of the receipt you wouldd like to scan</CardDescription>
                    {userId + " or " + user?.userId}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center ${
                                preview ? "border-gray-300" : "border-gray-300 hover:border-primary"
                            }`}
                            onClick={() => !isUploading && document.getElementById("receipt-upload")?.click()}
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
                                                e.stopPropagation()
                                                setFile(null)
                                                setPreview(null)
                                            }}
                                        >
                                            Change
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className="py-4 cursor-pointer">
                                    <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400"/>
                                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                    <p className="text-xs text-gray-400 mt-1">PNG or JPG up to 10MB</p>
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
                                <AlertCircle className="h-4 w-4"/>
                                <span>{error}</span>
                            </div>
                        )}

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Uploading and analyzing...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <Progress value={uploadProgress} className="h-2"/>
                            </div>
                        )}

                        <Button type="submit" className="w-full" disabled={!file || isUploading}>
                            {isUploading ? "Processing..." : "Upload Receipt"}
                        </Button>
                    </form>
                    {result && <h1>Result set</h1>}
                </CardContent>
            </Card>
        </div>
    )
}