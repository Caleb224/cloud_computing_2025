import { defineFunction} from "@aws-amplify/backend";

export const postConfirmation = defineFunction({
        name: "post-confirmation",
        environment: {
                AMPLIFY_DATA_DEFAULT_NAME: "UserProfile"
        }
})