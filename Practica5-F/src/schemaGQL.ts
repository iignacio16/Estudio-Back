import {gql} from "graphql_tag"

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        password: String!
        lang: String
    }

    type Message {
        id: ID!
        sender: User!
        reciver: User!
        message: String!
    }

    type Query {
        login(username:String!, password: String!): String!
        getMessages(page:Int!, perPage:Int!): [Message]!
    }

    type Mutation {
         createUser(username:String!, password: String!): User!
         sendMessage(receiver: String!, message:String!): Message
         deleteUser: User!
    }
`;
