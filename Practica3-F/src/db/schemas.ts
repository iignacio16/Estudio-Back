import { ObjectId } from "mongo";
import { Author, Books, User } from "../types.ts";


export type UserSchema = User & {_id: ObjectId}
export type BooksSchema = Books & {_id: ObjectId}
export type AuthorSchema = Author & {_id: ObjectId}