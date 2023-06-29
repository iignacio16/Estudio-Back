import { ObjectId } from "mongo";
import { CommentsCollection, PostsCollection, UserCollection } from "../db/mongo.ts";
import { Rol } from "../types.ts";
import { CommentSchema, PostSchema, UserSchema } from "../db/schema.ts";

export const Mutation = {
  createUser: async (
    _:unknown,
    args: {idAdmin:string, username:string, rol: Rol[]}
  ): Promise<UserSchema> => {
    try{
      const {idAdmin, username, rol} = args;

      const foundAdmin = await UserCollection.findOne({
        _id: new ObjectId(idAdmin)
      })
      if(!foundAdmin) throw new Error("User not found")
      
      if(!foundAdmin.rol.some((r)=> r === "ADMIN")) throw new Error("Only admin can add users");

      const _id = await UserCollection.insertOne({
        username,
        rol
      })

      return {
        _id,
        username,
        rol
      }
    }catch(e){
      throw new Error(e)
    }
  },

  deleteUser: async (
    _:unknown,
    args: {idAdmin: string, idUser:string}
  ): Promise<UserSchema>=> {
    try{
      const {idAdmin, idUser} = args;

      const foundAdmin = await UserCollection.findOne({
        _id: new ObjectId(idAdmin)
      })
      
      if(!foundAdmin) throw new Error("Admin not found")
      if(!foundAdmin.rol.some((r)=> r === "ADMIN")) throw new Error("Only admin can delete users");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(idUser)
      })

      if(!foundUser) throw new Error("User to delete not found")
      await UserCollection.deleteOne(foundUser)
      return foundUser

    }catch(e){
      throw new Error(e)
    }
  },

  createPost: async (
    _:unknown,
    args: {idCreator: string, title: string, post: string}
  ): Promise<PostSchema> => {
    try{
      const {idCreator, title, post} = args;

      const foundAuthor = await UserCollection.findOne({
        _id: new ObjectId(idCreator)
      })

      if(!foundAuthor) throw new Error("Not Author found")

      if(!foundAuthor.rol.some((r) => r === "AUTHOR")) throw new Error("Only AUTHOR can create pots")

      const _id = await PostsCollection.insertOne({
        title,
        post,
        author: foundAuthor._id,

      })

      return {
        _id,
        title,
        post,
        author: foundAuthor._id,
  
      }

    }catch(e){
      throw new Error(e)
    }
  },

  deletePost: async (
    _:unknown,
    args: {idUser: string, idPost: string}
  ): Promise<PostSchema> => {
    try{
      const {idUser, idPost} = args;

      const foundAuthor = await UserCollection.findOne({
        _id: new ObjectId(idUser)
      })
      if(!foundAuthor) throw new Error("not user found");

      //if(!foundAuthor.rol.some((r)=> r === "AUTHOR" || "EDITOR")) throw new Error("Only Author and Editor can delete post")

      const foundPost = await PostsCollection.findOne({
        _id:  new ObjectId(idPost)
      })

      if(!foundPost) throw new Error("Post not found")

      if(foundAuthor.rol.some((r)=> r === "EDITOR")){
        await PostsCollection.deleteOne(foundPost);
        return foundPost
      }else if(foundAuthor.rol.some((r)=> r === "AUTHOR")){
        if(foundAuthor._id.toString() !== foundPost.author.toString()) throw new Error("Author not allowed to delete others posts")
        await PostsCollection.deleteOne(foundPost);
        return foundPost;
      }else{
        throw new Error("Only Author or Editor can delete pots")
      }

    }catch(e){
      throw new Error(e)
    }
  },

  addComment: async (
    _:unknown,
    args: {idUser:string, idPost: string, text:string}
  ): Promise<CommentSchema> =>{
    try{
      const {idUser, idPost, text} = args;

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(idUser)
      })
      if(!foundUser) throw new Error ("user not found")

      if(!foundUser.rol.some((r)=> r === "USER")) throw new Error("Only USER can create comments")

      const foundPost = await PostsCollection.findOne({
        _id: new ObjectId(idPost)
      })
      if(!foundPost) throw new Error("Post not found");

      const _id = await CommentsCollection.insertOne({
        text,
        author: foundUser._id
      })

      await PostsCollection.updateOne(
        {
          _id: foundPost._id
        },
        {
          $addToSet:{
             comments: _id
          }
        }
      )

      return {
        _id,
        text,
        author: foundUser._id
      }

    }catch(e){
      throw new Error(e)
    }
  },

  deleteComment: async (
    _:unknown,
    args: {idUser: string, idComment:string}
  ): Promise<CommentSchema> => {
    try{
      const {idUser, idComment} = args;

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(idUser)
      })
      if(!foundUser) throw new Error("Not user found")

      const foundComment = await CommentsCollection.findOne({
        _id: new ObjectId(idComment)
      })
      if(!foundComment) throw new Error("Not comment found");

      if(foundUser.rol.some((r)=> r === "EDITOR")){
        await CommentsCollection.deleteOne(foundComment)
        await PostsCollection.updateOne(
          { comments: foundComment._id},
          { $pull: { comments: foundComment._id } }
        );
  
        return foundComment;


      }else if(foundUser.rol.some((r)=>r === "USER")) {
        if(foundUser._id.toString() !== foundComment.author.toString()) throw new Error("USER only can delete own comments")
          await CommentsCollection.deleteOne(foundComment)
          await PostsCollection.updateOne(
            { comments: foundComment._id},
            { $pull: { comments: foundComment._id } }
          );
          return foundComment;
    
      }else{
        throw new Error("Only USER or EDITOR can delete Comments")
      }
    }catch(e){
      throw new Error(e)
    }
  }
}