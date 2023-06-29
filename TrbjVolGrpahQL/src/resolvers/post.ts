import { CommentsCollection, UserCollection } from "../db/mongo.ts";
import { CommentsSchema, PostSchema, UserSchema } from "../db/schema.ts";

export const Post = {
    id: (parent:PostSchema):string => parent._id.toString(),
    creator: async (parent:PostSchema): Promise<UserSchema> => {
        try{
            const user = await UserCollection.findOne({_id: parent.creator})
            if(!user) throw new Error("User not found")
            return user;

        }catch(e){
            throw new Error(e)
        }
    },
    comments: async (parent: PostSchema): Promise<CommentsSchema[]> => {
        try{
            const comments = await CommentsCollection.find({
                post: parent._id
            }).toArray();

            return comments;

        }catch(e){
            throw new Error(e)
        }
    }
}