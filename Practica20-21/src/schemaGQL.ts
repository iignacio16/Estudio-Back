import {gql} from "graphql_tag"

export const typeDefs = gql`

    enum Rol{
        ADMIN
        AUTHOR
        EDITOR
        USER
    }

    type User {
        id: ID!
        username:String!
        rol: [Rol]!
    }

    type Post {
        id: ID!
        title: String!
        post: String!
        author: User!
        comments: [Comment]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
    }

    type Query{
        test: String!
        getPosts: [Post]!

    }

    type Mutation {
        createUser(idAdmin: ID!, username:String!, rol: [Rol!]!): User!
        deleteUser(idAdmin: ID!, idUser:String!): User!
        createPost(idCreator:ID!,title:String!, post:String!): Post!
        deletePost(idUser:ID!, idPost:ID!): Post!
        addComment(idUser: ID!, idPost: ID!, text:String!): Comment!
        deleteComment(idUser:ID!, idComment:ID!): Comment!
    }

`;
