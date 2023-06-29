import { SlotsCollection } from "../db/mongo.ts"
import { SlotsSchema } from "../db/schema.ts";
import { Slots } from "../types.ts"

export const Query = {
    test: () => {
        return "Funcionando"
    },

    availableSlots: async(
        _:unknown,
        args: {day?:number, month:number, year:number}
    ): Promise<Slots[]> =>{
        try{
            if(args.day){
                const slots = await SlotsCollection.find({
                    day: args.day,
                    month:args.month,
                    year: args.year
                }).toArray();

                return slots;
            }
             const slots = await SlotsCollection.find({
                    month:args.month,
                    year: args.year
                }).toArray();

               return slots;
            
        }catch(e){
            throw new Error(e)
        }
    }
}