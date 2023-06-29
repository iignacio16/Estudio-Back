import {Application, Router} from "oak";
import { getFreeSeats, getStatus } from "./resolvers/get.ts";
import { bookSeat } from "./resolvers/post.ts";
import { free } from "./resolvers/delete.ts";


const router = new Router();

router
    .get("/status", getStatus)
    .get("/freeseats", getFreeSeats)
    .post("/book", bookSeat)
    .delete("/free", free)


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});