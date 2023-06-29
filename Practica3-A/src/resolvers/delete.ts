import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { slotSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";

type DeleteSlotContext = RouterContext<
"/removeSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const removeSlot = async (context: DeleteSlotContext) => {
    try{
        const params = getQuery(context, { mergeParams: true });
        if(!params.year || !params.month || !params.day || !params.hour){
            context.response.status = 406;
            return;
        }

        const {year, month, day, hour} = params;

        const foundSlot: slotSchema | undefined = await SlotsCollection.findOne({
            year: parseInt(year), 
            month:parseInt(month),
            day: parseInt(day),
            hour:parseInt(hour)});
        
            if(!foundSlot){
                context.response.status = 404;
                return;
            }

            if(!foundSlot.aviable){
                context.response.status = 409;
                return;
            }

            if(foundSlot.aviable){
                await SlotsCollection.deleteOne({_id: foundSlot._id});
                context.response.status = 200;
            }
    }catch(e){
        console.log(e);
        context.response.status = 500;
    }
}