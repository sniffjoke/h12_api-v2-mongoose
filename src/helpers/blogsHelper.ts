import {blogModel} from "../models/blogsModel";

export const findBlogsHelper = async (
    query: { [key: string]: any }
    // query: { [key: string]: string | undefined }
) => {
    const searchNameTerm = query.searchNameTerm ? query.searchNameTerm : null

    const queryName = searchNameTerm !== null ? searchNameTerm : ''

    const filterName = {name: {$regex: queryName, $options: "i"}};

    const totalCount = await blogModel.countDocuments(filterName)
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
