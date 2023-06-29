import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { User } from "./resolvers/user.ts";
import { Message } from "./resolvers/message.ts";


const resolvers = {
    Query,
    Mutation,
    User,
    Message
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: ({req}) => Promise.resolve({
      auth: req.headers.auth || "",
      lang:  req.headers.lang || "es",
      })
    });

    console.log(`Server running on: ${url}`);