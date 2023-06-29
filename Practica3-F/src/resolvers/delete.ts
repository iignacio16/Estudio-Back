import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schemas.ts";
import { UserCollection } from "../db/mongo.ts";
import { ObjectId } from "mongo";

type DeleteUserContex = RouterContext<
"/deleteUser",
Record<string | number, string | undefined>,
Record<string, any>
>;

type BodyDeleteUser = {
    _id: string
}

export const deleteUser = async (context: DeleteUserContex) => {
    try{

        const body = context.request.body({type: "json"})
        const value: BodyDeleteUser = await body.value

        if(!value._id){
            context.response.status = 400;
            return;
        }

        const user: UserSchema | undefined = await UserCollection.findOne({
            _id: new ObjectId(value._id)
        }) 

        if(!user){
            context.response.status = 404;
            context.response.body = {
                message: "User doesnt exist"
            }
        }else {
            await UserCollection.deleteOne({
                _id: new ObjectId(value._id)
            })
            context.response.status = 200;
            context.response.body = {
                message: "User deleted"
            }
        }
    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}