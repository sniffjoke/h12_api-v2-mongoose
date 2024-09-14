import {ApiError} from "../exceptions/api.error";
import {ILogin} from "../types/ILogin";
import {userService} from "./user.service";
import {cryptoService} from "./crypto.service";
import {tokenService} from "./token.service";
import {usersRepository} from "../features/users/usersRepository";
import mailService from "./mail.service";
import {authRepository} from "../features/auth/authRepository";
import {tokenModel} from "../models/tokensModel";
import {deviceModel} from "../models/devicesModel";
import {RecoveryPasswordModel} from "../interfaces/services.interface";

class AuthService {

    async loginUser(userData: ILogin, deviceId: string) {
        const user = await userService.validateUser(userData.loginOrEmail)
        if (!user) {
            throw ApiError.UnauthorizedError()
        }
        const isPasswordCorrect = await cryptoService.comparePassword(userData.password, user.password)
        if (!isPasswordCorrect) {
            throw ApiError.UnauthorizedError()
        }
        const {accessToken, refreshToken} = tokenService.createTokens(user._id, deviceId)
        return {
            accessToken,
            refreshToken
        }
    }

    async getMe(token: string) {
        const tokenData: any = tokenService.decodeToken(token)
        const user = await usersRepository.findUserById(tokenData._id)
        if (!user) {
            throw ApiError.UnauthorizedError()
        }
        return user
    }

    async resendEmail(email: string) {
        await this.isActivateEmailByStatus(email)
        const emailConfirmation = userService.createEmailConfirmationInfo(false)
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/registration-confirmation/?code=${emailConfirmation.confirmationCode}`)
        const updateUserInfo = await authRepository.updateUserWithResendActivateEmail(email, emailConfirmation)
        if (!updateUserInfo) {
            throw ApiError.UnauthorizedError()
        }
        return updateUserInfo
    }

    async isActivateEmailByStatus(email: string) {
        const isActivateEmail: any = await usersRepository.getUserByEmail(email)
        if (!isActivateEmail) {
            throw ApiError.BadRequest('Юзер не найден', 'email')
        }
        if (isActivateEmail.emailConfirmation.isConfirmed) {
            throw ApiError.BadRequest('Юзер уже активирован', 'email')
        }
        return isActivateEmail
    }

    async activateEmail(confirmationCode: string) {
        const isActivateEmail = await authRepository.checkActivateEmailByCode(confirmationCode)
        if (!isActivateEmail) {
            throw ApiError.BadRequest('Юзер уже активирован', 'code')
        }
        const updateEmailStatus = await authRepository.toActivateEmail(confirmationCode)
        if (!updateEmailStatus) {
            throw ApiError.BadRequest('Юзер не найден', 'code')
        }
        return updateEmailStatus
    }

    async refreshToken(token: string) {
        const tokenValidate: any = tokenService.validateRefreshToken(token)
        if (!tokenValidate) {
            throw ApiError.UnauthorizedError()
        }
        const isTokenExists = await tokenService.findTokenInDb(token)
        if (!isTokenExists || isTokenExists.blackList) {
            throw ApiError.UnauthorizedError()
        }
        const updateTokenInfo = await tokenService.updateTokensStatus(token)
        if (!updateTokenInfo) {
            throw ApiError.UnauthorizedError()
        }
        const {refreshToken, accessToken} = tokenService.createTokens(isTokenExists.userId, tokenValidate.deviceId)
        const addTokenToDb = await tokenService.saveTokenInDb(isTokenExists.userId, refreshToken, false, isTokenExists.deviceId)
        if (!addTokenToDb) {
            throw ApiError.UnauthorizedError()
        }
        return {
            refreshToken,
            accessToken
        }

    }

    async logoutUser(token: string) {
        const tokenValidate: any = tokenService.validateRefreshToken(token)
        if (!tokenValidate) {
            throw ApiError.UnauthorizedError()
        }
        const isTokenExists = await tokenService.findTokenInDb(token)
        if (!isTokenExists || isTokenExists.blackList) {
            throw ApiError.UnauthorizedError()
        }
        const updatedToken = await tokenModel.updateMany({deviceId: tokenValidate.deviceId}, {$set: {blackList: true}})
        if (!updatedToken) {
            throw ApiError.UnauthorizedError()
        }
        const updateDevices = await deviceModel.deleteOne({deviceId: tokenValidate.deviceId})
        if (!updateDevices) {
            throw ApiError.UnauthorizedError()
        }
        return updatedToken
    }

    async passwordRecovery(email: string) {
        // const emailExists = await userService.isEmailExistOrThrow(email)
        // if (!emailExists) {
        //     throw ApiError.BadRequest('Email не существует', email)
        // }
        const emailConfirmation = userService.createEmailConfirmationInfo(false)
        await mailService.sendRecoveryMail(email, `${process.env.API_URL}/api/auth/registration-confirmation/?recoveryCode=${emailConfirmation.confirmationCode}`)
        const updateUserInfo = await authRepository.updateUserWithRecoveryCode(email, `${emailConfirmation.confirmationCode}`)
        if (!updateUserInfo) {
            throw ApiError.UnauthorizedError()
        }
        return updateUserInfo
    }

    async approveNewPassword(recoveryPasswordData: RecoveryPasswordModel) {
        const {newPassword, recoveryCode} = recoveryPasswordData
        const updateUserInfo = await userService.updatePassword(newPassword, recoveryCode)
        if (!updateUserInfo) {
            throw ApiError.BadRequest('Невалидный код', 'incorrect')
        }
        return updateUserInfo
    }

}

export const authService = new AuthService();
