import type {APIGatewayProxyEventV2, APIGatewayProxyHandlerV2} from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
    console.log(event);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify("Hello from scan receipt!")
    }
}