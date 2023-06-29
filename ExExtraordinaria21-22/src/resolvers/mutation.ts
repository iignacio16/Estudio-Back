import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";
import {
  authorCollection,
  bookCollection,
  pressHouseCollection,
} from "../db/mongo.ts";
import { authorSchema, bookSchema, pressHouseSchema } from "../db/schema.ts";

export const Mutation = {
  addPressHouse: async (
    _: unknown,
    args: { name: string; web: string; country: string },
  ): Promise<pressHouseSchema> => {
    try {
      const { name, web, country } = args;

      const foundPressHouse = await pressHouseCollection.findOne({
        name,
      });
      if (foundPressHouse) throw new Error("Press House already exists");

      const _id = await pressHouseCollection.insertOne({
        name,
        web,
        country,
      });

      return {
        _id,
        name,
        web,
        country,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  addAuthor: async (
    _: unknown,
    args: { name: string; lang: string },
  ): Promise<authorSchema> => {
    try {
      const { name, lang } = args;

      const _id = await authorCollection.insertOne({
        name,
        lang,
      });

      return {
        _id,
        name,
        lang,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  addBook: async (
    _: unknown,
    args: {
      title: string;
      idAuthor: string;
      idPresshouse: string;
      year: number;
    },
  ): Promise<bookSchema> => {
    try {
      const { title, idAuthor, idPresshouse, year } = args;

      const foundBook = await bookCollection.findOne({ title });

      if (foundBook) throw new Error("Book already exists");

      const author = await authorCollection.findOne({
        _id: new ObjectId(idAuthor),
      });
      if (!author) throw new Error("author not found");
      const pressHouse = await pressHouseCollection.findOne({
        _id: new ObjectId(idPresshouse),
      });
      if (!pressHouse) throw new Error("press house not found");

      const _id = await bookCollection.insertOne({
        title,
        author: author._id,
        pressHouse: pressHouse._id,
        year,
      });
      return {
        _id,
        title,
        author: author._id,
        pressHouse: pressHouse._id,
        year,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  deletePressHouse: async (
    _:unknown,
    args: {id:string}
  ): Promise<pressHouseSchema> => {
    try{

      const {id} = args

      const foundPressHouse = await pressHouseCollection.findOne({_id: new ObjectId(id)});

      if(!foundPressHouse) throw new Error("Not pressHouse found");

      await pressHouseCollection.deleteOne({_id: new ObjectId(id)})

      await bookCollection.deleteMany({ pressHouse: foundPressHouse._id})

      return foundPressHouse;

    }catch(e){
      throw new Error(e)
    }
  },

  deleteAuthor: async (
    _:unknown,
    args: {id:string}
  ): Promise<authorSchema> => {
    try{
      const {id} = args;

      const foundAuthor = await authorCollection.findOne({_id: new ObjectId(id)})
      if(!foundAuthor) throw new Error("Author not found")

      await authorCollection.deleteOne({_id: foundAuthor._id});

      await bookCollection.deleteMany({
        author: foundAuthor._id
      }) 

      return foundAuthor

    }catch(e){
      throw new Error(e)
    }
  },

  deleteBook: async (
    _:unknown,
    args: {id: string}
  ): Promise<bookSchema> => {
    try{
      const {id} = args;

      const foundBook = await bookCollection.findOne({_id: new ObjectId(id)})
      if(!foundBook) throw new Error("Not book found")

      await bookCollection.deleteOne({
        _id: foundBook._id
      })
      return foundBook;

    }catch(e){
      throw new Error(e)
    }
  }
};
