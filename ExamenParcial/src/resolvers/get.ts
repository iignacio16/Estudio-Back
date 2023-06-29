import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { slotSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";

type getAviableSlots = RouterContext<
"/availableSlots",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const getSlots = async (context: getAviableSlots) => {
    try{
        const params = getQuery(context, {mergeParams:true})

        if(!params.year || !params.month){
            context.response.status = 406;
            return;
        }

        const {year, month, day} = params;

        if(day){
            const slots : slotSchema[] = await SlotsCollection.find({
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                aviable:true
            }).toArray();

            context.response.status = 200;
            context.response.body = slots.map(((s)=>{
                const {_id, ...slotSinID} = s;
                return slotSinID;
            }))
        }else{
            const slots : slotSchema[] = await SlotsCollection.find({
                year: parseInt(year),
                month: parseInt(month),
                aviable: true
            }).toArray()

            context.response.status = 200;
            context.response.body = slots.map((slot)=>{
                const {_id, ...slotsSinID} = slot;
                return slotsSinID
            })
        }

    }catch(e){
        context.response.status = 500;
        console.log(e);
    }
}