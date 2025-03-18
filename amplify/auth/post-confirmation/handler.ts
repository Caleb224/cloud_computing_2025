import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from "../../../amplify_outputs.json";

Amplify.configure(parseAmplifyConfig(outputs));

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
    await client.models.UserProfile.create({
        uuid: event.request.userAttributes.sub,
        email: event.request.userAttributes.email,
        profileOwner: `${event.request.userAttributes.sub}::${event.userName}`,
    });

    return event;
};