import { UserCollection } from "../db/mongo.ts";
import { MessageSchema, UserSchema } from "../db/schema.ts";


export const Message = {
    id: (parent: MessageSchema):string => parent._id.toString(),
    sender: async (parent: MessageSchema): Promise<Omit<UserSchema, "createdAt">> => {
        try{
            const user: UserSchema | undefined = await UserCollection.findOne({_id: parent.sender});
            if(!user){
                throw new Error("User not found")
            }
            return user;
        }catch(e){
            throw new Error(e)
        }
    },
    reciver: async (parent: MessageSchema): Promise<Omit<UserSchema, "createdAt">> => {
        try{
            const user: UserSchema | undefined = await UserCollection.findOne({_id: parent.reciver});
            if(!user){
                throw new Error("User not found")
            }
            return user;
        }catch(e){
            throw new Error(e)
        }
    },
}