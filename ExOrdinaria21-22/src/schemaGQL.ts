import {gql} from "graphql_tag"

export const typeDefs = gql`
    type Match{
        id: ID!
        team1:String!
        team2:String!
        result: String!
        minute: Int!
        Finalizado: Boolean!
    }

    type Query{
        listMatches:[Match]!
        getMatch(id:ID!): Match!
    }
    type Mutation {
        startMatch(team1:String!, team2:String!): Match!
        setMatchData(id:ID!, result:String!, minute:Int!, ended:Boolean!): Match!
    }
`