import { ObjectId } from "mongo";
import { Client, Invoice, Product } from "../types.ts";

export type clientSchema = Client & {_id: ObjectId}
export type productSchema = Product & {_id: ObjectId}
export type invoiceSchema = Invoice & {_id: ObjectId}