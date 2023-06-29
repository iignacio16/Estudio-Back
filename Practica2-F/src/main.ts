import {Application, Router} from "oak";
import { addTransaction, addUser } from "./resolvers/post.ts";
import { getUser } from "./resolvers/get.ts";
import { deleteUser } from "./resolvers/delete.ts";


const router = new Router()

router
    .get("/test", (context) =>{
        context.response.body = "Funcionando"
    })
    .post("/addUser", addUser)
    .get("/getUser/:parametro", getUser)
    .delete("/deleteUser/:email", deleteUser)
    .post("/addTransaction", addTransaction)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});