import { ObjectId } from "mongo";
import { Car, Seller, Dealer } from "../types.ts";

export type CarSchema = Omit<Car, "id"> & {
    _id: ObjectId
}

export type SellerSchema = Omit<Seller, "id" | "cars"> & {
    _id: ObjectId
    cars?: ObjectId[]
}

export type DealerSchema = Omit<Dealer, "id" | "sellers"> & {
    _id:ObjectId
    sellers?: ObjectId[]
}