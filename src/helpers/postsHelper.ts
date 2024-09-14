import {postModel} from "../models/postsModel";

export const findPostsHelper = async (
    query: { [key: string]: string | undefined },
    blogId?: string
) => {
    const searchNameTerm = query.searchNameTerm ? query.searchNameTerm : null

    const filterId = blogId ? {blogId} : {}

    const totalCount = await postModel.countDocuments(filterId)
    const pageSize = query.pageSize !== undefined ? +query.pageSize : 10
    const pagesCount = Math.ceil(totalCount / +pageSize)

    return {
        totalCount,
        pageSize,
        pagesCount,
        page: query.pageNumber ? Number(query.pageNumber) : 1,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        searchNameTerm
    }
}
