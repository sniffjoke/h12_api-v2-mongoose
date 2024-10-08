import {postModel} from "../../models/postsModel";
import {CreatePostDto} from "./dto/CreatePost.dto";
import {PostInstance} from "../../interfaces/posts.interface";

class PostsQueryRepository {

    public posts = postModel

    async postsSortWithQuery(query: any) {
        const sortedPosts = await this.posts
            .find()
            // .sort(query.sortBy, query.sortDirection)
            .sort({createdAt: -1})
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .lean()
        return sortedPosts.map(item => this.postMapOutput(item))
    }

    async getAllPostsByBlogIdSortWithQuery(blogId: string, query: any) {
        const sortedPosts = await this.posts
            .find({blogId})
            // .sort(query.sortBy, query.sortDirection)
            .sort({createdAt: -1})
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
            .lean()
        return sortedPosts.map(item => this.postMapOutput(item))
    }

    async postOutput(id: string): Promise<CreatePostDto> {
        const post = await this.posts.findById(id).lean()
        return this.postMapOutput(post as PostInstance)
    }

    postMapOutput(post: PostInstance): CreatePostDto {
        const postDto = new CreatePostDto(post)
        return postDto
    }

}

export const postsQueryRepository = new PostsQueryRepository();
