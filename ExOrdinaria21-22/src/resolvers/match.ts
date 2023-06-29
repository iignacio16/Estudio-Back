import { MatchSchema } from "../db/schema.ts";

export const Match = {
    id: (parent: MatchSchema)=> parent._id.toString()
}