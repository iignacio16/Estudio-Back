import { RouterContext } from "oak/router.ts";
import { Slot } from "../types.ts";
import { slotSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";

type AddSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

const isValidDate = (year:number, month:number, day:number, hour:number): boolean =>{
    const date = new Date(year,month,day,hour);
    return(
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day &&
        date.getHours() === hour
    );
}

export const addSlot = async (context: AddSlotContext)=>{
    try{
        const body: Slot = await context.request.body({type: "json"}).value
        
        if(!body?.day || !body?.month || !body?.year || !body?.hour){
            context.response.status = 406;
            return;
        }

        const {day, month, year, hour} = body;

        if(!isValidDate(year, month - 1, day, hour)){
            context.response.status = 406;
            return;
        }

        const foundSlot: slotSchema | undefined = await SlotsCollection.findOne({day,month,year,hour});

        if(foundSlot){
            if(!foundSlot.aviable){
                context.response.status = 403;
                return;
            }else{
                context.response.status = 200;
                return;
            }
        }

        const newSlot: Partial<Slot> = {
            ...body,
            aviable: true
        }

        await SlotsCollection.insertOne(newSlot as slotSchema);
        const {_id, ...slotSinID} = newSlot as slotSchema;
        context.response.body = slotSinID;

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}