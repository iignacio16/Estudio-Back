import {gql} from "graphql_tag"

export const typeDefs = gql`

    type User {
        id: ID!
        mail: String!
        password: String!
        author: Boolean!
    }

    type Post {
        id: ID!
        creator: User!
        description: String!
        comments: [Comments]!
    }

    type Comments {
        id:ID!
        post: Post!
        creator: User!
        comment: String!
    }

    type Query {
        login(mail:String!,password:String!):String!
        getPosts: [Post]!
        
    }

    type Mutation {
        createUser(mail: String!, password:String!, author:Boolean!):User!
        createPost(token:String!, description:String!): Post!
        deletePost(token:String!, idpost:String!): Post!
        updatePost(token:String!, description:String!, idpost:String!): Post!
        createComment(token:String!, idpost:String!, comment:String!): Comments!
        deleteComment(token:String!, idComment:String!): Comments!
        updateComment(token:String!, idComment:String!, comment:String!): Comments!
        
    }

`
