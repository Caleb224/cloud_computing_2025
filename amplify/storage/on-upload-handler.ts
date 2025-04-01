import type { S3Handler } from 'aws-lambda';
import {
    TextractClient,
    AnalyzeExpenseCommand,
    AnalyzeExpenseCommandInput,
    AnalyzeExpenseCommandOutput
} from "@aws-sdk/client-textract";
import {S3Client, HeadObjectCommand, PutObjectCommand, PutObjectCommandInput} from "@aws-sdk/client-s3";

const client = new TextractClient({
    region: 'us-east-1'
});

const storage_client = new S3Client({
    region: "us-east-1",
});

const storeResponse = async (response: AnalyzeExpenseCommandOutput, bucket:string, upload_info: string[]) => {
    const file_tokens = upload_info[2].split(".");

    try {
        const params: PutObjectCommandInput = {
            Bucket: bucket,
            Key: `users/${upload_info[1]}/documents/analysis_${file_tokens[0]}.json`,
            Body: JSON.stringify(response)
        }

        await storage_client.send(new PutObjectCommand(params))
    } catch (error) {
        console.error(error)
    }
}

export const handler: S3Handler = async (event) => {

    const objectKey = decodeURIComponent(event.Records[0].s3.object.key!);
    const bucketName = event.Records[0].s3.bucket.name!;

    const tokens = objectKey.split("/");

    let recurse_check = await storage_client.send(new HeadObjectCommand({
        Bucket: bucketName,
        Key: objectKey
    }))

    // @ts-ignore
    if (recurse_check && recurse_check.Metadata["toprocess"] === "true") {
        const input: AnalyzeExpenseCommandInput = {
            Document: {
                S3Object: {
                    Bucket: bucketName,
                    Name: objectKey
                }
            },
        };

        const command = new AnalyzeExpenseCommand(input);

        const response = await client.send(command);

        await storeResponse(response, bucketName, tokens);
    }

};