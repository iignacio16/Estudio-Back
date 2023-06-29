import { HttpError } from "oak/deps.ts";
import { RouterContext } from "oak/router.ts";
import * as bcrypt from "bcrypt";
import {v4}from "uuid"
import { AuthorSchema, BooksSchema, UserSchema } from "../db/schemas.ts";
import { AuthorsCollection, BooksCollection, UserCollection } from "../db/mongo.ts";
import { Author, Books, User } from "../types.ts";

type AddUserContext = RouterContext<
  "/addUser",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type AddAuthorContext = RouterContext<
  "/addAuthor",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

type AddBookContext = RouterContext<
"/addBook",
Record<string | number, string | undefined>,
Record<string, any>
>;

type IBody = {
    name: string,
    email:string,
    password:string
}

type AuthorBody = {
    name:string
}

type BookBody = {
    title: string,
    author: string,
    pages: number
}

const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
function validateEmail(email:string) {
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
}

export const addUser = async(context:AddUserContext) => {
    try{
    
        const body = context.request.body({type: "json"});
        const value: IBody = await body.value

        if(!value.email || !value.name || !value.password){
            context.response.status = 400;
            return;
        }

        validateEmail(value.email);
        const hashedPassword = await bcrypt.hashSync(value.password);

        const user: UserSchema | undefined = await UserCollection.findOne({
            name:value.name,
            email: value.email
        })

        const newUser: Partial<User> = {
            name: value.name,
            email: value.email,
            password: hashedPassword,
            createdAt: new Date()
        }

        if(!user){
            await UserCollection.insertOne(newUser as UserSchema)
            context.response.body = newUser as UserSchema;
            context.response.status = 200;
        }else{
            context.response.status = 404;
            context.response.body = {
                message: "El usuario ya esta en la base de datos"
            }
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const addAuthor = async (context: AddAuthorContext) => {
    try{
        
        const body = context.request.body({type: "json"});
        const value: AuthorBody = await body.value

        if(!value.name){
            context.response.status = 400;
            return;
        }

        const newAuthor: Partial<Author> = {
            name: value.name
        }

        const author: AuthorSchema | undefined = await AuthorsCollection.findOne({name: value.name});

        if(!author){
            await AuthorsCollection.insertOne(newAuthor as AuthorSchema);
            const {_id, ...AuthorWithoutID} = newAuthor as AuthorSchema;
            context.response.status = 200;
            context.response.body = AuthorWithoutID;
        }else{
            context.response.status = 400;
            context.response.body = {
                message: "Author already in db"
            }
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const addBokk = async (context: AddBookContext) => {
    try{
        const body = context.request.body({type: "json"});
        const value: BookBody = await body.value

        if(!value.title ||!value.author || !value.pages) {
            context.response.status = 400;
            return;
        }

        const book: BooksSchema | undefined = await BooksCollection.findOne({
            title: value.title, author: value.author, pages: value.pages});

        const author: AuthorSchema | undefined = await AuthorsCollection.findOne({
            name: {
                "$regex": value.author, "$options": "i"
            }
        })

        const newISBN = crypto.randomUUID();

        const isValidISBN = v4.validate(newISBN);

        const newBook: Partial<Books> = {
            title: value.title,
            pages: value.pages,
            author: value.author,
            ISBN: newISBN
        }

        if(book){
            context.response.status = 404;
            context.response.body = {
                message: "Book already in db"
            }  
            return;
        }

        if(isValidISBN){
            const insertBook = await BooksCollection.insertOne(newBook as BooksSchema);
            const insertedID = insertBook.toString()
            context.response.status = 200;
            const {_id, ...BookWithOutID} = newBook as BooksSchema
            context.response.body = BookWithOutID
            
        if(!author){
            const newAuthor: Author = {
                name: value.author,
                books: [insertedID]
            }
            await AuthorsCollection.insertOne(newAuthor as AuthorSchema)
        }else{
            await AuthorsCollection.updateOne({
                _id: author._id
            },
            {
                $addToSet: {
                    books: insertedID
                }
            })
        }
    }
         
    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}