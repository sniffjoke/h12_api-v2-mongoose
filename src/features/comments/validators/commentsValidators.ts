import {body, param} from "express-validator";
import {commentModel} from "../../../models/commentsModel";


export const contentCommentValidator = body('content')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isLength({min: 20, max: 300}).withMessage('Количество знаков 20-300')

export const idCommentValidator = param('id')
    .custom(async commentId => {
        const comment = await commentModel.findById(commentId)
        if (!comment) {
            throw new Error('Not found')
        } else {
            return !!comment
        }
    }).withMessage('Комментарий с заданным id не найден!')

export const likeStatusCommentValidator = body('likeStatus')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .matches(/\b(?:Like|Dislike|None)\b/).withMessage('Непонятный тип')
