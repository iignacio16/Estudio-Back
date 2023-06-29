import { RouterContext } from "oak/router.ts";
import { SlotsSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";
import { getQuery } from "oak/helpers.ts";

type statusContext = RouterContext<
  "/status",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type getFreeseatsContext = RouterContext<
"/freeseats",
Record<string | number, string | undefined>,
Record<string, any> & {
    day:number,
    month: number,
    year: number
}
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


export const getStatus = (context: statusContext) =>{
    try{
        const date = new Date()
        const day = date.getDay()
        const month = date.getMonth()
        const year = date.getFullYear()
        context.response.status = 200
        context.response.body = { message: `${day}-${month}-${year}`}

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const getFreeSeats = async (context: getFreeseatsContext) => {
    try{

        const params = getQuery(context, {mergeParams:true})

        if(!params.day || !params.month || !params.year){
            context.response.status = 400;
            return;
        }
        const day = parseInt(params.day)
        const month = parseInt(params.month)
        const year = parseInt(params.year)

        if(!isValidDate(year,month,day)){
            context.response.status = 400;
            context.response.body = {
                message: "Bad day"
            }
        }

        const slots: SlotsSchema[] = await SlotsCollection.find({
            day,
            month,
            year
        }).toArray();

        const bookSeats = slots.map((s)=> s.seat)

        const freeSeats = []

        for(let i =1; i <= 20; i ++){
            if(!bookSeats.includes(i)){
                freeSeats.push(i)
            }
        }

        context.response.status = 200;
        context.response.body = {
            freeSeats: freeSeats
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}
