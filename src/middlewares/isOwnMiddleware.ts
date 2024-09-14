import {NextFunction, Request, Response} from "express";
import {SETTINGS} from "../settings";
import {ObjectId} from "mongodb";
import {commentModel} from "../models/commentsModel";
import {verify} from "jsonwebtoken";

export const isOwnMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization
    if (!token) {
        res.status(401).send('Нет авторизации')
        return
    }
    try {
        token = token.split(' ')[1]
        if (token === null || !token) {
            res.status(401).send('Нет авторизации')
            return;
        }
        let decodedToken: any = verify(token, SETTINGS.VARIABLES.JWT_SECRET_ACCESS_TOKEN as string)
        if (!decodedToken) {
            res.status(401).send('Нет авторизации')
            return;
        }
        const comment = await commentModel.findOne({_id: new ObjectId(req.params.id)})
        let isOwn: boolean = decodedToken._id === comment?.commentatorInfo.userId.toString()
        if (isOwn) {
            next()
        } else {
            res.status(403).send('Нет доступа')
        }
    } catch (e) {
        res.status(401).send('Нет авторизации catch')
        return;
    }
}
