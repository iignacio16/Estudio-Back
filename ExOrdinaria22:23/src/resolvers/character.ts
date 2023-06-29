import { EpisodeSchema, LocationSchema } from "../types.ts";
import { CharacterSchema } from "../types.ts";

export const Character = {
    origin: async (parent: CharacterSchema): Promise<LocationSchema | null> => {
        try{
            if(parent.origin && parent.origin.url !== ""){
                const origin = await fetch(parent.origin.url);
                return origin.json();
            }else{
                return null;
                
            }

          
        }catch(e){
            throw new Error(e)
        }
    },

    location: async (parent: CharacterSchema): Promise<LocationSchema | null> => {
        try{
            if(parent.location){
                const result =  await fetch(parent.location.url);
                return result.json()
            }else{
                return null;
            }
        }catch(e){
            throw new Error(e)
        }
    },

    episode: async (parent: CharacterSchema): Promise<EpisodeSchema[]> => {
        try{
            const episodes = await Promise.all(
                parent.episode.map(async (e)=>{
                    const result =  await fetch(e);
                    return result.json()
                })
            );
            return episodes;

        }catch(e){
            throw new Error(e)
        }
    }
}