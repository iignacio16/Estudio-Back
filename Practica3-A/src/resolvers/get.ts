import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { slotSchema } from "../db/schemas.ts";
import { SlotsCollection } from "../db/mongo.ts";

type getAviableSlots = RouterContext<
"/availableSlots",
Record<string | number, string | undefined>,
Record<string, any>
& {day?: string, 
    id_doctor?: string}
>;

type doctorAppointmentsContext = RouterContext<
"/doctorAppointments/:id_doctor", {
    id_doctor: string
} &
Record<string | number, string | undefined>,
Record<string, any>
>;
type patientAppointmentsContext = RouterContext<
"/patientAppointments/:dni", {
    dni: string
} &
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

        const {year, month, day, id_doctor} = params;

        if(day && id_doctor){
            const slots : slotSchema[] = await SlotsCollection.find({
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                id_doctor: id_doctor,
                aviable:true
            }).toArray();

            context.response.status = 200;
            context.response.body = slots.map(((s)=>{
                const {_id, ...slotSinID} = s;
                return slotSinID;
            }))
        }else if(day){
            const slots : slotSchema[] = await SlotsCollection.find({
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                aviable: true
            }).toArray()

            context.response.status = 200;
            context.response.body = slots.map((slot)=>{
                const {_id, ...slotsSinID} = slot;
                return slotsSinID
            })
        }else if(id_doctor){
            const slots : slotSchema[] = await SlotsCollection.find({
                year: parseInt(year),
                month: parseInt(month),
                id_doctor: id_doctor,
                aviable: true
            }).toArray()

            context.response.status = 200;
            context.response.body = slots.map((slot)=>{
                const {_id, ...slotsSinID} = slot;
                return slotsSinID
            })
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

export const doctorAppointments = async (context: doctorAppointmentsContext) => {
    try{
            const {id_doctor} = context.params

            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth() + 1;
            const day = today.getDate();

            const slots = await SlotsCollection.find({
                id_doctor,
                aviable: false,
                $or: [
                    {
                        year,
                        month,
                        day: {$gte: day},
                    },
                    {
                        year,
                        month: {$gte: month},

                    },
                    {
                        year: {$gte: year}

                    },
                ],
            }).toArray();

            context.response.status = 200;
            context.response.body = slots.map((s)=>{
                const {_id, ...slots} = s;
                return slots;
            })
        
    }catch(e){
        context.response.status = 500;
        console.log(e);
    }
}

export const patientAppointments = async (context: patientAppointmentsContext) => {
    try{

        const {dni} = context.params;
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();

        const slots = await SlotsCollection.find({
            dni,
            aviable: false,
            $or: [
                {
                    year,
                    month,
                    day: {$gte: day},
                },
                {
                    year,
                    month: {$gte: month},

                },
                {
                    year: {$gte: year}

                },
            ],
        }).toArray();

        if(slots.length > 0){
            context.response.status = 200;
            context.response.body = slots.map((s)=>{
                const {_id, aviable, ...slots} = s;
                return slots;
            })
        }else{
            context.response.status = 400
        }

    }catch(e){
        context.response.status = 500;
        console.log(e);
    }
}