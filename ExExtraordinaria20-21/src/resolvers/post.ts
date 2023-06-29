import { RouterContext } from "oak/router.ts";
import { ClientCollection, InvoiceCollection, ProductCollection } from "../db/mongo.ts";
import { clientSchema, invoiceSchema, productSchema } from "../db/schemas.ts";

type addClientContext = RouterContext<
"/client",
Record<string | number, string | undefined>,
Record<string, any> 
>;
type addProductContext = RouterContext<
"/product",
Record<string | number, string | undefined>,
Record<string, any> 
>;
type addInvoiceContext = RouterContext<
"/invoice",
Record<string | number, string | undefined>,
Record<string, any> 
>;

type InvocieBody = {
    clientCIF: string,
    products: Array<{sku:string, amount:number}>
}

export const addClient = async (context: addClientContext) => {
    try{
        const body = context.request.body({type: "json"})
        const value = await body.value

        if(!value.CIF || !value.name || !value.address){
            context.response.status = 400
            return;
        }

        const foundClient: clientSchema | undefined = await ClientCollection.findOne({
            CIF: value.CIF
        })
        if(foundClient){
            context.response.status = 400
            context.response.body = {
                message: "Client already exists"
            }
            return;
        }else{

            
            const newClient: Partial<clientSchema> = {
                CIF: value.CIF,
                name: value.name,
                address: value.address,
                phone: value.phone,
                mail: value.mail
            }

        await ClientCollection.insertOne(newClient as clientSchema)
        const {_id, ...ClientWithOutID} = newClient as clientSchema
        context.response.status = 200;
        context.response.body =  ClientWithOutID
        
        }
        
    }catch(e){
        context.response.status =500;
        console.log(e)
    }
}

export const addProduct = async (context: addProductContext) => {
    try{
        const body = context.request.body({type: "json"})
        const value = await body.value;

        if(!value.sku || !value.name || !value.price){
            context.response.status = 400
            return;
        }

        const foundProduct: productSchema | undefined = await ProductCollection.findOne({
            sku: value.sku
        })

        if(foundProduct){
            context.response.status = 400;
            context.response.body = {
                message: "Product already exists"
            }
        }else{
            const newProduct: Partial<productSchema> = {
                sku: value.sku,
                name: value.name,
                price: value.price
            }

            await ProductCollection.insertOne(newProduct as productSchema)

            const {_id, ...productWithOutID} = newProduct as productSchema;
            context.response.status =200;
            context.response.body = productWithOutID
        }

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}

export const addInvoice = async (context: addInvoiceContext) => {
    try{
        const body = context.request.body({type: "json"});
        const value: InvocieBody = await body.value;

        if(!value.clientCIF || !value.products){
            context.response.status = 400;
            return;
        }

        const amounts = value.products.map((p)=> p.amount)
        const skus = value.products.map((p)=> p.sku)


        const foundProducs = await ProductCollection.find({
            sku: {$in: skus}
        }).toArray()

        if(foundProducs.length !== skus.length){
            context.response.status = 404
            context.response.body = {
                message: "Product not found"
            }
            return;
        }
        if(amounts.some((a)=> a<=0)){
            context.response.status = 404
            context.response.body = {
                message: "Amount should be grater than 0"
            }
            return;
        }

        const foundClient = await ClientCollection.findOne({
            CIF: value.clientCIF
        })

        if(!foundClient){
            context.response.status = 404;
            context.response.body = {
                message: "Client not found"
            }
            return;
        }

            const newInvoice: Partial<invoiceSchema> = {
                clientCIF: foundClient.CIF,
                products: value.products
            }
        

        await InvoiceCollection.insertOne(newInvoice as invoiceSchema)
        context.response.status = 200
        context.response.body = newInvoice as invoiceSchema

    }catch(e){
        context.response.status = 500;
        console.log(e)
    }
}
