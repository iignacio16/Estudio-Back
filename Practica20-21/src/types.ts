export enum Rol{
    ADMIN = "ADMIN",
    AUTHOR = "AUTHOR",
    EDITOR = "EDITOR",
    USER = "USER"
}

export type User = {
    id: string
    username: string
    rol: Rol[]
}

export type Post = {
    id: string
    title: string
    post: string
    author: User
    comments: Comment[]
}

export type Comment = {
    id: string
    text: string
    author: User
}