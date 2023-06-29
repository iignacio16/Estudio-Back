import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import { MatchCollection } from "../db/mongo.ts";
import { MatchSchema } from "../db/schema.ts";

export const Query = {
    listMatches: async (
        _:unknown,
        __:unknown
    ): Promise<MatchSchema[]> => {
        try{
            return await MatchCollection.find({Finalizado:false}).toArray()

        }catch(e){
            throw new Error(e)
        }
    },

    getMatch: async (
        _:unknown,
        args:{id:string}
    ): Promise<MatchSchema> => {
        try{
            const {id} = args;
            const match = await MatchCollection.findOne({
                _id: new ObjectId(id)
            })
            if(!match) throw new Error("Match not found")
            return match
        }catch(e){
            throw new Error(e)
        }
    }
}