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
