import {IPost} from "../../../types/IPost";

export class UpdatePostDto {
    public title: string;
    public shortDescription: string;
    public content: string;

    constructor(post: IPost) {
        this.title = post.title;
        this.shortDescription = post.shortDescription;
        this.content = post.content;
    }
}
