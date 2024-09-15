import {userService} from "../../services/user.service";
import {likeModel} from "../../models/likesModel";
import {LikeStatus} from "../../interfaces/comments.interface";
import {CreateCommentDto} from "./dto/CreateComment.dto";

class CommentsService {

    async generateCommentsData(items: CreateCommentDto[], bearerToken: string) {
        const commentsMap = await Promise.all(items.map(async (item) => {
                return this.generateNewCommentData(item, bearerToken)
            })
        )
        return commentsMap
    }

    async generateNewCommentData(item: CreateCommentDto, bearerToken: string) {
        const isUserExists = await userService.isUserExists(bearerToken)
        const likeStatus = await likeModel.findOne({commentId: item.id, userId: isUserExists?._id})
        console.log(likeStatus)
        const myStatus = isUserExists && likeStatus ? likeStatus.status : LikeStatus.None
        const newCommentData = this.statusPayload(item, myStatus)
        return newCommentData
    }

    statusPayload(comment: CreateCommentDto, status?: string) {
        const newStatus = status ? status : LikeStatus.None
        return {
            ...comment,
            likesInfo: {
                ...comment.likesInfo,
                myStatus: newStatus
            }
        }
    }

}

export const commentsService = new CommentsService();
