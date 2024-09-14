// import {ApiError} from "../exceptions/api.error";
// import {EmailConfirmationModel, usersRepository} from "../repositories/usersRepository";
// import {add} from "date-fns";
// import {v4 as uuid} from "uuid";
// import {UserDBType} from "../dtos/users.dto";
// import mailService from "./mail.service";
// import {cryptoService} from "./crypto.service";
// import {SETTINGS} from "../settings";
// import {usersQueryRepository} from "../queryRepositories/usersQueryRepository";
//
//
// export const userService = {
//
//     async createUser(userData: UserDBType, confirmStatus: boolean) {
//         const {login, email, password} = userData
//         const activationLink = uuid()
//         const emailConfirmation = this.createEmailConfirmationInfo(confirmStatus, activationLink)
//         await this.isExistOrThrow(login, email)
//         const hashPassword = await cryptoService.hashPassword(password)
//         const userId = await usersRepository.createUser({email, password: hashPassword, login}, emailConfirmation)
//         if (!confirmStatus) {
//             await mailService.sendActivationMail(email, `${SETTINGS.PATH.API_URL}/api/auth/registration-confirmation/?code=${activationLink}`)
//         }
//         const user = await usersQueryRepository.userOutput(userId.toString())
//         return user
//     },
//
//     async isExistOrThrow(login: string, email: string) {
//         const emailExists = await usersRepository.getUserByEmail(email)
//         const loginExists = await usersRepository.getUserByLogin(login)
//         if (emailExists) {
//             throw ApiError.BadRequest(`Юзер с email ${email} уже существует`, 'email')
//         }
//         if (loginExists) {
//             throw ApiError.BadRequest(`Юзер с login ${login} уже существует`, 'login')
//         }
//         return null
//     },
//
//     createEmailConfirmationInfo(isConfirm: boolean, activationLink: string) {
//         const emailConfirmationNotConfirm: EmailConfirmationModel = {
//             isConfirmed: false,
//             confirmationCode: activationLink,
//             expirationDate: add(new Date(), {
//                     hours: 1,
//                     minutes: 30,
//                 }
//             ).toString()
//         }
//         const emailConfirmationIsConfirm: EmailConfirmationModel = {
//             isConfirmed: true,
//         }
//         return isConfirm ? emailConfirmationIsConfirm : emailConfirmationNotConfirm
//     }
//
// }

import { add } from "date-fns/add"
import {v4 as uuid} from "uuid"
import {usersRepository} from "../features/users/usersRepository";
import {ApiError} from "../exceptions/api.error";
import {cryptoService} from "./crypto.service";
import {IUser} from "../types/IUser";
import mailService from "./mail.service";
import {SETTINGS} from "../settings";
import {userModel} from "../models/usersModel";

interface EmailConfirmationModel {
    confirmationCode?: string
    expirationDate?: string
    isConfirmed: boolean
}

class UserService {

    public users = userModel

    async createUser(userData: IUser, isConfirm: boolean) {
        await this.isExistOrThrow(userData.login, userData.email)
        const emailConfirmation: EmailConfirmationModel = this.createEmailConfirmationInfo(isConfirm)
        const hashPassword = await cryptoService.hashPassword(userData.password)
        if (!isConfirm) {
            await mailService.sendActivationMail(userData.email, `${SETTINGS.PATH.API_URL}/api/auth/registration-confirmation/?code=${emailConfirmation.confirmationCode}`)
        }
        const user = await usersRepository.createUser(userData, hashPassword, emailConfirmation)
        return user
    }

   private async isExistOrThrow(login: string, email: string) {
        const emailExists = await usersRepository.getUserByEmail(email)
        const loginExists = await usersRepository.getUserByLogin(login)
        if (emailExists) {
            throw ApiError.BadRequest(`Юзер с email ${email} уже существует`, 'email')
        }

        // loginexists

        if (loginExists) {
            throw ApiError.BadRequest(`Юзер с login ${login} уже существует`, 'login')
        }
        return null
    }

    public createEmailConfirmationInfo(isConfirm: boolean) {
        const emailConfirmationNotConfirm: EmailConfirmationModel = {
            isConfirmed: false,
            confirmationCode: uuid(),
            expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }
            ).toString()
        }
        const emailConfirmationIsConfirm: EmailConfirmationModel = {
            isConfirmed: true,
        }
        return isConfirm ? emailConfirmationIsConfirm : emailConfirmationNotConfirm
    }

    async validateUser(userLoginOrEmail: string) {
        let user
        // TODO: to const
        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(userLoginOrEmail)) {
            user = await usersRepository.getUserByLogin(userLoginOrEmail)
        } else {
            user = await usersRepository.getUserByEmail(userLoginOrEmail)
        }
        if (!user) {
            // throw ApiError.BadRequest('Пользователь не найден', 'loginOrEmail')
            throw ApiError.UnauthorizedError()
        }
        return user
    }

    async isEmailExistOrThrow(email: string) {
        const emailExists = await usersRepository.getUserByEmail(email)
        if (!emailExists) {
            throw ApiError.BadRequest(`Юзер с email ${email} не существует`, 'email')
        }
        return emailExists
    }

    async updatePassword(password: string, recoveryCode: string) {
        const user = await this.users.findOne({'emailConfirmation.confirmationCode': recoveryCode})
        if (!user) {
            throw ApiError.BadRequest('Юзер не найден', 'recoveryCode')
        }
        const emailExists = await usersRepository.getUserByEmail(user.email)
        if (!emailExists) {
            throw ApiError.BadRequest('Данный email не найден', 'email')
        }
        const hashPassword = await cryptoService.hashPassword(password)
        const updateUserInfo = await usersRepository.updateUserPassword(user.email, hashPassword)
        return updateUserInfo
    }

}

export const userService = new UserService();
