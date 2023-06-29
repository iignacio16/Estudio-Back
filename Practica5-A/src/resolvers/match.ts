import { TeamsCollection, UserCollection } from "../db/mongo.ts";
import { MatchSchema, TeamSchema, UserSchema } from "../db/schema.ts";

export const Match = {
    id: (parent: MatchSchema):string => parent._id.toString(),
    team1: async (parent: MatchSchema): Promise<TeamSchema> => {
        try{
            const team1 = await TeamsCollection.findOne({_id: parent.team1});
            if(team1){
                return team1
            }else{
             throw new Error("Not team1 found")
            }

        }catch(e){
            throw new Error(e)
        }
    },
    team2: async (parent: MatchSchema): Promise<TeamSchema> => {
        try{
            const team1 = await TeamsCollection.findOne({_id: parent.team2});
            if(team1){
                return team1
            }else{
             throw new Error("Not team1 found")
            }

        }catch(e){
            throw new Error(e)
        }
    },
    updateBy: async (parent: TeamSchema): Promise<UserSchema> => {
        try{
            const user = await UserCollection.findOne({_id: parent.updateBy})
            if(!user){
                throw new Error("User not found")
            }
            return user;
        }catch(e){
            throw new Error(e)
        }
    }
}