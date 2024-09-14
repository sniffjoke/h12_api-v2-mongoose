// import {ObjectId, WithId} from "mongodb";
// import {userCollection} from "../db/mongo-db";
// import {User} from "../types/users.interface";
//
//
// export const usersQueryRepository = {
//
//     async getAllUsersWithQuery(query: any) {
//         const queryLogin = query.searchLoginTerm !== null ? query.searchLoginTerm : ''
//         const queryEmail = query.searchEmailTerm !== null ? query.searchEmailTerm : ''
//         const filter = {
//             $or: [
//                 {login: {$regex: queryLogin, $options: "i"}},
//                 {email: {$regex: queryEmail, $options: "i"}}
//             ]
//         }
//
//         const users = await userCollection
//             .find(filter)
//             .sort(query.sortBy, query.sortDirection)
//             .limit(query.pageSize)
//             .skip((query.page - 1) * query.pageSize)
//             .toArray()
//         return users.map(user => this.userMapOutput(user))
//     },
//
//     async userOutput(id: string) {
//         const user = await userCollection.findOne({_id: new ObjectId(id)})
//         return this.userMapOutput(user as WithId<User>)
//     },
//
//     userMapOutput(user: WithId<User>) {
//         const {_id, createdAt, login, email} = user
//         return {
//             id: _id,
//             login,
//             email,
//             createdAt
//         }
//     },
//
// }

import {userModel} from "../../models/usersModel";
import {CreateUserDto} from "./dto/CreateUser.dto";
import {UserInstance} from "../../interfaces/users.interface";

class UsersQueryRepository {

    public users = userModel

    async getAllUsersWithQuery(query: any) {
        const queryLogin = query.searchLoginTerm !== null ? query.searchLoginTerm : ''
        const queryEmail = query.searchEmailTerm !== null ? query.searchEmailTerm : ''
        const filter = {
            $or: [
                {login: {$regex: queryLogin, $options: "i"}},
                {email: {$regex: queryEmail, $options: "i"}}
            ]
        }

        const sortedUsers = await userModel
            .find(filter)
            // .sort(query.sortBy, query.sortDirection)
            .limit(query.pageSize)
            .skip((query.page - 1) * query.pageSize)
        return sortedUsers.map(user => this.userMapOutput(user))
    }

    async userOutput(id: string) {
        const user = await this.users.findById(id)
        return this.userMapOutput(user as UserInstance)
    }

    userMapOutput(user: UserInstance) {
        const userDto = new CreateUserDto(user)
        return userDto
    }

}

export const usersQueryRepository = new UsersQueryRepository();
