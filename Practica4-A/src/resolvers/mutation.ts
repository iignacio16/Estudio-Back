import { SlotsCollection } from "../db/mongo.ts";
import { SlotsSchema } from "../db/schema.ts";
import { Slots } from "../types.ts";

const isValidDay = (day: number): boolean => {
  if (day >= 1 && day <= 31) {
    return true;
  } else {
    throw new Error("El dia debe ser un nunero entre 1 y 31");
  }
};

const isValidMonth = (month: number): boolean => {
  if (month >= 1 && month <= 12) {
    return true;
  } else {
    throw new Error("El mes debe ser un nunero entre 1 y 12");
  }
};
const isValidHour = (hour: number): boolean => {
  if (hour >= 0 && hour <= 23) {
    return true;
  } else {
    throw new Error("La hora debe ser un nunero entre 0 y 23");
  }
};
const isValidYear = (year: number): boolean => {
  if (year >= 2023) {
    return true;
  } else {
    throw new Error("No puedes añadir una cita antes a 2023");
  }
};

const expReg = /^[0-9]{8}[A-Z]{1}$/;
const isValidDNI = (dni: string):boolean => {
    if(!expReg.test(dni)){
        throw new Error("DNI not valid")
    }else{
        return true;
    }
}
export const Mutation = {
  addSlot: async (
    _: unknown,
    args: { day: number, month: number, year: number, hour: number },
  ): Promise<Slots> => {
    try {
        isValidDay(args.day)
        isValidMonth(args.month) 
        isValidHour(args.hour)
        isValidYear(args.year)

      const foundSlot = await SlotsCollection.findOne(args);

      if (foundSlot) {
        if (foundSlot.avaiable) {
          const { _id, ...slotWithOutID } = foundSlot as SlotsSchema;
          return slotWithOutID;
        } else {
          throw new Error("Slots already exists in db");
        }
      } else {
        const newSlot: Partial<Slots> = {
          ...args,
          avaiable: true,
        };
        await SlotsCollection.insertOne(newSlot as SlotsSchema);
        const insertedSlot = await SlotsCollection.findOne(args)
        if(insertedSlot){
          return insertedSlot
        }else{
          throw new Error("No se encontro la cita insertada")
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  removeSlot: async (
    _: unknown,
    args: { day: number, month: number, year: number, hour: number },
  ): Promise<Slots> => {
    try {
        isValidDay(args.day);
        isValidMonth(args.month);
        isValidYear(args.year);
        isValidHour(args.hour);

        const foundSlot = await SlotsCollection.findOne(args);

        if(foundSlot){
            if(foundSlot.avaiable){
                await SlotsCollection.deleteOne(args);
                return foundSlot;
            }else{
                throw new Error ("La cita esta ocupada")
            }
        }else{
            throw new Error("No existe esa cita")
        }
    } catch (e) {
      throw new Error(e);
    }
  },

  bookSlot: async (
    _:unknown,
    args: {day: number, month: number, year: number, hour: number, dni:string},
  ): Promise<Slots> => {
    try{
        isValidDay(args.day);
        isValidMonth(args.month);
        isValidYear(args.year);
        isValidHour(args.hour);
        isValidDNI(args.dni);

        const foundSlot = await SlotsCollection.findOne({
            day: args.day,
            month: args.month,
            year: args.year,
            hour: args.hour
        })

        if(foundSlot){
            if(foundSlot.avaiable){
                const newSlot = await SlotsCollection.updateOne(
                    {_id: foundSlot._id},
                    {
                        $set:{
                            avaiable:false,
                            dni: args.dni
                        }
                    }
                    )
                    const updatedSlot = await SlotsCollection.findOne({ _id: foundSlot._id });
                    if (updatedSlot) {
                      return updatedSlot;
                    } else {
                      throw new Error("Error al obtener la cita actualizada");
                    }
    
            }else{
                throw new Error("La cita esta ocupada")
            }
        }else{
            throw new Error("No existe una cita en esa fecha")
        }
        
    } catch (e) {
        throw new Error(e);
      }
  }
};
