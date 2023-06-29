export type PressHouse = {
    id: string
    name: string
    web:string
    country: string
    books: Book[]
}

export type Author = {
    id: string
    name:string
    lang: string
    books: Book[]
}

export type Book = {
    id:string
    title:string
    author: Author
    pressHouse: PressHouse
    year: number
}