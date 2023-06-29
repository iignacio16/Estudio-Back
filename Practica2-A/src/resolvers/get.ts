import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/mongo.ts";
import { ObjectId } from "mongo";
import { CocheSchema } from "../db/schemas.ts";

type GetCarContext = RouterContext<
  "/car/:id",{
    id: string
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const getCar = async (context: GetCarContext) => {
    try{ 
    if(context.params?.id){
        const car: CocheSchema | undefined = await CocheCollection.findOne({
            _id: new ObjectId(context.params.id)
        });

        if(car){
            const {_id, ...cocheWithoutId} = car as CocheSchema;

            context.response.status = 200;
            context.response.body = {
                ...cocheWithoutId,
                id: _id.toString(),
            };
        }else{
            context.response.status = 404;
            context.response.body= {message: "No se ha encontrado el coche"}
        }
    }

    }catch(e){
        console.log(e);
        context.response.status = 500;
    }
}
