export type Client ={
    CIF: string,
    name: string,
    address: string
    phone?: string,
    mail?: string
}

export type Product = {
    sku: string,
    name: string,
    price: number
}

export type Invoice = {
    clientCIF: string,
    products: invoiceProducts[]
}

export type invoiceProducts = {
    sku: string,
    amount: number
}