import {decode, sign, verify} from "jsonwebtoken";
import {SETTINGS} from "../settings";
import {ApiError} from "../exceptions/api.error";
import {tokenModel} from "../models/tokensModel";
import {tokensRepository} from "../features/tokens/tokensRepository";

class TokenService {

    public tokens = tokenModel

    getToken(bearerToken: string | undefined) {
        const token = bearerToken ? bearerToken.split(' ')[1] as string : undefined
        if (!token) {
            throw ApiError.UnauthorizedError()
        }
        return token
    }

    validateAccessToken(token: string) {
        try {
            const userData = verify(token, SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN as string)
            return userData
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = verify(token, SETTINGS.VARIABLES.JWT_SECRET_REFRESH_TOKEN as string)
            return userData
        } catch (e) {
            return null
        }
    }

    createTokens(userId: string, deviceId: string) {
        const accessToken = sign(
            {_id: userId},
            SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN as string,
            // {expiresIn: 60*60*1000}
            {expiresIn: '1000s'}
        )
        const refreshToken = sign(
            {_id: userId, deviceId},
            SETTINGS.VARIABLES.JWT_SECRET_REFRESH_TOKEN as string,
            // {expiresIn: 60*60*1000}
            {expiresIn: '2000s'}
        )
        return {
            accessToken,
            refreshToken
        }
    }

    async saveTokenInDb(userId: string, token: string, blackList: boolean, deviceId: string) {
        const tokenData = {
            userId,
            deviceId,
            refreshToken: token,
            blackList,
        }
        const newToken = await tokensRepository.saveTokenInDb(tokenData)
        return newToken
    }

    decodeToken(token: string) {
        const decodedToken = decode(token)
        if (!token) {
            throw ApiError.UnauthorizedError()
        }
        return decodedToken
    }

    async updateTokensStatus(token: string) {
        const updateStatus = await tokensRepository.updateOldTokensStatus(token)
        if (!updateStatus) {
            throw ApiError.UnauthorizedError()
        }
        return updateStatus
    }

    async findTokenInDb(token: string) {
        const findedToken = await tokensRepository.findTokenByRefreshToken(token)
        if (!findedToken) {
            throw ApiError.UnauthorizedError()
        }
        return findedToken
    }

}

export const tokenService = new TokenService();
