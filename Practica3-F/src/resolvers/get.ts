import { getQuery } from "oak/helpers.ts";
import { RouterContext } from "oak/router.ts";
import { BooksCollection, UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";
import { ObjectId } from "mongo";

type getBooksContext = RouterContext<
"/getBooks",
Record<string | number, string | undefined>,
Record<string, any> & {
    page: number
    title?: string
}
>;

type getUserContext = RouterContext<
 "/getUser/:param",{
     param: string
 } & 
 Record<string | number, string | undefined>,
 Record<string, any>
 >;

type IParams = {
    title?: string,
    page?:number
}

export const getBooks = async (context: getBooksContext) => {
    try{
        const params: IParams = getQuery(context, {mergeParams:true})

        const page = params.page || 0;
        const title = params.title;

        if(title){
            const book = await BooksCollection.findOne({
                title: {
                    $regex: title, $options:"i"
                }
            })
            context.response.status = 200
            context.response.body = {
            "books" : book
            }
            return;
        }else{

            const books = await BooksCollection.find()
            .limit(1)
            .skip(1 * page)
            .toArray()
            
            context.response.status = 200
            context.response.body = {
                "books" : books
            }
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const getUser = async (context: getUserContext) => {
    try{
        const param = context.params.param;

        const user: UserSchema | undefined = await UserCollection.findOne({
            _id: new ObjectId(param)
        })

        if(user){
            context.response.status = 200;
            context.response.body = user
            
        }else{
            context.response.status = 404;
            context.response.body = {
                message: "Not user found"
            }
        }
    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}