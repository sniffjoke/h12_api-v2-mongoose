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
