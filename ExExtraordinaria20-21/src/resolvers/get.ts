import { RouterContext } from "oak/router.ts";
import { ClientCollection, InvoiceCollection, ProductCollection } from "../db/mongo.ts";
import { ObjectId } from "mongo";
import { clientSchema } from "../db/schemas.ts";

type getStatusContext = RouterContext<
"/status",
Record<string | number, string | undefined>,
Record<string, any> 
>;

type getInvoiceContext = RouterContext<
"/invoice/:id",{
    id:string
} &
Record<string | number, string | undefined>,
Record<string, any> 
>;

type productJSON = {
    sku: string,
    name:string,
    amount: number,
    totalPrice: number
}
export const getStatus = (context:getStatusContext)=>{
    try{
        context.response.status=200
        context.response.body= {
            message: "Todo ok"
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const getInvoicebyID = async (context: getInvoiceContext)=> {
    try{
        const id = context.params.id;

        const foundInvoice = await InvoiceCollection.findOne({
            _id: new ObjectId(id)
        })

        if(!foundInvoice){
            context.response.status = 404;
            context.response.body = {
                message: "Invoice not found"
            }
            return;
        }

        const foundClient = await ClientCollection.findOne({
            CIF: foundInvoice.clientCIF
        })

        const products: productJSON[]= []

        const skus = foundInvoice.products.map((s)=> s.sku);

        await Promise.all( skus.map(async (s, i)=>{
            const product = await ProductCollection.findOne({
                sku: s
            });
            if(!product) throw new Error("product not found")
            const amount= foundInvoice.products.at(i)!.amount
            const newProduct: productJSON = {
                sku: product.sku,
                name: product.name,
                amount: amount,
                totalPrice: (amount * product.price)
            }
            products.push(newProduct)
        })
        )

        const totalPrice = products.reduce((total, product)=>{
            return total + product.totalPrice
        }, 0)

        const {_id, ...ClientWithOutID} = foundClient as clientSchema

        context.response.status=200;
        context.response.body = {
            "client": ClientWithOutID,
            "products": products,
            "totalPrice": totalPrice
        }

    }catch(e){
        context.response.status = 500
        console.log(e)
    }
}