import { ObjectId } from "mongo";
import { Author, Book, PressHouse } from "../types.ts";

export type pressHouseSchema = Omit<PressHouse, "id" | "books"> & {
    _id: ObjectId
}

export type authorSchema = Omit<Author, "id" | "books"> & {
    _id: ObjectId
}

export type bookSchema = Omit<Book, "id" | "author" | "pressHouse"> & {
    _id: ObjectId,
    author: ObjectId,
    pressHouse: ObjectId
}