// import {postCollection} from "../db/mongo-db";
// import {DeleteResult, ObjectId, UpdateResult, WithId} from "mongodb";
// import {PostDBType} from "../dtos/posts.dto";
// import {Post} from "../types/posts.interface";
//
//
// export const postsRepository = {
//
//     async findPostById(id: ObjectId) {
//         return await postCollection.findOne({_id: id})
//     },
//
//     async createPost(postData: Post): Promise<ObjectId> {
//         const post = {
//             title: postData.title,
//             shortDescription: postData.shortDescription,
//             content: postData.content,
//             blogName: postData.blogName,
//             blogId: postData.blogId,
//             createdAt: new Date(Date.now()).toISOString()
//         }
//         const newPost = await postCollection.insertOne(post as WithId<Post>)
//         return newPost.insertedId
//     },
//
//     async updatePostById(id: string, post: PostDBType): Promise<UpdateResult> {
//         const findedPost = await postCollection.findOne({_id: new ObjectId(id)})
//         const updates = {
//             $set: {
//                 title: post.title,
//                 shortDescription: post.shortDescription,
//                 content: post.content,
//             }
//         }
//         const updatedPost = await postCollection.updateOne({_id: findedPost?._id}, updates)
//         return updatedPost
//     },
//
//     async postDelete(postId: ObjectId): Promise<DeleteResult> {
//         return await postCollection.deleteOne({_id: postId})
//     }
//
// }

import {PostInstance} from "../../interfaces/posts.interface";
import {postModel} from "../../models/postsModel";
import {IPost} from "../../types/IPost";
import {UpdateWriteOpResult} from "mongoose";
import {UpdatePostDto} from "./dto/UpdatePost.dto";
import {BlogInstance} from "../../interfaces/blogs.interface";
import {blogModel} from "../../models/blogsModel";

class PostsRepository {

    public posts = postModel
    public blogs = blogModel

    async getAllPosts(): Promise<PostInstance[]> {
        const posts = await this.posts.find()
        return posts
    }

    async createPost(postData: IPost): Promise<PostInstance> {
        const blog: BlogInstance | null = await this.blogs.findById(postData.blogId)
        const post = new this.posts({...postData, blogName: blog?.name})
        await post.save()
        return post
    }

    async createPostByBlogId(postData: Omit<IPost, 'blogId'>, blogId: string): Promise<PostInstance> {
        const blog: BlogInstance | null = await this.blogs.findById(blogId)
        const post = new this.posts({...postData, blogId: blog?._id, blogName: blog?.name})
        await post.save()
        return post
    }

    public async findPostById(id: string): Promise<PostInstance | null> {
        const post = await this.posts.findById(id)
        return post
    }

    async updatePostById(id: string, post: IPost): Promise<UpdateWriteOpResult> {
        const findedPost = await this.posts.findById(id)
        const updateDataPostDto = new UpdatePostDto(post)
        const updatePost = await this.posts.updateOne({_id: findedPost?._id}, {$set: {...updateDataPostDto}})
        return updatePost
    }

    async deletePostById(id: string) {
        const post = await this.posts.findByIdAndDelete(id)
        return post
    }
}

export const postsRepository = new PostsRepository()
