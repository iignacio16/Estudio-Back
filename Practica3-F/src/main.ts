import {Application, Router} from "oak";
import { addAuthor, addBokk, addUser } from "./resolvers/post.ts";
import { deleteUser } from "./resolvers/delete.ts";
import { updateCart } from "./resolvers/put.ts";
import { getBooks, getUser } from "./resolvers/get.ts";

const router = new Router();

router
    .get("/test", (context) =>{
        context.response.body = "Funcionandoooo"
    })
    .post("/addUser", addUser)
    .post("/addAuthor", addAuthor)
    .post("/addBook", addBokk)
    .delete("/deleteUser", deleteUser)
    .put("/updateCart", updateCart)
    .get("/getBooks", getBooks)
    .get("/getUser/:param", getUser)


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});