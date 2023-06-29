import { PostsCollection } from "../db/mongo.ts"
import { PostSchema } from "../db/schema.ts"


export const Query = {
  test:(_:unknown, __:unknown):string=> {
    return "Todo ok" 
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