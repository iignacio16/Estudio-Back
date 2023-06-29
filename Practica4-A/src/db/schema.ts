import { ObjectId } from "mongo";
import { Slots } from "../types.ts";

export type SlotsSchema = Slots & {_id: ObjectId }