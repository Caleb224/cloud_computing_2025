import {defineBackend} from '@aws-amplify/backend';
import {auth} from './auth/resource.js';
import {data} from './data/resource.js';
import {apiScanReceipt} from "./functions/apiScanReceipt/resource";
import {HttpIamAuthorizer, HttpUserPoolAuthorizer} from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import {HttpLambdaIntegration} from "aws-cdk-lib/aws-apigatewayv2-integrations";
import {CorsHttpMethod, HttpApi, HttpMethod} from "aws-cdk-lib/aws-apigatewayv2";
import {Policy, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Stack} from "aws-cdk-lib";
import {storage} from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  apiScanReceipt,
  storage
});

const apiStack = backend.createStack("gateway-stack");

const iamAuthorizer = new HttpIamAuthorizer();

const userPoolAuthorizer = new HttpUserPoolAuthorizer(
    "gatewayAuthPool",
    backend.auth.resources.userPool,
    {
      userPoolClients: [backend.auth.resources.userPoolClient]
    }
);

const scanReceiptIntegration = new HttpLambdaIntegration(
    "scanReceiptIntegration",
    backend.apiScanReceipt.resources.lambda
);


const httpAPI = new HttpApi(
    apiStack,
    "gatewayAPI",
    {
        apiName: "gateway-api",
        corsPreflight: {
            allowMethods: [CorsHttpMethod.GET, CorsHttpMethod.POST, CorsHttpMethod.PUT, CorsHttpMethod.DELETE],
            allowOrigins: ["*"],
            allowHeaders: ["*"]
        },
        createDefaultStage: true
    }
);

httpAPI.addRoutes({
    path: "/receipts",
    methods: [HttpMethod.GET],
    integration: scanReceiptIntegration,
    authorizer: iamAuthorizer
})

const gatewayAPIPolicy = new Policy(
    apiStack,
    "gateway-api-policy",
    {
        statements: [
            new PolicyStatement({
                actions: ["execute-api:Invoke"],
                resources: [
                    `${httpAPI.arnForExecuteApi("*", "/receipts")}`,
                    `${httpAPI.arnForExecuteApi("*", "/cognito-auth-path")}`,
                ],
            })
        ]
    }
);

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(gatewayAPIPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(gatewayAPIPolicy);

backend.addOutput({
    custom: {
        API: {
            [httpAPI.httpApiName!]: {
                endpoint: httpAPI.url,
                region: Stack.of(httpAPI).region,
                apiName: httpAPI.httpApiName,
            },
        },
    },
});
