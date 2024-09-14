// import {tokenCollection} from "../db/mongo-db";
// import {ObjectId, WithId} from "mongodb";
// import {RTokenDB} from "../types/tokens.interface";
//
//
// export const tokensRepository = {
//
//     async findTokenByRefreshToken(token: string) {
//         return await tokenCollection.findOne({refreshToken: token})
//     },
//
//     async updateTokenForActivate(refreshToken: string) {
//         const updatedToken = await tokenCollection.updateMany({refreshToken}, {$set: {blackList: true}})
//         return updatedToken
//     },
//
//     async createToken(tokenData: RTokenDB): Promise<ObjectId> {
//         const token = {
//             userId: tokenData.userId,
//             deviceId: tokenData.deviceId,
//             refreshToken: tokenData.refreshToken,
//             blackList: false
//     } as WithId<RTokenDB>;
//     const  newToken = await tokenCollection.insertOne(token as WithId<RTokenDB>)
//     return newToken.insertedId
// },
// }

import {tokenModel} from "../../models/tokensModel";
import {IToken} from "../../types/IToken";
import {TokenInstance} from "../../interfaces/tokens.interface";

class TokensRepository {

    public tokens = tokenModel

    async findTokenByRefreshToken(token: string) {
        const findedToken = await this.tokens.findOne({refreshToken: token})
        return findedToken
    }

    async updateOldTokensStatus(token: string) {
        const updateStatus = await this.tokens.updateMany({refreshToken: token}, {$set: {blackList: true}})
        return updateStatus
    }

    async saveTokenInDb(tokenData: IToken): Promise<TokenInstance> {
        const newToken = new this.tokens(tokenData);
        await newToken.save()
        return newToken
    }

}

export const tokensRepository = new TokensRepository();
