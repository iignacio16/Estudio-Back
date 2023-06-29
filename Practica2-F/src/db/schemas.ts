import { ObjectId } from "mongo";
import { Transactions, User } from "../types.ts";

export type UserSchema = User & {IBAN: string, _id:ObjectId}

export type TransactionsSchema = Transactions  & {_id:ObjectId}