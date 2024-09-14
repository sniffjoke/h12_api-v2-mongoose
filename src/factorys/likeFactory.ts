import {CommentInstance, LikeStatus} from "../interfaces/comments.interface";
import {commentModel} from "../models/commentsModel";
import {UserInstance} from "../interfaces/users.interface";
import {likeModel} from "../models/likesModel";
import {LikeInstance} from "../interfaces/likes.interface";


export async function likeFactory(likeStatus: string, comment: CommentInstance, user: UserInstance) {
    const isLikeObjectForCurrentUserExists: LikeInstance | null = await likeModel.findOne({userId: user._id});
    if (isLikeObjectForCurrentUserExists === null) {
        const newLike = await likeModel.create({
            status: LikeStatus.None,
            userId: user._id,
            commentId: comment._id,
        })
    }
    const findedLike: LikeInstance | null = await likeModel.findOne({userId: user._id, commentId: comment._id})
    if (findedLike?.status === likeStatus) {
        const updateLikeStatus = null
    } else {
        const updateLikeStatus = await likeModel.findByIdAndUpdate(findedLike?._id, {status: likeStatus});
        const dislikeCount = comment.likesInfo.dislikesCount
        const likeCount = comment.likesInfo.likesCount
        if (likeStatus === LikeStatus.Like) {
            if (dislikeCount > 0 && findedLike?.status === LikeStatus.Dislike) {
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': +1, 'likesInfo.dislikesCount': -1}})
            } else {
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': +1}})
            }
        }
        if (likeStatus === LikeStatus.Dislike) {
            if (likeCount > 0 && findedLike?.status === LikeStatus.Like) {
                console.log(1)
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': -1, 'likesInfo.dislikesCount': +1}})
            } else {
                console.log(2)
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.dislikesCount': +1}})
            }
        }
        if (likeStatus === LikeStatus.None) {
            if (findedLike?.status === LikeStatus.Like) {
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.likesCount': -1}})
            } else {
                const updateCommentInfo = await commentModel.updateOne({_id: comment._id}, {$inc: {'likesInfo.dislikesCount': -1}})
            }
        }
    }


}
