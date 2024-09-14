import {body, param} from "express-validator";
import {userModel} from "../../../models/usersModel";

export const idUserValidator = param('id')
    .custom(async id => {
        const user: any = await userModel.findById(id)
        if (!user) {
            throw new Error('Not found')
        } else {
            return !!user
        }
    }).withMessage('Пользователь с заданным id не найден!')

export const loginOrEmailAuthValidator = body('loginOrEmail')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isLength({min: 3, max: 10}).withMessage('Количество знаков 3-10')

export const passwordAuthValidator = body('password')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('Количество знаков: 6-20')

export const loginAuthValidator = body('login')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isLength({min: 3, max: 10}).withMessage('Количество знаков 3-10')

export const emailAuthValidator = body('email')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isEmail().withMessage('Введите валидный емайл')

export const newPasswordAuthValidator = body('newPassword')
    .isString().withMessage('Должно быть строковым значением')
    .trim()
    .isLength({min: 6, max: 20}).withMessage('Количество знаков 6-20')
