import type { S3Handler } from 'aws-lambda';
import { TextractClient, StartExpenseAnalysisCommand } from "@aws-sdk/client-textract";

const config = {
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
}

const client = new TextractClient(config);

export const handler: S3Handler = async (event) => {
    const objectKey = event.Records.map((record) => record.s3.object.key)[0];

    const input = {
        DocumentLocation: {
            S3Object: {
                Bucket: "cloud-computing-2025",
                Name: objectKey
            }
        },
        OutputConfig: {
            S3Bucket: "cloud-computing-2025",
            S3Prefix: `analysis/${objectKey}`
        }
    };

    const command = new StartExpenseAnalysisCommand(input);

    await client.send(command);
};