import {Application, Router} from "oak";
import { addCar } from "./resolvers/post.ts";
import { deleteCar } from "./resolvers/delete.ts";
import { getCar } from "./resolvers/get.ts";
import { askCar, releaseCar } from "./resolvers/put.ts";

const router = new Router();

router
    .get("/test", (context) =>{
        context.response.body = "Funcionando"
    })
    .post("/addCar", addCar)
    .delete("/deleteCar/:id", deleteCar)
    .get("/car/:id", getCar)
    .put("/askCar", askCar)
    .put("/releaseCar/:id", releaseCar)

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});