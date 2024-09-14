import {CommentInstance, LikeStatus} from "../interfaces/comments.interface";
import {commentModel} from "../models/commentsModel";
import {UserInstance} from "../interfaces/users.interface";
import {likeModel} from "../models/likesModel";
import {LikeInstance} from "../interfaces/likes.interface";
import {PostInstance} from "../interfaces/posts.interface";
import {postModel} from "../models/postsModel";


export async function extendedLikeFactory(likeStatus: string, post: PostInstance, user: UserInstance) {
    const isLikeObjectForCurrentUserExists: LikeInstance | null = await likeModel.findOne({userId: user._id});
    if (isLikeObjectForCurrentUserExists === null) {
        const newLike = await likeModel.create({
            status: LikeStatus.None,
            userId: user._id,
            postId: post._id,
        })
    }
    const findedLike: LikeInstance | null = await likeModel.findOne({userId: user._id, postId: post._id})
    if (findedLike?.status === likeStatus) {
        const updateLikeStatus = null
    } else {
        const updateLikeStatus = await likeModel.findByIdAndUpdate(findedLike?._id, {status: likeStatus});
        const dislikeCount = post.extendedLikesInfo.dislikesCount
        const likeCount = post.extendedLikesInfo.likesCount
        if (likeStatus === LikeStatus.Like) {
            if (dislikeCount > 0 && findedLike?.status === LikeStatus.Dislike) {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.likesCount': +1, 'extendedLikesInfo.dislikesCount': -1}})
            } else {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.likesCount': +1}})
            }
        }
        if (likeStatus === LikeStatus.Dislike) {
            if (likeCount > 0 && findedLike?.status === LikeStatus.Like) {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.likesCount': -1, 'extendedLikesInfo.dislikesCount': +1}})
            } else {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.dislikesCount': +1}})
            }
        }
        if (likeStatus === LikeStatus.None) {
            if (findedLike?.status === LikeStatus.Like) {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.likesCount': -1}})
            } else {
                const updatePostInfo = await postModel.updateOne({_id: post._id}, {$inc: {'extendedLikesInfo.dislikesCount': -1}})
            }
        }
    }


}
