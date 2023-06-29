import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schemas.ts";
import { UserCollection } from "../db/mongo.ts";

 type DeleteUserContext = RouterContext<
 "/deleteUser/:email",{
     email: string
 } & 
 Record<string | number, string | undefined>,
 Record<string, any>
 >;

 export const deleteUser = async (context: DeleteUserContext) => {
    try{
        const email = context.params?.email

        if(email){
           const validEmail =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
           if(!validEmail){
            context.response.status = 404;
            context.response.body = {
                message: "Bad request"
            }
            return;
           }

           const foundUser: UserSchema | undefined = await UserCollection.findOne({Email: email});
           if(foundUser){
            await UserCollection.deleteOne({Email: email});
            context.response.status =200;
            context.response.body = {
                message: "Usario eliminado"
            }
           }else{
            context.response.status = 404;
            context.response.body = {
                message: "No hay usuario con ese email"
            }
           }
        }

    }catch(e){
        console.log(e);
        context.response.status = 500;
        context.response.body = {message: `Error: ${e.error}`}
    }
 }