import { PostsCollection, UserCollection } from "../db/mongo.ts";
import * as bcrypt from "bcrypt"
import { createJWT } from "../lib/jwt.ts";
import { PostSchema } from "../db/schema.ts";

export const Query = {
    login: async (
        _:unknown,
        args: {mail:string, password:string}
    ): Promise<string> => {
        try{
        
            const {mail, password} = args;

            const user = await UserCollection.findOne({mail});
            if(!user) throw new Error("User not found");

            const validPassword = await bcrypt.compare(password, user.password);

            if(!validPassword) throw new Error("Password not valid")

            const token =  await createJWT({
                id: user._id.toString(),
                mail,
                author: user.author,
            },
            Deno.env.get("JWT_SECRET") || "");

            return token;

        }catch(e){
            throw new Error(e)
        }
    },

    getPosts: async (
        _:unknown,
        __:unknown
    ): Promise<PostSchema[]> => {
        try{
            return await PostsCollection.find().toArray()
        }catch(e){
            throw new Error(e)
        }
    }
}