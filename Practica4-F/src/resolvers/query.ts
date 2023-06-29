import { ObjectId } from "mongo";
import {
  CarsCollection,
  DealerCollection,
  SellersCollection,
} from "../db/mongo.ts";
import { CarSchema, DealerSchema, SellerSchema } from "../db/schema.ts";

export const Query = {
  test: () => {
    return "Funcionando";
  },

  getCarByID: async (
    _: unknown,
    args: { id: string },
  ): Promise<CarSchema> => {
    try {
      const car = await CarsCollection.findOne({ _id: new ObjectId(args.id) });
      if (!car) {
        throw new Error("Car not found");
      }
      return car;
    } catch (e) {
      throw new Error(e);
    }
  },

  getCars: async (
    _: unknown,
    args: { minPrice: number; maxPrice: number },
  ): Promise<CarSchema[]> => {
    try {
      return await CarsCollection.find({
        $and: [
          {
            price: {
              $gte: args.minPrice,
            },
          },
          {
            price: {
              $lte: args.maxPrice,
            },
          },
        ],
      }).toArray();
    } catch (e) {
      throw new Error(e);
    }
  },

  getSellerByID: async (
    _: unknown,
    args: { id: string },
  ): Promise<SellerSchema> => {
    try {
      const seller = await SellersCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!seller) {
        throw new Error("Seller not found");
      }
      return seller;
    } catch (e) {
      throw new Error(e);
    }
  },

  getSellersByName: async (
    _: unknown,
    args: { name: string },
  ): Promise<SellerSchema[]> => {
    try {
      return await SellersCollection.find({ name: args.name})
        .toArray();
    } catch (e) {
      throw new Error(e);
    }
  },

  getDealerByID: async (
    _: unknown,
    args: { id: string },
  ): Promise<DealerSchema> => {
    try {
      const dealer = await DealerCollection.findOne({
        _id: new ObjectId(args.id),
      });
      if (!dealer) {
        throw new Error("Dealer not found");
      }
      return dealer;
    } catch (e) {
      throw new Error(e);
    }
  },

  getDealers: async (
    _: unknown,
    args: {page?: number },
  ): Promise<DealerSchema[]> => {
    try {
      const page = args.page || 0;
      return await DealerCollection.find()
        .limit(1)
        .skip(1 * page)
        .toArray();
    } catch (e) {
      throw new Error(e);
    }
  },
};
