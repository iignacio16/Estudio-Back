import { RouterContext } from "oak/router.ts";
import { UserSchema } from "../db/schemas.ts";
import { UserCollection } from "../db/mongo.ts";
import { ObjectId } from "mongo";

type GetUserContext = RouterContext<
"/getUser/:parametro",{
    parametro: string
} & 
Record<string | number, string | undefined>,
Record<string, any>
>;

export const getUser = async (context: GetUserContext) => {
    try{
        const parametro = context.params?.parametro;

        if(parametro){ 
            let searchQuery: any;
      
            if (parametro.startsWith("ES")) {
              // Buscar por IBAN
              searchQuery = { IBAN: parametro };
            } else if (/^\d{9}$/.test(parametro)) {
              // Buscar por teléfono
              searchQuery = { Telefono: parametro };
            } else if (/^\d{8}[A-Z]$/.test(parametro)) {
              // Buscar por DNI
              searchQuery = { DNI: parametro };
            } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parametro)){
                searchQuery = {Email: parametro}
            }else {
              // Buscar por email o ID
              searchQuery = {
                $or: [
                  { Email: parametro },
                  { _id: new ObjectId(parametro) },
                ],
              };
            }
      
            const usuario: UserSchema | undefined = await UserCollection.findOne(searchQuery);
            if(usuario){
                const {_id, ...usuarioSinId} = usuario as UserSchema;
            
                context.response.status = 200;
                context.response.body = {...usuarioSinId, _id: _id.toString()};
                return;
            }else{
                
                context.response.status = 404;
                context.response.body = {
                    message: "No existe el usuario"
                }
                return;
            }
        }
        context.response.status= 404,
        context.response.body = {message: "Necesitas especificar un parametro"}
        return;
        
    }catch(e){
        console.log(e);
        context.response.status = 500;
        context.response.body = {message: `Error: ${e.error}`}
    }
}