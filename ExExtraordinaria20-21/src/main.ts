import {Application, Router} from "oak";
import { getInvoicebyID, getStatus } from "./resolvers/get.ts";
import { addClient, addInvoice, addProduct } from "./resolvers/post.ts";

const router = new Router();

router
    .get("/status", getStatus)
    .post("/client", addClient)
    .post("/product", addProduct)
    .post("/invoice", addInvoice)
    .get("/invoice/:id", getInvoicebyID)


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});