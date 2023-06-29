import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Character } from "./resolvers/character.ts";
import { Episode } from "./resolvers/episode.ts";
import { Location } from "./resolvers/location.ts";




const resolvers = {
    Query,
    Character,
    Episode,
    Location
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 }
    });

    console.log(`Server running on: ${url}`);