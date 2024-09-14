import {IBlog} from "../../../types/IBlog";

export class UpdateBlogDto {
    public name: string;
    public description: string;
    public websiteUrl: string;

    constructor(blog: IBlog) {
        this.name = blog.name;
        this.description = blog.description;
        this.websiteUrl = blog.websiteUrl;
    }
}
