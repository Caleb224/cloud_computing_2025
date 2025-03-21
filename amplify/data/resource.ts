import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  UserProfile: a
      .model({
          uuid: a.string(),
          email: a.string(),
          profileOwner: a.string(),
          firstSignIn: a.boolean()
      })
      .authorization(allow => allow.ownerDefinedIn("profileOwner"))
})
    .authorization(allow => allow.resource(postConfirmation));

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

