import { add } from "date-fns/add"
import {v4 as uuid} from "uuid"
import {usersRepository} from "../features/users/usersRepository";
import {ApiError} from "../exceptions/api.error";
import {cryptoService} from "./crypto.service";
import {IUser} from "../types/IUser";
import mailService from "./mail.service";
import {SETTINGS} from "../settings";
import {userModel} from "../models/usersModel";
import {tokenService} from "./token.service";
import {UserInstance} from "../interfaces/users.interface";

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

    async isUserExists(bearerToken: string) {
        if (!bearerToken) return null
        const token = tokenService.getToken(bearerToken);
        const validateToken: any = tokenService.validateAccessToken(token)
        const user: UserInstance | null = await userModel.findById(validateToken?._id)
        return user
    }

}

export const userService = new UserService();
