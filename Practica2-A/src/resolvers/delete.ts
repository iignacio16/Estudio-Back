import { RouterContext } from "oak/router.ts";
import { CocheCollection } from "../db/mongo.ts";
import { ObjectId } from "mongo";

type DeleteCarContext = RouterContext<
  "/deleteCar/:id",
  {
    id:string;
  } &
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const deleteCar = async (context: DeleteCarContext) => {
    try{
        if(context.params?.id){
            const car = await CocheCollection.findOne({
                _id: new ObjectId(context.params.id),
            });

            if(car){
                if(car.status){
                    await CocheCollection.deleteOne({
                        _id: new ObjectId(context.params.id)
                    });
                    context.response.status = 200;
                }else{
                    context.response.status = 400;
                    context.response.body = {message: "El coche no esta libre"};
                }
            }else{
                context.response.status = 404;
                context.response.body = {message: "El coche no se ha encontrado"};
            }
        }

    }catch(e){
        console.error(e);
        context.response.status= 500;
    }
}
