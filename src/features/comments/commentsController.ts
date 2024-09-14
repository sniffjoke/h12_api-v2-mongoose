import {commentsRepository} from "./commentsRepository";
import {Request, Response} from "express";
import {commentsQueryRepository} from "./commentsQueryRepository";
import {commentModel} from "../../models/commentsModel";
import {findBlogsHelper} from "../../helpers/blogsHelper";
import {CreateItemsWithQueryDto} from "../blogs/dto/CreateDataWithQuery.dto";
import {CommentInstance, LikeStatus} from "../../interfaces/comments.interface";
import {findCommentsHelper} from "../../helpers/commentsHelper";
import {tokenService} from "../../services/token.service";
import {userModel} from "../../models/usersModel";
import {decode} from "jsonwebtoken";
import {UserInstance} from "../../interfaces/users.interface";
import {likeModel} from "../../models/likesModel";
import {likeFactory} from "../../factorys/likeFactory";

class CommentsController {

    public comments = commentModel

    async getCommentsWithParams(req: Request<any, any, any, any>, res: Response) {
        try {
            const commentsQuery = await findBlogsHelper(req.query)
            const sortedComments = await commentsQueryRepository.commentsSortWithQuery(commentsQuery)
            const commentsQueryData = new CreateItemsWithQueryDto<CommentInstance>(commentsQuery, sortedComments)
            res.status(200).json(commentsQueryData)
        } catch (e) {
            res.status(500).json(e)
        }
    }

    async getAllCommentsByPostId(req: Request<any, any, any, any>, res: Response) {
        try {
            const commentsQuery = await findCommentsHelper(req.query, req.params.id)
            const sortedComments = await commentsQueryRepository.getAllCommentsByPostId(commentsQuery)
            const isUserExists = await commentsRepository.isUserExists(req.headers.authorization as string)
            const commentsMap = await Promise.all(sortedComments.map( async (item) => {
                const likeStatus = await likeModel.findOne({commentId: item.id, userId: item.commentatorInfo.userId})
                return isUserExists ? {...item, likesInfo: {...item.likesInfo, myStatus: likeStatus?.status}} : {...item, likesInfo: {...item.likesInfo, myStatus: LikeStatus.None}}
            }))
            const commentsQueryData = new CreateItemsWithQueryDto<CommentInstance>(commentsQuery, commentsMap)
            res.status(200).json(commentsQueryData)
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async getCommentById(req: Request, res: Response) {
        try {
            const comment = await commentsQueryRepository.commentOutput(req.params.id)
            const isUserExists = await commentsRepository.isUserExists(req.headers.authorization as string)
            const likeStatus = await likeModel.findOne({userId: isUserExists?._id, commentId: comment.id})
            res.status(200).json({...comment, likesInfo: {...comment.likesInfo, myStatus: isUserExists && likeStatus ? likeStatus?.status : LikeStatus.None}})
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async createCommentByPostId(req: Request, res: Response) {
        try {
            const {comment, likeStatus} = await commentsRepository.createComment(req.body, tokenService.getToken(req.headers.authorization), req.params.id)
            const newComment = await commentsQueryRepository.commentOutput(comment._id)
            res.status(201).json({...newComment, likesInfo: {...newComment.likesInfo, myStatus: LikeStatus.None}})
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async updateCommentById(req: Request, res: Response) {
        try {
            await commentsRepository.updateCommentById(req.params.id, req.body)
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async updateCommentByIdWithLikeStatus(req: Request, res: Response) {
        try {
            const token = tokenService.getToken(req.headers.authorization);
            const decodedToken: any = decode(token)
            const user: UserInstance | null = await userModel.findById(decodedToken?._id)
            const likeStatus = req.body.likeStatus
            const findedComment = await commentModel.findById(req.params.id)
            const updates = await likeFactory(likeStatus, findedComment!, user!)
            res.status(204).send('Обновлено')
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {
            await commentsRepository.deleteCommentById(req.params.id)
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

}

export const commentsController = new CommentsController();
