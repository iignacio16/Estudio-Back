import { RouterContext } from "oak/router.ts";
import { BooksSchema, UserSchema } from "../db/schemas.ts";
import { BooksCollection, UserCollection } from "../db/mongo.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.2.5/src/objectid.ts";

type UpdateCartContext = RouterContext<
"/updateCart",
Record<string | number, string | undefined>,
Record<string, any>
>;

type BodyUpdateCArt = {
    id_book: string,
    id_user: string
}

export const updateCart = async (context: UpdateCartContext) => {
try{

    const body = context.request.body({type: "json"});
    const value: BodyUpdateCArt = await body.value;

    if(!value.id_book || !value.id_user){
        context.response.status= 400;
        return;
    }

    const isBook: BooksSchema | undefined = await BooksCollection.findOne({
        _id: new ObjectId(value.id_book)
    })

    const isUser: UserSchema | undefined = await UserCollection.findOne({
        _id: new ObjectId(value.id_user)
    })

    if(!isBook || !isUser){
        context.response.status = 409;
        context.response.body = {
            message: "Book or User doesnt exist in db"
        }

    }else{
        const updateResult =
        await UserCollection.updateOne(
          { _id: new ObjectId(value.id_user) },
          { $addToSet: { cart: isBook._id.toString() } }
        );

      if (updateResult && updateResult.modifiedCount === 1) {
        context.response.body = {
          message: "Cart updated successfully",
        };
        context.response.status = 200;
      } else {
        context.response.status = 500;
        context.response.body = {
          message: "Failed to update cart",
        };
      }
    }
}catch(e){
    context.response.status = 500;
    console.log(e)
}

}