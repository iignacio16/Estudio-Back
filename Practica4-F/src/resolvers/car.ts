import { CarSchema } from "../db/schema.ts";

export const Car = {
    id: (parent:CarSchema): string => parent._id.toString()
}