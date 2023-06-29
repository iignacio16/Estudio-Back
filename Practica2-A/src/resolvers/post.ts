import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/mongo.ts";

type AddCarContext = RouterContext<
  "/addCar",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const addCar = async (context: AddCarContext) => {
    try{
    const body = context.request.body({type: "json"});
    const value = await body.value;

    if(!value.plazas|| !value.matricula){
        context.response.status = 400;
        context.response.body = {
            message: "Necesitas añadir matricula y plazas"
        }
        return;
    }

    const found = await CocheCollection.findOne({matricula: value.matricula});
    if(found){
        context.response.status = 400;
        context.response.body = {
            message: "El coche ya existe"
        };
        return;
    }
    
    await CocheCollection.insertOne({
        ...value,
        status: true,
    });
    context.response.body = {
        ...value,
        status: true,
    }
    }catch(e){
        console.error(e);
        context.response.status = 500;
    }
}