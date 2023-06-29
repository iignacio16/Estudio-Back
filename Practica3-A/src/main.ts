import {Application, Router} from "oak";
import { addSlot } from "./resolvers/post.ts";
import { removeSlot } from "./resolvers/delete.ts";
import { doctorAppointments, getSlots, patientAppointments } from "./resolvers/get.ts";
import { bookSlot } from "./resolvers/put.ts";

const router = new Router();

router
    .get("/test", (context) =>{
        context.response.body = "Funcionandoooo"
    })
    .post("/addSlot", addSlot)
    .delete("/removeSlot", removeSlot)
    .get("/availableSlots", getSlots)
    .put("/bookSlot",bookSlot)
    .get("/doctorAppointments/:id_doctor", doctorAppointments)
    .get("/patientAppointments/:dni", patientAppointments)


const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.info("Server waiting for request on port 7777");
await app.listen({port: 7777});