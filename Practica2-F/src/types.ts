export type User = {
    DNI: string,
    Nombre: string,
    Apellido: string,
    Telefono: string,
    Email:string,
}

export type Transactions = {
    ID_Sender: string,
    ID_Reciber: string,
    amount: number
}