import {generateClient} from "aws-amplify/api";
import {Schema} from "@/amplify/data/resource";
import {createAIHooks} from "@aws-amplify/ui-react-ai";

const aiClient = generateClient<Schema>({authMode: "userPool"});
export const {useAIGeneration} = createAIHooks(aiClient);