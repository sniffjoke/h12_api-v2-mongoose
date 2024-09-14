import {userModel} from "../models/usersModel";

export const findUsersHelper = async (query: { [key: string]: string | undefined }) => {
    const searchLoginTerm = query.searchLoginTerm ? query.searchLoginTerm : null
    const searchEmailTerm = query.searchEmailTerm ? query.searchEmailTerm : null

    const queryLogin = searchLoginTerm !== null ? searchLoginTerm : ''
    const queryEmail = searchEmailTerm !== null ? searchEmailTerm : ''

    const filterLogin = {$regex: queryLogin, $options: "i"};
    const filterEmail = {$regex: queryEmail, $options: "i"};

    const totalCount = await userModel.countDocuments({$or: [{login: filterLogin}, {email: filterEmail}]})
    const pageSize = query.pageSize !== undefined ? +query.pageSize : 10
    const pagesCount = Math.ceil(totalCount / +pageSize)

    return {
        totalCount,
        pageSize,
        pagesCount,
        page: query.pageNumber ? Number(query.pageNumber) : 1,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection : 'desc',
        searchLoginTerm,
        searchEmailTerm
    }
}
