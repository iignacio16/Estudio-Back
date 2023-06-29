import { RouterContext } from "oak/router.ts";
import { Slot } from "../types.ts";
import { slotSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";

type BookSlotContext = RouterContext<
"/bookSlot",
Record<string | number, string | undefined>,
Record<string, any>
>;

export const bookSlot = async (context: BookSlotContext) => {
    try{
        const body  = await context.request.body({type: "json"}).value;

        if(
            !body.year ||
            !body.month || 
            !body.day ||
            !body.hour ||
            !body.dni ||
            !body.id_doctor
            ) {
                context.response.status = 406;
                return;
            }

        const {year, month, day, hour, dni, id_doctor } = body;

        const foundSlot: slotSchema | undefined = await SlotsCollection.findOne({
            year: parseInt(year),
            month: parseInt(month),
            day: parseInt(day),
            hour: parseInt(hour),
            id_doctor:id_doctor,
            aviable:true
        })

        if(!foundSlot){
            context.response.status = 404;
            return;
        }

        await SlotsCollection.updateOne(
            {
                _id: foundSlot._id
            },
            {
                $set:{
                    aviable: false,
                    dni: dni
                }
            }
        );
        context.response.status = 200;
        const {_id, ...slotSinID} = foundSlot;
        context.response.body = {...slotSinID, aviable: false, dni}

    }catch(e){
        context.response.status = 500;
        console.log(e);
    }
}