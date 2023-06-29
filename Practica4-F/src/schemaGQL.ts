import {gql} from "graphql_tag"

export const typeDefs = gql`
   type Car {
    id:String!
    plate:String!
    price:Int!
   }

   type Seller{
    id:String!
    dni:String!
    name:String!
    cars: [Car]
   }

   type Dealer {
    id:String!
    location:String!
    NIF:String!
    sellers: [Seller]!
   }

    type Query{
        test:String!
        getCarByID(id:String!):Car
        getCars(minPrice:Int!, maxPrice:Int!):[Car]!
        getSellerByID(id:String!):Seller
        getSellersByName(name:String!):[Seller]!
        getDealerByID(id:String!):Dealer
        getDealers(page:Int):[Dealer]!
        
    }

    type Mutation{
       addSeller(name:String!, dni:String!):Seller!
       addCar(plate:String!, price:Int!):Car!
       addDealer(location:String!, NIF:String!):Dealer!
       updateSeller(plate:String!, idSeller:String!):Seller!
       updateDealer(idSeller:String!, idDealer:String!): Dealer!
    }
    `

