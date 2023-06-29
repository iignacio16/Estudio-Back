import { RouterContext } from "oak/router.ts";
import { Transactions, User } from "../types.ts";
import { TransactionsCollection, UserCollection } from "../db/mongo.ts";
import { TransactionsSchema, UserSchema } from "../db/schemas.ts";
import { ObjectId } from "mongo";

type addUserContext = RouterContext<
"/addUser",
Record<string | number, string | undefined>,
Record<string, any>
>;

type addTransactionContext = RouterContext<
"/addTransaction",
Record<string | number, string | undefined>,
Record<string, any>
>;

const randomIBAN = (Math.floor(100000000000000000000 + Math.random() * 900000000000000000000))

const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
const dniRegex = /^\d{8}[A-Z]$/;
const phoneRegex = /^\d{9}$/

function validateUser(user: User) {
  if (!emailRegex.test(user.Email)) {
    throw new Error('Invalid email format');
  }
  if (!dniRegex.test(user.DNI)) {
    throw new Error('Invalid DNI format');
  }
  if (!phoneRegex.test(user.Telefono)) {
    throw new Error('Invalid Phone format');
  }
}

export const addUser = async (context: addUserContext) =>{
    try{
        const body = context.request.body({type: "json"});
        const value: User  = await body.value;

        if(!value.Email || !value.Nombre || !value.Apellido || !value.Telefono || !value.DNI ){
            context.response.status = 400;
            context.response.body = {
                message: "Necesitas añadir Email Nombre Apellido Telefono DNI"
            }
            return;
        }
        try{
            validateUser(value)
            const foundUser: UserSchema | undefined = await UserCollection.findOne({
                $or: [
                    {DNI: value.DNI},
                    {Telefono: value.Telefono},
                    {Email: value.Email}
                ]
            });
            const newUser: UserSchema = {
                ...value,
                IBAN: "ES04" + `${randomIBAN}`,
                _id: new ObjectId()
            }
            if(!foundUser){
                await UserCollection.insertOne(newUser)
                context.response.status = 200;
                context.response.body = newUser
            }else{
                context.response.status = 404;
                context.response.body = {
                    message: "DNI, Telefono o Email en la base de datos"
                }
            }
        }catch(e){
            context.response.body = {message: `Error al insertar el usuario: ${e.message}` }
        }
    }catch(e){
        context.response.status = 500;
        console.log(e);
    }
}

export const addTransaction = async (context: addTransactionContext) => {
    try{
        const body: Transactions  =  await context.request.body({type: "json"}).value;

        if(!body.ID_Sender || !body.ID_Reciber || !body.amount){
            context.response.status = 404;
            context.response.body = {
                message: "Missign params"
            };
            return;
        }

        const userSender : UserSchema | undefined = await UserCollection.findOne({_id: new ObjectId(body.ID_Sender)});
        const userReciber : UserSchema | undefined = await UserCollection.findOne({_id: new ObjectId(body.ID_Reciber)});

        if(!userReciber || !userSender){
            context.response.status = 404;
            context.response.body = {
                message: "No se encontraro alguna de las id especeficadas"
            }
        }else{
            const newTransaction: TransactionsSchema = {
                ...body,
                _id: new ObjectId()
            }

            await TransactionsCollection.insertOne(newTransaction);
            context.response.status = 200;
            context.response.body = newTransaction
        }

    }catch(e){
        console.log(e);
        context.response.status = 500;
    }
}