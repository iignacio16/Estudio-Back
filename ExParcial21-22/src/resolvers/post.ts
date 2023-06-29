import { RouterContext } from "oak/router.ts";
import { SlotsCollection } from "../db/mongo.ts";
import {v4}from "uuid"
import { SlotsSchema } from "../db/schemas.ts";

type bookContext = RouterContext<
"/book",
Record<string | number, string | undefined>,
Record<string, any> 
>;

const isValidDate = (
    year: number,
    month: number,
    day: number,
): boolean => {
    const date = new Date(year, month, day)
    return(
        date.getFullYear() === year &&
        date.getMonth()  === month &&
        date.getDate() === day)
}

type IBody = {
    day: number,
    month:number,
    year: number,
    seat: number,
}

export const bookSeat = async (context: bookContext) => {
    try{
        
        const body = context.request.body({type: "json"});
        const value: IBody = await body.value
        if(value.seat < 1 || value.seat > 20 ){
            context.response.status = 500;
            return;
        }

        const foundSlot = await SlotsCollection.findOne({
            day: value.day,
            month: value.month,
            year: value.year,
            seat: value.seat
        })

        if(foundSlot){
            context.response.status = 404
            return;
        }

    
        const newToken= crypto.randomUUID();
        const isValidToken = v4.validate(newToken);

        const newBook: Partial<SlotsSchema> = {
            day: value.day,
            month: value.month,
            year: value.year,
            seat: value.seat,
            token: newToken
        } 

        if(isValidDate(value.year, value.month, value.day) && isValidToken){
            await SlotsCollection.insertOne(newBook as SlotsSchema);
            const {_id, ...BookWithOutID} = newBook as SlotsSchema;
            context.response.status = 200;
            context.response.body = {BookWithOutID}
        }else{
            context.response.status = 500;
            return;
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

