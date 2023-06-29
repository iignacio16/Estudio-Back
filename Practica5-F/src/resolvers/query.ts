import { MessageSchema, UserSchema } from "../db/schema.ts";
import { MessagesCollection, UserCollection } from "../db/mongo.ts";
import * as bcrypt from "bcrypt"
import { createJWT } from "../lib/jwt.ts"


export const Query = {
  login: async (
    _:unknown,
    args: {username:string, password:string}
  ): Promise<string> =>{
    try{ 
      const {username, password} = args;
      const foundUser: UserSchema | undefined =  await UserCollection.findOne({username});
      if(!foundUser){
        throw new Error("User not found");
      }

      const validPassword = await bcrypt.compare(password, foundUser.password);

      if(!validPassword){
        throw new Error("Incorrect password")
      }

      const token = await createJWT(
        { id: foundUser._id.toString(),
          username: foundUser.username,
          lang: foundUser.lang,
          createdAt: foundUser.createdAt
        }, 
        Deno.env.get("JWT_SECRET") || "" 
        );
       
        return token;
    }catch(e){
      throw new Error(e)
    }
  },

  getMessages: async (
    _:unknown,
    args:{page:number, perPage:number}
  ): Promise<MessageSchema[]> => {
    try{
      const {page, perPage} = args;

      if(page < 1) throw new Error("Bad page");
      if(perPage < 10 || perPage > 100) throw new Error("Bad perPage");


      return await MessagesCollection.find().limit(perPage).skip((page - 1 ) * perPage).toArray();
    }catch(e){
      throw new Error(e)
    }
  }
}