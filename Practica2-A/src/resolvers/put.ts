import { RouterContext } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { CocheCollection } from "../db/mongo.ts";
import { CocheSchema } from "../db/schemas.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/mod.ts";

type AskCarContext = RouterContext<
"/askCar",
Record<string | number, string | undefined>,
Record<string, any>
>;

type ReleaseCarContex = RouterContext<
"/releaseCar/:id",{
    id:string
} &
Record<string | number, string | undefined>,
Record<string, any>
>;

export const askCar = async (context: AskCarContext)=>{
    try{
        const result = context.request.body({type: "json"});
        const value = await result.value;
        if(!value.matricula || !value.plazas){
            context.response.status = 400
            context.response.body = {
                message: "Necesitas añadir matricula y plazas"
            }
            return;
        }

        const found = await CocheCollection.findOne({matricula: value.matricula});

        if(found){
            if(found.status){
                await CocheCollection.updateOne(
                    {
                        matricula: found.matricula
                    },
                    {
                        $set:{
                            status: false,
                        },
                    }
                );
                context.response.status = 200;
                context.response.body = {
                    id: found._id.toString()
                }
                return;
            }else{
                context.response.status = 400;
                context.response.body = {message: "Coche no esta libre"}
            }
        }else{
            context.response.status = 404;
            context.response.body = {message: "Coche no encontrado"}
        }
    }catch(e){
        console.log(e);
        context.response.status = 500;
    }
}

export const releaseCar = async (context: ReleaseCarContex) => {
    try{
        if(context.params?.id){
            const car: CocheSchema | undefined = await CocheCollection.findOne({
                _id: new ObjectId(context.params.id)
            })

            if(car){
                if(!car.status){
                    await CocheCollection.updateOne(
                        {
                            _id: car._id
                        },
                        {
                            $set: {
                                status: true,
                            },
                        }
                    );
                    context.response.status = 200;
                    return;
                }else{
                    context.response.status = 400;
                    context.response.body = {message: "Coche ya esta libre"}
                }
            }else{
                context.response.status = 404;
                context.response.body = {message: "Coche no encontrado"}
            }
            }
    }catch(e){
        console.log(e);
        context.response.status = 500;
    }
}