import { ObjectId } from "mongo";
import { Slot } from "../types.ts";


export type slotSchema = Slot & {_id: ObjectId}