import type { S3Handler } from 'aws-lambda';
import { TextractClient, AnalyzeExpenseCommand, AnalyzeExpenseCommandInput} from "@aws-sdk/client-textract";

const client = new TextractClient();

export const handler: S3Handler = async (event) => {
    const objectKey = decodeURI(event.Records[0].s3.object.key!);
    const bucketName = event.Records[0].s3.bucket.name!;
    
    console.log(JSON.stringify(event,  null, 2));

    const input: AnalyzeExpenseCommandInput = {
        Document: {
            S3Object: {
                Bucket: bucketName,
                Name: objectKey
            }
        }
    };

    const command = new AnalyzeExpenseCommand(input);


    const response = await client.send(command);

    console.log(JSON.stringify(response.DocumentMetadata))
};