import { ObjectId } from "mongo";
import { Match } from "../types.ts";

export type MatchSchema = Omit<Match, "id"> & {
    _id: ObjectId
}