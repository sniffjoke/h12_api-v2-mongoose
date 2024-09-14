import {BlogInstance} from "../../../interfaces/blogs.interface";

export class CreateBlogDto {
    public id: string;
    public name: string;
    public description: string;
    public websiteUrl: string;
    public createdAt: string;
    public isMemberShip: boolean

    constructor(model: BlogInstance) {
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.websiteUrl = model.websiteUrl;
        this.createdAt = model.createdAt;
        this.isMemberShip = model.isMembership;
    }
}
