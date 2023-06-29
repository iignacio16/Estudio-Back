import { EpisodeSchema } from "../types.ts";
import { LocationSchema } from "../types.ts";

export const Location = {
    residents: async (parent: LocationSchema): Promise<EpisodeSchema[]> => {
        try{
            const residents = await Promise.all(
                parent.residents.map(async (r) => {
                    const result = await fetch(r);
                    return result.json()
                })
            )
            return residents;

        }catch(e){
            throw new Error(e)
        }
    }
}