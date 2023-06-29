export type Car =  {
    id:string
    plate:string
    price:number
   }

export type Seller = {
    id:string
    name:string
    dni:string
    cars?: Car[]
   }

export type Dealer = {
    id:string
    location:string
    NIF:string
    sellers?: Seller[]
   }