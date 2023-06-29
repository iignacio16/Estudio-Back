export type User = {
    id:string
    mail:string
    password:string,
    token:string
}

export type Player = {
    id: string
    name: string
    team?: Team
}

export type Team = {
    id: string
    name: string
    players: Player[]
    matches: Match[]
    goals_for: number
    goals_against: number
    classified: boolean
}

export enum MatchStatus {
    PENDING = "PENDING",
    PLAYING = "PLAYING",
    FINISHED = "FINISHED"
}

export type Match = {
    id:string
    team1: Team
    team2: Team
    goals_team1: number
    goals_team2: number
    date: Date
    status: MatchStatus
}