import {defineBackend} from '@aws-amplify/backend';
import {auth} from './auth/resource.js';
import {data} from './data/resource.js';
import {apiScanReceipt} from "./functions/apiScanReceipt/resource";
import {storage} from "./storage/resource";

const backend = defineBackend({
  auth,
  data,
  apiScanReceipt,
  storage
});


