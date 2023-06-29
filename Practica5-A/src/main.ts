import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Player } from "./resolvers/player.ts";
import { Team } from "./resolvers/team.ts";
import { Match } from "./resolvers/match.ts";
import { User } from "./resolvers/user.ts";


const resolvers = {
    Query,
    Mutation,
    Player,
    Team,
    Match,
    User,
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    });

    console.log(`Server running on: ${url}`);