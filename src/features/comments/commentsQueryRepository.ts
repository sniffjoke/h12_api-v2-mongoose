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
