import {Request, Response} from "express";
import {findPostsHelper} from "../../helpers/postsHelper";
import {postsQueryRepository} from "./postsQueryRepository";
import {CreateItemsWithQueryDto} from "../blogs/dto/CreateDataWithQuery.dto";
import {PostInstance} from "../../interfaces/posts.interface";
import {postsRepository} from "./postsRepository";
import {tokenService} from "../../services/token.service";
import {decode} from "jsonwebtoken";
import {UserInstance} from "../../interfaces/users.interface";
import {userModel} from "../../models/usersModel";
import {postModel} from "../../models/postsModel";
import {extendedLikeFactory} from "../../factorys/extendedLikeFactory";
import {likeModel} from "../../models/likesModel";
import {LikeStatus} from "../../interfaces/comments.interface";
import {commentsRepository} from "../comments/commentsRepository";

class PostsController {

    async getPostsWithParams(req: Request<any, any, any, any>, res: Response) {
        try {
            const postsQuery = await findPostsHelper(req.query)
            const sortedPosts = await postsQueryRepository.postsSortWithQuery(postsQuery)
            console.log(sortedPosts)
            const isUserExists = await commentsRepository.isUserExists(req.headers.authorization as string)
            const postsMap = await Promise.all(sortedPosts.map(async (item) => {
                const likeStatus = await likeModel.findOne({postId: item.id, userId: isUserExists?._id})
                const likeDetails = await likeModel.find({postId: item.id, status: LikeStatus.Like}).limit(3).sort({createdAt: -1})
                const likeDetailsMap = await Promise.all(
                    likeDetails.map(async (like: any) => {
                        const user = await userModel.findById(like.userId)
                        return {
                            addedAt: like.createdAt,
                            userId: like.userId,
                            login: user!.login
                        }
                    })
                )
                return isUserExists ? {
                    ...item,
                    extendedLikesInfo: {
                        ...item.extendedLikesInfo,
                        myStatus: likeStatus?.status,
                        newestLikes: likeDetailsMap
                    }
                } : {
                    ...item, extendedLikesInfo: {
                        ...item.extendedLikesInfo,
                        myStatus: LikeStatus.None,
                        newestLikes: likeDetailsMap
                    }
                }
            }))
            const postsQueryData = new CreateItemsWithQueryDto<PostInstance>(postsQuery, postsMap)
            res.status(200).json(postsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getAllPostsByBlogIdSortWithQuery(req: Request<any, any, any, any>, res: Response) {
        try {
            const postsQuery = await findPostsHelper(req.query, req.params.id)
            const sortedPosts = await postsQueryRepository.getAllPostsByBlogIdSortWithQuery(req.params.id, postsQuery)
            const isUserExists = await commentsRepository.isUserExists(req.headers.authorization as string)
            const postsMap = await Promise.all(sortedPosts.map(async (item) => {
                const likeStatus = await likeModel.findOne({postId: item.id, userId: isUserExists?._id})
                const likeDetails = await likeModel.find({postId: item.id, status: LikeStatus.Like}).limit(3).sort({createdAt: -1})
                const likeDetailsMap = await Promise.all(
                    likeDetails.map(async (like: any) => {
                        const user = await userModel.findById(like.userId)
                        return {
                            addedAt: like.createdAt,
                            userId: like.userId,
                            login: user!.login
                        }
                    })
                )
                return isUserExists ? {
                    ...item,
                    extendedLikesInfo: {
                        ...item.extendedLikesInfo,
                        myStatus: likeStatus?.status,
                        newestLikes: likeDetailsMap
                    }
                } : {
                    ...item, extendedLikesInfo: {
                        ...item.extendedLikesInfo,
                        myStatus: LikeStatus.None,
                        newestLikes: likeDetailsMap
                    }
                }
            }))
            const postsQueryData = new CreateItemsWithQueryDto<PostInstance>(postsQuery, postsMap)
            res.status(200).json(postsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getPostById(req: Request<any, any, any, any>, res: Response) {
        try {
            const post = await postsQueryRepository.postOutput(req.params.id)
            const isUserExists = await commentsRepository.isUserExists(req.headers.authorization as string)
            const likeStatus = await likeModel.findOne({userId: isUserExists?._id, postId: post.id})
            const likeDetails = await likeModel.find({postId: post.id, status: LikeStatus.Like}).limit(3).sort({createdAt: -1})
            const likeDetailsMap = await Promise.all(
                likeDetails.map(async (like: any) => {
                    const user = await userModel.findById(like.userId)
                    return {
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: user!.login
                    }
                })
            )
            res.status(200).json(likeDetailsMap.length ? {
                ...post,
                extendedLikesInfo: {
                    ...post.extendedLikesInfo,
                    newestLikes: likeDetailsMap,
                    myStatus: isUserExists && likeStatus ? likeStatus?.status : LikeStatus.None
                }
            } : {
                ...post,
                extendedLikesInfo: {
                    ...post.extendedLikesInfo,
                    newestLikes: likeDetailsMap,
                    myStatus: isUserExists && likeStatus ? likeStatus?.status : LikeStatus.None
                }
            })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createPost(req: Request<any, any, any, any>, res: Response) {
        try {
            const post = await postsRepository.createPost(req.body)
            const newPost = await postsQueryRepository.postOutput(post._id)
            res.status(201).json({
                ...newPost,
                extendedLikesInfo: {
                    ...newPost.extendedLikesInfo,
                    myStatus: LikeStatus.None,
                    newestLikes: []
                }
            })
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createPostByBlogId(req: Request<any, any, any, any>, res: Response) {
        try {
            const post = await postsRepository.createPostByBlogId(req.body, req.params.id)
            const newPost = await postsQueryRepository.postOutput(post._id)
            res.status(201).json({
                ...newPost,
                extendedLikesInfo: {
                    ...newPost.extendedLikesInfo,
                    myStatus: LikeStatus.None,
                    newestLikes: []
                }
            })
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

    async updatePostByIdWithLikeStatus(req: Request, res: Response) {
        try {
            const token = tokenService.getToken(req.headers.authorization);
            const decodedToken: any = decode(token)
            const user: UserInstance | null = await userModel.findById(decodedToken?._id)
            const likeStatus = req.body.likeStatus
            const findedPost = await postModel.findById(req.params.id)
            const updates = await extendedLikeFactory(likeStatus, findedPost!, user!)
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

}

export const postsController = new PostsController();
