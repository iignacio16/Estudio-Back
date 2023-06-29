import { CharacterSchema } from "../types.ts";
import { EpisodeSchema } from "../types.ts";

export const Episode = {
    characters: async (parent: EpisodeSchema): Promise<CharacterSchema[]> => {
        try{
            const characters = await Promise.all(
                parent.characters.map(async (c)=>{
                    const result = await fetch(c)
                    return result.json()
                })
            )
            return characters;

        }catch(e){
            throw new Error(e)
        }
    }
}