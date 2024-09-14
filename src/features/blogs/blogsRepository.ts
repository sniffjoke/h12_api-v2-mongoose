import {blogModel} from "../../models/blogsModel";
import {IBlog} from "../../types/IBlog";
import {BlogInstance} from "../../interfaces/blogs.interface";
import {UpdateBlogDto} from "./dto/UpdateBlog.dto";
import { UpdateWriteOpResult} from "mongoose";

class BlogsRepository {

    public blogs = blogModel

    public async createBlog(blogData: IBlog): Promise<BlogInstance> {
        const blog = new this.blogs(blogData)
        await blog.save() // createOrUpdate
        return blog
    }

    public async findBlogById(id: string): Promise<BlogInstance | null> {
        const blog = await this.blogs.findOne({_id: id})
        return blog
    }

    async updateBlogById(id: string, blog: IBlog): Promise<UpdateWriteOpResult> {
        const findedBlog = await this.findBlogById(id)
        const updateDataBlogDto = new UpdateBlogDto(blog)
        const updatedBlog = await this.blogs.updateOne({_id: findedBlog?._id}, {$set: {...updateDataBlogDto}})
        return updatedBlog
    }

    async deleteBlog(id: string) {
        const blog = await this.blogs.findByIdAndDelete(id)
        return blog
    }
}

export const blogsRepository = new BlogsRepository()














