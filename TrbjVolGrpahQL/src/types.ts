
export type User =  {
    id: string
    mail: string
    password: string
    author: boolean
}

export type Post = {
    id: string
    creator: string
    description: string
    comments: Comments[]
}

export type Comments  = {
    id: string
    creator: string
    post : Post
    comment: string
}