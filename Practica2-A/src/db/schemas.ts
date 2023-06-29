import { ObjectId } from "mongo";
import { Coche } from "../types.ts";

export type CocheSchema = Coche & {_id: ObjectId}