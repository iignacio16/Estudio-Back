import { SellersCollection } from "../db/mongo.ts";
import { DealerSchema, SellerSchema } from "../db/schema.ts";

export const Dealer = {
    id: (parent: DealerSchema): string => parent._id.toString(),
    sellers: async (parent: DealerSchema): Promise<SellerSchema[]> => {
        try{
            return await SellersCollection.find({
                _id: {$in: parent.sellers}
            }).toArray()

        }catch(e){
            throw new Error(e)
        }
    }
}