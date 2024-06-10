import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDef from "./user.typeDef.js";
import transactionTypeDef from "./transaction.typeDef.js";
const mergedTypeDefs = mergeTypeDefs([userTypeDef, transactionTypeDef]);
export default mergedTypeDefs;

// Why merge Type Definitions ?

// Modularity: Merging type definitions allows you to keep related schema components in separate files, promoting modularity and organization.

// Easier collaboration: If multiple developers are working on different parts of the schema, merging separate type definitions can make it easier to collaborate without conflicts.

// Reuse: You can reuse type definitions across different parts of the schema, potentially reducing duplication.

// Clear separation of Concerns: Each file can focus on a specific domain or type of data, making it easier to understand and maintain.
