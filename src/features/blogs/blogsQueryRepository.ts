import {CreateBlogDto} from "./dto/CreateBlog.dto";
import {BlogInstance} from "../../interfaces/blogs.interface";
import {blogModel} from "../../models/blogsModel";

class BlogsQueryRepository {

    public blogs = blogModel

    async blogsSortWithQuery(query: any): Promise<BlogInstance[]> {
        const queryName = query.searchNameTerm !== null ? query.searchNameTerm : ''
        const filter = {name: {$regex: queryName, $options: "i"},}
        const sortedBlogs = await blogModel
            .find(filter)
            // .sort({query.sortBy: query.sortDirection})
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
        return sortedBlogs
    }

    async blogOutput(id: string): Promise<CreateBlogDto> {
        const blog = await this.blogs.findOne({_id: id})
        return this.blogMapOutput(blog as BlogInstance)
    }

    blogMapOutput(blog: BlogInstance): CreateBlogDto {
        const blogDto = new CreateBlogDto(blog)
        return blogDto
    }
}

export const blogsQueryRepository = new BlogsQueryRepository()
