import { ObjectId } from "mongo";
import { Match, Player, Team, User } from "../types.ts";

export type PlayerSchema = Omit<Player, "id" | "team"> & {
    _id: ObjectId;
    updateBy: ObjectId;
}

export type TeamSchema = Omit<Team, "id" | "players" | "matches" | "goals_for" | "goals_against"> & {
    _id: ObjectId;
    players: ObjectId[];
    updateBy: ObjectId;
}

export type MatchSchema = Omit<Match, "id" | "team1" | "team2"> & {
    _id: ObjectId;
    team1: ObjectId;
    team2: ObjectId;
    updateBy: ObjectId;
}

export type UserSchema = Omit<User, "id" | "token"> & {
    _id: ObjectId
}