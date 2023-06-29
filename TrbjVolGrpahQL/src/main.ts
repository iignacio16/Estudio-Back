import { ApolloServer } from "apolloServer";
import { startStandaloneServer } from "startStandaloneServer";

import {typeDefs} from "./schemaGQL.ts"
import { Query } from "./resolvers/query.ts";
import { Mutation } from "./resolvers/mutation.ts";
import { Comments } from "./resolvers/comments.ts";
import { User } from "./resolvers/user.ts";
import { Post } from "./resolvers/post.ts";



const resolvers = {
    Query,
    Mutation,
    User,
    Post,
    Comments
  };

const server = new ApolloServer({
    typeDefs,
    resolvers,
    });

    const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 }
    });

    console.log(`Server running on: ${url}`);