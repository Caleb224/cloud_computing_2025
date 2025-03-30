import {defineFunction, defineStorage} from "@aws-amplify/backend";


export const storage = defineStorage({
    name: "cloud-computing-2025",
    access: allow => ({
        'users/{entity_id}/*': [
            allow.entity('identity').to(['read','write', 'delete']),
        ]
    }),
    triggers: {
        onUpload: defineFunction({
            entry: "./on-upload-handler.ts"
        })
    }
})