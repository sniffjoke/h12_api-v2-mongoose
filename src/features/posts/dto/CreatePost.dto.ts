import {BlogInstance} from "../../../interfaces/blogs.interface";
import {PostInstance} from "../../../interfaces/posts.interface";

export class CreatePostDto {
    public id: string;
    public title: string;
    public shortDescription: string;
    public content: string;
    public blogId: string;
    public blogName: string;
    public createdAt: string;

    constructor(model: PostInstance) {
        this.id = model._id;
        this.title = model.title;
        this.shortDescription = model.shortDescription;
        this.content = model.content;
        this.blogId = model.blogId;
        this.blogName = model.blogName;
        this.createdAt = model.createdAt;
    }
}
