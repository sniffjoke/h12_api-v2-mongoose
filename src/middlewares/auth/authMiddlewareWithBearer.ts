import {NextFunction, Request, Response} from "express";
import {tokenService} from "../../services/token.service";
import {ApiError} from "../../exceptions/api.error";

export const authMiddlewareWithBearer = (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization as string
    if (!token) {
        return next(ApiError.UnauthorizedError())
    }

    try {
        token = token.split(' ')[1]
        if (token === null || !token) {
            return next(ApiError.UnauthorizedError())
        }
        let verifyToken: any = tokenService.validateAccessToken(token)
        if (!verifyToken) {
            return next(ApiError.UnauthorizedError())
        }
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}
