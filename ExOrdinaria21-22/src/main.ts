import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Match } from "./resolvers/match.ts";



const resolvers = {
    Query,
    Mutation,
    Match
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    });

    console.log(`Server running on: ${url}`);