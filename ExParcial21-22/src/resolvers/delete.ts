import { RouterContext } from "oak";
import {v4}from "uuid"
import { SlotsCollection } from "../db/mongo.ts";

type freeContext = RouterContext<
"/free",
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

export const free = async  (context: freeContext) => {
    try{
        const body = context.request.body({type: "json"});
        const value = await body.value
        const token = context.request.headers.get("token");
        const seat = value.seat;
        const day = parseInt(value.day)
        const month = parseInt(value.month)
        const year = parseInt(value.year)

        if(!token) {
            context.response.status = 500;
            return;
        }
        const isValidToken = v4.validate(token);
        if(!isValidToken){
            context.response.status= 500;
            return;
        }
        if(seat < 1 || seat > 20 ){
            context.response.status = 500;
            return;
        }
        if(!isValidDate(year, month, day)){
            context.response.status = 404;
            return;
        }

        const foundSlot = await SlotsCollection.findOne({
            day,
            month,
            year,
            seat,
            token
        })
        if(!foundSlot){
            context.response.status = 404
            return;
        }

        await SlotsCollection.deleteOne(foundSlot);
        context.response.status = 200

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}