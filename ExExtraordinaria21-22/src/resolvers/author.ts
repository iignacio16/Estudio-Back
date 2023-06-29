import { bookCollection } from "../db/mongo.ts";
import { authorSchema, bookSchema } from "../db/schema.ts";

export const Author = {
    id: (parent:authorSchema):string => parent._id.toString(),

    books: async (parent:authorSchema): Promise<bookSchema[]> => {
        try{
            const books = await bookCollection.find({
                author: parent._id
            }).toArray()

            return books;
        }catch(e){
            throw new Error(e)
        }
    }
}