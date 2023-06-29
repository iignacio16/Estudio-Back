import { UserCollection } from "../db/mongo.ts";
import { CommentSchema, UserSchema } from "../db/schema.ts";

export const Comment = {
    id: (parent: CommentSchema):string => parent._id.toString(),
    author: async (parent: CommentSchema): Promise<UserSchema> => {
        try{
            const user = await UserCollection.findOne({
                _id: parent.author
            })
            if(!user) throw new Error("User not found")

            return user;
        }catch(e){
            throw new Error(e)
        }
    }
}