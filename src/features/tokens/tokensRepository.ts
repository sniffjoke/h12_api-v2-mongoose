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
