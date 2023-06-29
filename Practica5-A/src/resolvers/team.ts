import { MatchCollection, PlayerCollection, UserCollection } from "../db/mongo.ts";
import { MatchSchema, PlayerSchema, TeamSchema, UserSchema } from "../db/schema.ts";

export const Team = {
    id: (parent: TeamSchema):string => parent._id.toString(),
    players: async (parent: TeamSchema): Promise<PlayerSchema[]> => {
        try{
            return await PlayerCollection.find({
                _id: {$in: parent.players}
            }).toArray()

        }catch(e){
            throw new Error(e)
        }
    },
    matches: async (parent: TeamSchema): Promise<MatchSchema[]> => {
        try{
            return await MatchCollection.find({
                $or: [{team1: parent._id}, {team2: parent._id}]
            }).toArray()
        }catch(e){
            throw new Error(e)
        }
    },
    goals_for: async (parent: TeamSchema): Promise<number> => {
        try{
            const matches = await MatchCollection.find({
                $or:[{team1: parent._id}, {team2: parent._id}]
            }).toArray();

            const goals = matches.reduce((acc,match)=>{
                if(match.team1.toString() === parent._id.toString()){
                    return acc + match.goals_team1;
                }else{
                    return acc + match.goals_team2;
                }
            },0);
            return goals;
        }catch(e){
            throw new Error(e)
        }
    },
    goals_against: async (parent: TeamSchema): Promise<number> => {
        try{
            const matches = await MatchCollection.find({
                $or:[{team1: parent._id}, {team2: parent._id}]
            }).toArray();

            const goals = matches.reduce((acc,match)=>{
                if(match.team1.toString() === parent._id.toString()){
                    return acc + match.goals_team2;
                }else{
                    return acc + match.goals_team1;
                }
            },0);
            return goals;
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