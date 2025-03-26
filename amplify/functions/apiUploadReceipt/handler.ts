import {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";
import {receiptUploadInfo} from "../../../lib/DTO/receiptUploadInfo";
import {uploadData} from "aws-amplify/storage";

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {

    const { userId, filename, file }: receiptUploadInfo = JSON.parse(event.body!);
    let result;
    try {
        result = await uploadData({
            path: `users/${userId}/${filename}`,
            data: file,
            options: {
                bucket: "cloud-computing-2025"
            }
        }).result;

    } catch (error) {
        result = error
    }

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(result)
    }
}