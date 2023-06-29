import { ObjectId } from "mongo";
import {
  authorCollection,
  bookCollection,
  pressHouseCollection,
} from "../db/mongo.ts";
import { authorSchema, bookSchema, pressHouseSchema } from "../db/schema.ts";

export const Query = {
  books: async (
    _: unknown,
    __: unknown,
  ): Promise<bookSchema[]> => {
    try {
      return await bookCollection.find().toArray();
    } catch (e) {
      throw new Error(e);
    }
  },

  authors: async (
    _: unknown,
    __: unknown,
  ): Promise<authorSchema[]> => {
    try {
      return await authorCollection.find().toArray();
    } catch (e) {
      throw new Error(e);
    }
  },

  presshouses: async (
    _: unknown,
    __: unknown,
  ): Promise<pressHouseSchema[]> => {
    try {
      return await pressHouseCollection.find().toArray();
    } catch (e) {
      throw new Error(e);
    }
  },

  book: async (
    _: unknown,
    args: { id: string },
  ): Promise<bookSchema> => {
    try {
      const { id } = args;

      const book = await bookCollection.findOne({ _id: new ObjectId(id) });
      if (!book) throw new Error("Book not found");
      return book;
    } catch (e) {
      throw new Error(e);
    }
  },

  author: async (
    _: unknown,
    args: { id: string },
  ): Promise<authorSchema> => {
    try {
      const { id } = args;

      const author = await authorCollection.findOne({ _id: new ObjectId(id) });
      if (!author) throw new Error("author not found");
      return author;
    } catch (e) {
      throw new Error(e);
    }
  },

  presshouse: async (
    _: unknown,
    args: { id: string },
  ): Promise<pressHouseSchema> => {
    try {
      const { id } = args;

      const presshouse = await pressHouseCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!presshouse) throw new Error("Not press house found");
      return presshouse;
    } catch (e) {
      throw new Error(e);
    }
  },
};
