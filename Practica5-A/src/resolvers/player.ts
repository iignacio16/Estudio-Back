import { TeamsCollection, UserCollection } from "../db/mongo.ts";
import { PlayerSchema, TeamSchema, UserSchema } from "../db/schema.ts";

export const Player = {
    id: (parent: PlayerSchema):string => parent._id.toString(),
    team: async (parent: PlayerSchema): Promise<TeamSchema | undefined> => {
        try{
            return await TeamsCollection.findOne({players: parent._id})
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