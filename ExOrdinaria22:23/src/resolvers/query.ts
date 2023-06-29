import { CharacterSchema } from "../types.ts";


export const Query = {
 
    character: async (
        _:unknown,
        args: {id:string}
    ): Promise<CharacterSchema> => {
        try{
            const {id} = args
            const character = await fetch(`https://rickandmortyapi.com/api/character/${id}`);

            return character.json();

        }catch(e){
            throw new Error(e)
        }
    },

    charactersByIds: async(
        _:unknown,
        args: {ids: string[]}
    ): Promise<CharacterSchema[]> =>{
        try{
            const {ids} = args;
            const characters = await fetch(`https://rickandmortyapi.com/api/character/${ids.toString()}`);

            return characters.json()

        }catch(e){
            throw new Error(e)
        }
    }
    
}