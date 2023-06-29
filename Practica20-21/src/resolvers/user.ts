import { UserSchema } from "../db/schema.ts";

export const User = {
    id: (parent:UserSchema):string => parent._id.toString()
}