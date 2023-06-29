import { CarsCollection } from "../db/mongo.ts";
import { CarSchema, SellerSchema } from "../db/schema.ts";

export const Seller = {
    id: (parent: SellerSchema): string => parent._id.toString(),
    cars: async (parent: SellerSchema): Promise<CarSchema[]> => {
        try{
            const cars = await CarsCollection.find({
                _id: { $in: parent.cars }
            }).toArray()
            return cars;

        }catch(e){
            throw new Error(e)
        }
    }
}