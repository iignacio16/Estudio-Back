import { CommentsCollection, UserCollection } from "../db/mongo.ts";
import { CommentSchema, PostSchema, UserSchema } from "../db/schema.ts";

export const Post = {
    id: (parent: PostSchema): string => parent._id.toString(),

    author: async (parent: PostSchema): Promise<UserSchema> => {
        try{
            const user = await UserCollection.findOne({
                _id: parent.author
            })
            if(!user) throw new Error("User not found")
            return user;
        }catch(e){
            throw new Error(e)
        }
    },

    comments: async (parent: PostSchema): Promise<CommentSchema[]> => {
        try{
            const comments = await CommentsCollection.find({
                _id: {$in: parent.comments}
            }).toArray()

            return comments;

        }catch(e){
            throw new Error(e)
        }
    }
}