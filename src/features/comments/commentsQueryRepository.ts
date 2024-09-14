// import {ObjectId, WithId} from "mongodb";
// import {commentCollection} from "../db/mongo-db";
// import {IComment} from "../types/comments.interface";
//
//
// export const commentsQueryRepository = {
//
//     async commentsSortWithQuery (query: any) {
//         const comments = await commentCollection
//             .find()
//             .sort(query.sortBy, query.sortDirection)
//             .limit(query.pageSize)
//             .skip((query.page - 1) * query.pageSize)
//             .toArray()
//         return comments.map(comment => this.commentMapOutput(comment))
//     },
//
//     async getAllCommentsByPostId(query: any) {
//         const postId = query.postId
//         const filter = {
//             postId
//         }
//         const comments = await commentCollection
//             .find(filter)
//             .sort(query.sortBy, query.sortDirection)
//             .limit(query.pageSize)
//             .skip((query.page - 1) * query.pageSize)
//             .toArray()
//         return comments.map(comment => this.commentMapOutput(comment))
//     },
//
//     async commentOutput(id: string) {
//         const comment = await commentCollection.findOne({_id: new ObjectId(id)})
//         return this.commentMapOutput(comment as WithId<IComment>)
//     },
//
//     commentMapOutput(comment: WithId<IComment>) {
//         const {_id, createdAt, commentatorInfo, content} = comment
//         return {
//             id: _id.toString(),
//             content,
//             commentatorInfo,
//             createdAt
//         }
//     },
//
//
//
// }

import {commentModel} from "../../models/commentsModel";
import {CommentInstance} from "../../interfaces/comments.interface";
import {CreateCommentDto} from "./dto/CreateComment.dto";

class CommentsQueryRepository {

    public comments = commentModel

    async commentOutput(id: string): Promise<CreateCommentDto> {
        const comment = await this.comments.findById(id).lean()
        return this.commentMapOutput(comment as CommentInstance)
    }

    commentMapOutput(comment: CommentInstance) {
        const commentDto = new CreateCommentDto(comment)
        return commentDto
    }

    async commentsSortWithQuery (query: any) {
        const sortedComments = await this.comments
            .find()
            // .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
        return sortedComments.map(item => this.commentMapOutput(item))
    }

    async getAllCommentsByPostId(query: any) {
        const postId = query.postId
        const filter = {
            postId
        }
        const {sortBy} = query
        const sortedComments = await this.comments
            .find(filter)
            // .sort(query.sortBy, query.sortDirection)
            .sort({createdAt: -1})
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .lean()
        return sortedComments.map(item => this.commentMapOutput(item))
    }

}

export const commentsQueryRepository = new CommentsQueryRepository();
