import { MessagesCollection, UserCollection } from "../db/mongo.ts";
import { MessageSchema, UserSchema } from "../db/schema.ts";
import * as bcrypt from "bcrypt"
import { verifyJWT } from "../lib/jwt.ts";
import { Context, User } from "../types.ts";
import { ObjectId } from "mongo";


export const Mutation = {
  createUser: async (
    _:unknown,
    args:{username:string, password:string},
    ctx:Context
  ):Promise<Omit <UserSchema, "createdAt">> => {
    try{
      const {username, password} = args;
      if(!ctx.lang){
        throw new Error("Missing language")
      }
      const user: UserSchema | undefined = await UserCollection.findOne({username})
      if(user){
        throw new Error("User already exists")
      }
      const hashedPassword = await bcrypt.hash(password);
      
      const _id = await UserCollection.insertOne({
          username,
          password: hashedPassword,
          lang: ctx.lang,
          createdAt: new Date().toISOString()
      })
      
      return{
        _id,
        username,
        password:hashedPassword,
        lang: ctx.lang,
      }

    }catch(e){
      throw new Error(e)
    }
  },

  deleteUser: async (
    _:unknown,
    __:unknown,
    ctx:Context
  ):Promise<Omit <UserSchema, "createdAt">> =>{
    try{
      if (ctx.auth == "") throw new Error("403 not auth");
      if(!Deno.env.get("JWT_SECRET")) throw new Error("Internal server error, code:1")
  
      const {id, username, lang, createdAt } = (await verifyJWT(
        ctx.auth,
        Deno.env.get("JWT_SECRET") || ""
      )as Omit<User, "password">)
    
      if(!id)throw new Error("Invalid token")
        
      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id)
      }) 


      if(!foundUser)throw new Error("Not user")

      await UserCollection.deleteOne({_id: foundUser._id})
      return foundUser;
    }catch(e){
      throw new Error(e)
    }
  },

  sendMessage: async (
    _:unknown,
    args:{receiver: string, message:string}, 
    ctx:Context): Promise<MessageSchema | undefined> => {
      try{
        if (ctx.auth == "") throw new Error("403 not auth");
        if(ctx.lang == "") throw new Error("403 not lang");
        if(!Deno.env.get("JWT_SECRET")) throw new Error("Internal server error, code:1")

        const {id} = (await verifyJWT(
          ctx.auth,
          Deno.env.get("JWT_SECRET") || ""
          )as Omit<User, "password">)
        
          if(!id)throw new Error("Invalid token")

          const foundUser = await UserCollection.findOne({
            _id: new ObjectId(id)
          })
          if(!foundUser)throw new Error("Not user")

          const foundReciver = await UserCollection.findOne({
            _id: new ObjectId(args.receiver)
          })
          if(!foundReciver) throw new Error("Not reciver found")

          const _id = await MessagesCollection.insertOne({
            sender: foundUser._id,
            reciver: foundReciver._id,
            message: args.message,
            createdAt: new Date()
          })

          const message = await MessagesCollection.findOne({_id})
          return message;

      }catch(e){
        throw new Error(e)
      }
    }
}