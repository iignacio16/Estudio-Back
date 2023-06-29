import {gql} from "graphql_tag"

export const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        mail: String!
        password: String!
    }

    type Player {
        id: ID!
        name: String!
        team: Team
    }

    type Team{
        id: ID!
        name: String!
        players: [Player!]!
        matches: [Match!]!
        goals_for: Int!
        goals_against: Int!
        classified: Boolean!
    }

    enum MatchStatus{
        PENDING
        PLAYING
        FINISHED
    }

    type Match{
        id:ID!
        team1: Team!
        team2: Team!
        goals_team1: Int!
        goals_team2: Int!
        date: String!
        status: MatchStatus!
    }

    type Query {
        teams(classified: Boolean): [Team!]!
        team(id:ID!): Team!
        matches(status: MatchStatus, team: ID, date: Date):[Match!]!
        match(id:ID!): Match
        players(team_id:ID): [Player!]!
        player(id:ID!): Player!
    }

    type Mutation{
        createUser(mail:String!, password:String!): User!
        login(mail:String!, password:String!): User!
        createTeam(name:String!, players: [ID!]!, classified: Boolean!, token: String!): Team!
        updateTeam(id:ID!, players: [ID!], classified:Boolean, token: String!): Team!
        deleteTeam(id:ID!, token:String!):Team!

        createMatch(
        team1: ID!,
        team2: ID!,
        goals_team1: Int!,
        goals_team2: Int!,
        date: String!,
        status: MatchStatus!
        token: String!
        ):Match!

        updateMatch(
        id:ID!, 
        goals_team1: Int!, 
        goals_team2: Int!, 
        status:MatchStatus
        token: String!
        ): Match!

        deleteMatch(id:ID!, token:String!):Match!

        createPlayer(name: String!, token:String!): Player!
        deletePlayer(id:ID!, token:String!): Player!
    }
`;
