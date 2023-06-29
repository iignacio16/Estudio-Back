import { ApolloServer } from "apolloServer"
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Book } from "./resolvers/book.ts";
import { PressHouse } from "./resolvers/pressHouse.ts";
import { Author } from "./resolvers/author.ts";

const resolvers = {
    Query,
    Mutation,
    Book,
    PressHouse,
    Author
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    });

    console.log(`Server running on: ${url}`);