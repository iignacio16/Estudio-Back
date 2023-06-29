import { ObjectId } from "mongo";
import { Comments, Post, User } from "../types.ts";

export type UserSchema = Omit<User, "id"> & {
    _id: ObjectId
}

export type PostSchema = Omit<Post, "id" | "creator" | "comments"> & {
    _id: ObjectId,
    creator: ObjectId,
}

export type CommentsSchema = Omit<Comments, "id" | "post" | "creator"> & {
    _id: ObjectId,
    post: ObjectId
    creator: ObjectId
}