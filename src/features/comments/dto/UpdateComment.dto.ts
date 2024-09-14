import {IComment} from "../../../types/IComment";

export class UpdateCommentDto {
    public content: string;

    constructor(comment: IComment) {
        this.content = comment.content;
    }
}
