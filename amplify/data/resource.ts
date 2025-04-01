import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const generationPrompt = "Empty prompt";

const schema = a.schema({
    generateInsight: a
        .generation({
            aiModel: a.ai.model("Llama 3.1 405B Instruct"),
            systemPrompt: generationPrompt
        })
        .arguments({
            input: a.string()
        })
        .returns(
            a.customType({
                items: a.customType({
                    name: a.string(),
                    category: a.string(),
                    price: a.string()
                })
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

