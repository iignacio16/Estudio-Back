import { authorCollection, pressHouseCollection } from "../db/mongo.ts";
import { authorSchema, bookSchema, pressHouseSchema } from "../db/schema.ts";

export const Book = {
    id: (parent:bookSchema):string => parent._id.toString(),
    author: async (parent: bookSchema): Promise<authorSchema> => {
        try{
            const author = await authorCollection.findOne({
                _id: parent.author
            })
            if(!author) throw new Error("Author not found")

            return author;

        }catch(e){
            throw new Error(e)
        }
    },
    pressHouse: async (parent:bookSchema): Promise<pressHouseSchema> => {
        try{
            const pressHouse = await pressHouseCollection.findOne({
                _id: parent.pressHouse
            })
            if(!pressHouse) throw new Error("pressHouse not found")

            return pressHouse;

        }catch(e){
            throw new Error(e)
        }
    }
}