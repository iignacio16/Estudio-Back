import { ObjectId } from "mongo";
import {
  CarsCollection,
  DealerCollection,
  SellersCollection,
} from "../db/mongo.ts";
import { CarSchema, DealerSchema, SellerSchema } from "../db/schema.ts";

export const Mutation = {
  addSeller: async (
    _: unknown,
    args: { name: string; dni: string },
  ): Promise<SellerSchema> => {
    try {
      const { name, dni } = args;
      const foundSeller = await SellersCollection.findOne({ dni: args.dni });

      if (foundSeller) {
        throw new Error("DNI already in db");
      } else {
        const _id = await SellersCollection.insertOne(args);
        return ({
          _id,
          name,
          dni,
        });
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  addCar: async (
    _: unknown,
    args: { plate: string; price: number },
  ): Promise<CarSchema> => {
    try {
      const { plate, price } = args;

      const foundCar = await CarsCollection.findOne({ plate });

      if (foundCar) {
        throw new Error("Plate already in db");
      } else {
        const _id = await CarsCollection.insertOne(args);
        return {
          _id,
          plate,
          price,
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  addDealer: async (
    _: unknown,
    args: { location: string; NIF: string },
  ): Promise<DealerSchema> => {
    try {
      const { location, NIF } = args;

      const foundDealer = await DealerCollection.findOne({ NIF });

      if (foundDealer) {
        throw new Error("NIF already in db");
      } else {
        const _id = await DealerCollection.insertOne(args);
        return {
          _id,
          location,
          NIF,
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  updateSeller: async (
    _: unknown,
    args: { plate: string; idSeller: string },
  ): Promise<SellerSchema> => {
    try {
      const foundCar = await CarsCollection.findOne({ plate: args.plate });
      const foundSeller = await SellersCollection.findOne({
        _id: new ObjectId(args.idSeller),
      });

      if (!foundCar) {
        throw new Error("Car doesnt exist in db");
      }
      if (!foundSeller) {
        throw new Error("Seller not Found");
      }

      await SellersCollection.updateOne({
        _id: foundSeller._id,
      }, {
        $addToSet: {
          cars: foundCar._id,
        },
      });

      const updateSeller = await SellersCollection.findOne({
        _id: foundSeller._id,
      });
      if (!updateSeller) {
        throw new Error("Seller updated not found");
      } else {
        return updateSeller;
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  updateDealer: async (
    _:unknown,
    args: {idSeller:string, idDealer:string}
  ):Promise<DealerSchema> =>{
    try{
      const foundSeller =  await SellersCollection.findOne({_id: new ObjectId(args.idSeller)})
      const foundDealer =  await DealerCollection.findOne({_id: new ObjectId(args.idDealer)})

      if(!foundSeller){
        throw new Error("This Seller doesnt exists")
      }
      if(!foundDealer){
        throw new Error("This Dealer doesnt exists")
      }

      await DealerCollection.updateOne({
        _id: foundDealer._id
      },
      {
        $addToSet: {
          sellers: foundSeller._id
        }
      }
      )

      const updatedDealer = await DealerCollection.findOne({_id: foundDealer._id})
      if(!updatedDealer){
        throw new Error("Erro updating Dealer")
      }else{
        return updatedDealer
      }

    }catch(e){
      throw new Error(e)
    }
  }
};
