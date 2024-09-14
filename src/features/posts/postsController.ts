import {Request, Response} from "express";
import {findPostsHelper} from "../../helpers/postsHelper";
import {postsQueryRepository} from "./postsQueryRepository";
import {CreateItemsWithQueryDto} from "../blogs/dto/CreateDataWithQuery.dto";
import {PostInstance} from "../../interfaces/posts.interface";
import {postsRepository} from "./postsRepository";

class PostsController {

    async getPostsWithParams(req: Request<any, any, any, any>, res: Response) {
        try {
            const postsQuery = await findPostsHelper(req.query)
            const sortedPosts = await postsQueryRepository.postsSortWithQuery(postsQuery)
            const postsQueryData = new CreateItemsWithQueryDto<PostInstance>(postsQuery, sortedPosts)
            res.status(200).json(postsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getAllPostsByBlogIdSortWithQuery(req: Request<any, any, any, any>, res: Response) {
        try {
            const postsQuery = await findPostsHelper(req.query, req.params.id)
            const sortedPosts = await postsQueryRepository.getAllPostsByBlogIdSortWithQuery(req.params.id, postsQuery)
            const postsQueryData = new CreateItemsWithQueryDto<PostInstance>(postsQuery, sortedPosts)
            res.status(200).json(postsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createPost(req: Request<any, any, any, any>, res: Response) {
        try {
            const newPost = await postsRepository.createPost(req.body)
            res.status(201).json(newPost)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createPostByBlogId(req: Request<any, any, any, any>, res: Response) {
        try {
            const newPost = await postsRepository.createPostByBlogId(req.body, req.params.id)
            res.status(201).json(newPost)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async updatePostById(req: Request<any, any, any, any>, res: Response) {
        try {
            await postsRepository.updatePostById(req.params.id, req.body)
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deletePostById(req: Request<any, any, any, any>, res: Response) {
        try {
            await postsRepository.deletePostById(req.params.id)
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getPostById(req: Request<any, any, any, any>, res: Response) {
        try {
            const post = await postsQueryRepository.postOutput(req.params.id)
            res.status(200).json(post)
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export const postsController = new PostsController();
