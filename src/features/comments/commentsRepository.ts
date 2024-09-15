import {commentModel} from "../../models/commentsModel";
import {IComment} from "../../types/IComment";
import {CommentInstance, LikesInfo, LikeStatus} from "../../interfaces/comments.interface";
import {userModel} from "../../models/usersModel";
import {postModel} from "../../models/postsModel";
import {decode} from "jsonwebtoken";
import {CommentatorInfoInterface} from "./dto/CreateComment.dto";
import {UserInstance} from "../../interfaces/users.interface";
import {UpdateWriteOpResult} from "mongoose";
import {UpdateCommentDto} from "./dto/UpdateComment.dto";
import {likeModel} from "../../models/likesModel";

class CommentsRepository {

    public comments = commentModel
    public users = userModel
    public posts = postModel

    async createComment(commentData: IComment, token: string, postId: string) {
        const decodedToken: any = decode(token)
        const user: UserInstance | null = await this.users.findById(decodedToken?._id)
        const commentatorInfo: CommentatorInfoInterface = {
            userId: decodedToken._id,
            userLogin: user!.login
        }
        const likesInfo: LikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
        }
        const comment = new this.comments({...commentData, commentatorInfo, postId, likesInfo})
        await comment.save()
        const likeStatus = await likeModel.create({
            status: LikeStatus.None,
            userId: decodedToken._id,
            commentId: comment._id,
        })
        return {
            comment,
            likeStatus
        }
    }

    async updateCommentById(id: string, comment: CommentInstance): Promise<UpdateWriteOpResult> {
        const findedComment = await this.comments.findById(id)
        const updateDataCommentDto = new UpdateCommentDto(comment)
        const updateComment = await this.comments.updateOne({_id: findedComment?._id}, {$set: {...updateDataCommentDto}})
        return updateComment
    }

    async deleteCommentById(id: string) {
        const comment = await this.comments.findByIdAndDelete(id)
        return comment
    }

}

export const commentsRepository = new CommentsRepository();
