import { ObjectId } from "mongo";
import { Message, User } from "../types.ts";

export type UserSchema = Omit<User, "id" > & {
    _id: ObjectId
}

export type MessageSchema = Omit<Message, "id" | "sender" | "reciver"> & {
    _id:ObjectId,
    sender: ObjectId,
    reciver: ObjectId
}