import { PostsCollection, UserCollection } from "../db/mongo.ts";
import { CommentsSchema, PostSchema, UserSchema } from "../db/schema.ts";


export const Comments = {
    id: (parent: CommentsSchema):string => parent._id.toString(),
    post: async (parent: CommentsSchema): Promise<PostSchema> => {
        try{
            const post = await PostsCollection.findOne({
                _id: parent.post
            })
            if(!post) throw new Error("Not post found")
            return post;

        }catch(e){
            throw new Error(e)
        }
    },
    creator: async (parent:CommentsSchema): Promise<UserSchema> => {
        try{
            const user = await UserCollection.findOne({
                _id: parent.creator
            })
            if(!user) throw new Error("Not user found")

            return user;

        }catch(e){
            throw new Error(e)
        }
    }
} 