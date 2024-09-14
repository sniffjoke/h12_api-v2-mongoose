import {Request, Response} from 'express';
import {blogsRepository} from "./blogsRepository";
import {IBlog} from "../../types/IBlog";
import {blogsQueryRepository} from "./blogsQueryRepository";
import {findBlogsHelper} from "../../helpers/blogsHelper";
import {CreateItemsWithQueryDto} from "./dto/CreateDataWithQuery.dto";
import {BlogInstance} from "../../interfaces/blogs.interface";


class BlogsController {

    async getBLogsWithParams(req: Request, res: Response) {
        try {
            const blogsQuery = await findBlogsHelper(req.query)
            const sortedBlogs = await blogsQueryRepository.blogsSortWithQuery(blogsQuery)
            const blogsQueryData = new CreateItemsWithQueryDto<BlogInstance>(blogsQuery, sortedBlogs)
            res.status(200).json(blogsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createBlog(req: Request<any, any, any, any>, res: Response) {
        try {
            const blogData = req.body
            const createBlogData: IBlog = await blogsRepository.createBlog(blogData)
            res.status(201).json(createBlogData)
        } catch (e) {
            res.status(500).send(e);
        }
    }

    async updateBlog(req: Request, res: Response) {
        try {
            await blogsRepository.updateBlogById(req.params.id, req.body)
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        try {
            await blogsRepository.deleteBlog(req.params.id)
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getBlogById(req: Request, res: Response) {
        try {
            const blog = await blogsQueryRepository.blogOutput(req.params.id)
            res.status(200).json(blog)
        } catch (e) {
            res.status(500).send(e)
        }
    }
}

export const blogsController = new BlogsController();
