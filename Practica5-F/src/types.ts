export type User = {
    id:string
    username:string
    password:string,
    lang: string,
    createdAt: string,
}

export type Message = {
    id:string,
    sender: string,
    reciver: string,
    message:string,
    createdAt: Date
}

export type Context = {
    auth: string,
    lang: string
}