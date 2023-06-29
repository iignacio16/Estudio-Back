import { bookCollection } from "../db/mongo.ts";
import { bookSchema, pressHouseSchema } from "../db/schema.ts";

export const PressHouse = {
    id: (parent: pressHouseSchema):string => parent._id.toString(),

    books: async (parent:pressHouseSchema): Promise<bookSchema[]> =>{
        try{
            const books = await bookCollection.find({
                pressHouse: parent._id
            }).toArray()

            return books;
            
        }catch(e){
            throw new Error(e)
        }
    }
}