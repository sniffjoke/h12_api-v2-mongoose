import {CreatePostDto} from "./dto/CreatePost.dto";
import {likeModel} from "../../models/likesModel";
import {LikeStatus} from "../../interfaces/comments.interface";
import {userModel} from "../../models/usersModel";
import {userService} from "../../services/user.service";

class PostsService {

    async generatePostsWithLikesDetails(items: CreatePostDto[], bearerToken: string) {
        const newItems = await Promise.all(
            items.map(async (item) => {
                    return this.generateOnePostWithLikesDetails(item, bearerToken)
                }
            )
        )
        return newItems
    }

    async generateOnePostWithLikesDetails(post: CreatePostDto, bearerToken: string) {
        const isUserExists = await userService.isUserExists(bearerToken)
        const likeStatus = await likeModel.findOne({userId: isUserExists?._id, postId: post.id})
        const likeDetails = await likeModel.find({
            postId: post.id,
            status: LikeStatus.Like
        })
            .limit(3)
            .sort({createdAt: -1})
        const likeDetailsMap = await Promise.all(
            likeDetails.map(async (like: any) => {
                const user = await userModel.findById(like.userId)
                return {
                    addedAt: like.createdAt.toISOString(),
                    userId: like.userId,
                    login: user!.login
                }
            })
        )
        const myStatus = isUserExists && likeStatus ? likeStatus?.status : LikeStatus.None
        const postDataWithInfo = this.statusAndNewLikesPayload(post, myStatus, likeDetailsMap)
        return postDataWithInfo
    }

    statusAndNewLikesPayload(post: CreatePostDto, status?: string, newestLikes?: any) {
        const newStatus = status ? status : LikeStatus.None
        const newLikes = newestLikes ? newestLikes : []
        return {
            ...post,
            extendedLikesInfo: {
                ...post.extendedLikesInfo,
                myStatus: newStatus,
                newestLikes: newLikes
            }
        }
    }

}

export const postsService = new PostsService();
