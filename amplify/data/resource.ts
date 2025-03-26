import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { postConfirmation } from "../auth/post-confirmation/resource";

const schema = a.schema({
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

