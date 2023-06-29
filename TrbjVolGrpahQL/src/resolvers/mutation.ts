import {
  CommentsCollection,
  PostsCollection,
  UserCollection,
} from "../db/mongo.ts";
import { CommentsSchema, PostSchema, UserSchema } from "../db/schema.ts";
import * as bcrypt from "bcrypt";
import { verifyJWT } from "../lib/jwt.ts";
import { User } from "../types.ts";
import { ObjectId } from "mongo";

export const Mutation = {
  createUser: async (
    _: unknown,
    args: { mail: string; password: string; author: boolean },
  ): Promise<UserSchema> => {
    try {
      const { mail, password, author } = args;

      const foundUser = await UserCollection.findOne({ mail });
      if (foundUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password);

      const _id = await UserCollection.insertOne({
        mail,
        password: hashedPassword,
        author,
      });

      return {
        _id,
        mail,
        password: hashedPassword,
        author,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
  createPost: async (
    _: unknown,
    args: { token: string; description: string },
  ): Promise<PostSchema> => {
    try {
      const { token, description } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!foundUser) throw new Error("Not user found");

      if (!foundUser.author) throw new Error("Only author can create Post");

      const _id = await PostsCollection.insertOne({
        creator: foundUser._id,
        description,
      });

      return {
        _id,
        creator: foundUser._id,
        description,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  deletePost: async (
    _: unknown,
    args: { token: string; idpost: string },
  ): Promise<PostSchema> => {
    try {
      const { token, idpost } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!foundUser) throw new Error("Not user found");
      if (!foundUser.author) throw new Error("Only author can delete Post");

      const foundPost = await PostsCollection.findOne({
        _id: new ObjectId(idpost),
      });
      if (!foundPost) throw new Error("Not post found");

      if (foundUser._id.toString() != foundPost.creator.toString()) {
        throw new Error("Can only delete your post");
      }

      await PostsCollection.deleteOne({ _id: foundPost._id });
      return foundPost;
    } catch (e) {
      throw new Error(e);
    }
  },

  updatePost: async (
    _: unknown,
    args: { token: string; description: string; idpost: string },
  ): Promise<PostSchema> => {
    try {
      const { token, description, idpost } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!foundUser) throw new Error("Not user found");
      if (!foundUser.author) throw new Error("Only author can update Post");

      const foundPost = await PostsCollection.findOne({
        _id: new ObjectId(idpost),
      });
      if (!foundPost) throw new Error("Not post found");

      if (foundUser._id.toString() != foundPost.creator.toString()) {
        throw new Error("Can not update a post not created by you");
      }

      const post = await PostsCollection.updateOne(
        { _id: foundPost._id },
        {
          $set: {
            description: description,
          },
        },
      );

      if (post.matchedCount === 0) throw new Error("post not updated");

      return (await PostsCollection.findOne({
        _id: foundPost._id,
      }) as PostSchema);
    } catch (e) {
      throw new Error(e);
    }
  },

  createComment: async (
    _: unknown,
    args: { token: string; idpost: string; comment: string },
  ): Promise<CommentsSchema> => {
    try {
      const { token, idpost, comment } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!foundUser) throw new Error("Not user found");

      const foundPost = await PostsCollection.findOne({
        _id: new ObjectId(idpost),
      });

      if (!foundPost) throw new Error("Post not found");

      const _id = await CommentsCollection.insertOne({
        post: foundPost._id,
        creator: foundUser._id,
        comment,
      });

      return {
        _id,
        post: foundPost._id,
        creator: foundUser._id,
        comment,
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  deleteComment: async (
    _: unknown,
    args: { token: string; idComment: string },
  ): Promise<CommentsSchema> => {
    try {
      const { token, idComment } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!foundUser) throw new Error("Not user found");
      if (!foundUser.author) throw new Error("Only author can delete Comments");

      const foundComment = await CommentsCollection.findOne({
        _id: new ObjectId(idComment),
      });
      if (!foundComment) throw new Error("Not comment found");

      const post = await PostsCollection.findOne({
        _id: foundComment.post,
      });

      if (foundComment.creator.toString() === foundUser._id.toString()) {
        await CommentsCollection.deleteOne({ _id: foundComment._id });
        return foundComment;
      }

      if (foundUser._id.toString() != post?.creator.toString()) {
        throw new Error("Can not delelete this Comment");
      }

      await CommentsCollection.deleteOne({ _id: foundComment._id });
      return foundComment;
    } catch (e) {
      throw new Error(e);
    }
  },

  updateComment: async (
    _: unknown,
    args: { token: string; idComment: string; comment: string },
  ): Promise<CommentsSchema> => {
    try {
      const { token, idComment, comment } = args;

      const { id } = await verifyJWT(
        token,
        Deno.env.get("JWT_SECRET") || "",
      ) as Omit<User, "password">;

      if (!id) throw new Error("Invalid token");

      const foundUser = await UserCollection.findOne({
        _id: new ObjectId(id),
      });

      if (!foundUser) throw new Error("Not user found");
      if (!foundUser.author) throw new Error("Only author can update Comments");

      const foundComment = await CommentsCollection.findOne({
        _id: new ObjectId(idComment),
      });
      if (!foundComment) throw new Error("Not comment found");

      if (foundUser._id.toString() != foundComment.creator.toString()) {
        throw new Error("Can only update your comments");
      }

      const commentUpdated = await CommentsCollection.updateOne(
        {
          _id: foundComment._id,
        },
        {
          $set: {
            comment: comment,
          },
        },
      );

      if (commentUpdated.matchedCount === 0) {
        throw new Error("Comment not update");
      }

      return (await CommentsCollection.findOne({
        _id: new ObjectId(idComment),
      })) as CommentsSchema;
    } catch (e) {
      throw new Error(e);
    }
  },
};
