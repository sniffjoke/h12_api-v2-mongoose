// import {userCollection} from "../db/mongo-db";
// import {ObjectId, WithId} from "mongodb";
// import {UserDBType} from "../dtos/users.dto";
// import {User} from "../types/users.interface";
//
// export interface EmailConfirmationModel {
//         confirmationCode?: string
//         expirationDate?: string
//         isConfirmed: boolean
// }
//
// export const usersRepository = {
//
//     async createUser(userData: UserDBType, emailConfirmation: EmailConfirmationModel): Promise<ObjectId> {
//         const user: User = {
//             login: userData.login,
//             email: userData.email,
//             password: userData.password,
//             emailConfirmation,
//             createdAt: new Date(Date.now()).toISOString()
//         }
//         const newUser = await userCollection.insertOne(user as WithId<User>)
//         return newUser.insertedId
//     },
//
//     async deleteUser(id: string) {
//         return await userCollection.deleteOne({_id: new ObjectId(id)})
//     },
//
//     async findUserById(id: string) {
//         return await userCollection.findOne({_id: new ObjectId(id)})
//     },
//
//     async getUserByEmail(email: string) {
//         const user = await userCollection.findOne({email}) //$or
//         return user
//     },
//
//     async getUserByLogin(login: string) {
//         const user = await userCollection.findOne({login})
//         return user
//     },
//
// }

import {IUser} from "../../types/IUser";
import {CreateUserDto} from "./dto/CreateUser.dto";
import {userModel} from "../../models/usersModel";
import {UserInstance} from "../../interfaces/users.interface";
import {EmailConfirmationModel} from "../../interfaces/services.interface";
import { HydratedDocument } from "mongoose";


class UsersRepository {

    public users = userModel

    async createUser(userData: IUser, hashPassword: string, emailConfirmation: EmailConfirmationModel, userEntity?: HydratedDocument<UserInstance>): Promise<CreateUserDto> {
        const user = new this.users({...userData, password: hashPassword, emailConfirmation})
        // await userEntity.save()
        await user.save()
        const userDto = new CreateUserDto(user)
        // return userEntity._id.toString()
        return userDto
    }

    async updateUserPassword(email: string, newPassword: string) {
        const findedUser = await this.users.findOne({email})
        const updateUserInfo = await this.users.updateOne({email: findedUser?.email}, {$set: {password: newPassword}})
        return updateUserInfo
    }

    async findUserById(id: string): Promise<UserInstance | null> {
        const user = await this.users.findById(id)
        return user
    }

    async deleteUser(id: string) {
        const user = await this.users.findByIdAndDelete(id)
        return user
    }

    async getUserByEmail(email: string) {
        const user = await userModel.findOne({email}) //$or
        return user
    }

    async getUserByLogin(login: string) {
        const user = await userModel.findOne({login})
        return user
    }

}

export const usersRepository = new UsersRepository();
