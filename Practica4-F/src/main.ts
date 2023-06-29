import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Seller } from "./resolvers/seller.ts";
import { Dealer } from "./resolvers/dealer.ts";
import { Car } from "./resolvers/car.ts";

const resolvers = {
    Query,
    Mutation,
    Seller,
    Dealer,
    Car,
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    });

    console.log(`Server running on: ${url}`);