import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const generationPrompt = "Take the following AWS Textract Output and create a JSON object that reflects the information from the extracted receipt";

const schema = a.schema({
    generateInsight: a
        .generation({
            aiModel: a.ai.model("Llama 3.1 70B Instruct"),
            systemPrompt: generationPrompt,
            inferenceConfiguration: {
                temperature: 0.7,
                topP: 1,
                maxTokens: 2000,
            },
        })
        .arguments({
            input: a.string()
        })
        .returns(
            a.customType({
                summary: a.string().required()
            })
        ).authorization((allow) => allow.authenticated()),
    UserProfile: a
      .model({
          email: a.string(),
          profileOwner: a.string(),
          firstSignIn: a.boolean(),
          receiptTag: a.id()
      })
      .authorization(allow => allow.ownerDefinedIn("profileOwner")),
})
    .authorization(allow => allow.resource(postConfirmation));

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

