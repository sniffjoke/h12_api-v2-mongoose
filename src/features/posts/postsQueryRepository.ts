// import {ObjectId, WithId} from "mongodb";
//
//
// export const postsQueryRepository = {
//
//     async postOutput(id: string) {
//         const post = await postCollection.findOne({_id: new ObjectId(id)})
//         return this.postMapOutput(post as WithId<Post>)
//     },
//
//     postMapOutput(post: WithId<Post>) {
//         const {
//             createdAt,
//             blogName,
//             title,
//             shortDescription,
//             content,
//             _id,
//             blogId
//         } = post
//         return {
//             id: _id,
//             title,
//             shortDescription,
//             content,
//             blogId,
//             blogName,
//             createdAt
//         }
//     },
//
//     async postsSortWithQuery(query: any) {
//         const posts = await postCollection
//             .find()
//             .sort(query.sortBy, query.sortDirection)
//             .limit(query.pageSize)
//             .skip((query.page - 1) * query.pageSize)
//             .toArray()
//         return posts.map(post => postsQueryRepository.postMapOutput(post))
//     },
//
//     async getAllPostsByBlogIdSortWithQuery(blogId: string, query: any) {
//         const posts = await postCollection
//             .find({blogId})
//             .sort(query.sortBy, query.sortDirection)
//             .limit(query.pageSize)
//             .skip((query.page - 1) * query.pageSize)
//             .toArray()
//         return posts.map(post => postsQueryRepository.postMapOutput(post))
//     }
//
// }

import {postModel} from "../../models/postsModel";
import {CreatePostDto} from "./dto/CreatePost.dto";
import {PostInstance} from "../../interfaces/posts.interface";

class PostsQueryRepository {

    public posts = postModel

    async postsSortWithQuery(query: any) {
        const sortedPosts = await this.posts
            .find()
            // .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
        return sortedPosts
    }

    async getAllPostsByBlogIdSortWithQuery(blogId: string, query: any) {
        const sortedPosts = await this.posts
            .find({blogId})
            // .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
        return sortedPosts
    }

    async postOutput(id: string): Promise<CreatePostDto> {
        const post = await this.posts.findById(id)
        return this.postMapOutput(post as PostInstance)
    }

    postMapOutput(post: PostInstance): CreatePostDto {
        const postDto = new CreatePostDto(post)
        return postDto
    }

}

export const postsQueryRepository = new PostsQueryRepository();
