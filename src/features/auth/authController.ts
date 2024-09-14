import {Request, Response, NextFunction} from "express";
import {userService} from "../../services/user.service";
import {ApiError} from "../../exceptions/api.error";
import {authService} from "../../services/auth.service";
import {tokenService} from "../../services/token.service";
import {CreateUserInfoDto} from "./dto/CreateUserInfo.dto";
import {IDevice} from "../../types/IDevice";
import ip from "ip";
import {deviceModel} from "../../models/devicesModel";
import {v4 as uuid} from 'uuid';

class AuthController {

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const {loginOrEmail, password} = req.body;
            const user = await userService.validateUser(loginOrEmail)
            if (!user) {
                return next(ApiError.UnauthorizedError())
            }
            const myIp = ip.address()
            const userAgent = req.headers['user-agent'] as string;
            const findSession = await deviceModel.findOne({ip: myIp, title: userAgent})
            const deviceData: IDevice = {
                deviceId: findSession ? findSession.deviceId : uuid(),
                ip: myIp,
                title: userAgent,
                lastActiveDate: new Date(Date.now()).toISOString(),
            }
            const {accessToken, refreshToken} = await authService.loginUser({loginOrEmail, password}, deviceData.deviceId)
            if (findSession) {
                await deviceModel.updateOne({_id: findSession._id}, {
                    $set: {
                        lastActiveDate: new Date(Date.now()).toISOString(),
                    }
                })
                await tokenService.saveTokenInDb(user._id, refreshToken, false, findSession.deviceId)
            } else {
                const newDevice = new deviceModel(deviceData)
                await newDevice.save()
                await tokenService.saveTokenInDb(user._id, refreshToken, false, deviceData.deviceId)
            }
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.status(200).json({accessToken})
        } catch (e) {
            next(e)
        }
    }

    async register(req: Request, res: Response, next: NextFunction) {
        try {
            await userService.createUser(req.body, false)
            res.status(204).send('Письмо с активацией отправлено')
        } catch (e) {
            next(e)
        }
    }

    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await authService.getMe(tokenService.getToken(req.headers.authorization))
            const userInfo = new CreateUserInfoDto(user)
            res.status(200).json(userInfo)
        } catch (e) {
            next(e)
        }
    }

    async resendEmail(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.resendEmail(req.body.email)
            res.status(204).send('Ссылка повторна отправлена')
        } catch (e) {
            next(e)
        }
    }

    activateEmailUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await authService.activateEmail(req.body.code)
            res.status(204).send('Email подтвержден')
        } catch (e) {
            next(e)
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const {refreshToken, accessToken} = await authService.refreshToken(req.cookies.refreshToken)
            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true})
            res.status(200).json({accessToken})
        } catch (e) {
            next(e)
        }
    }


    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.logoutUser(req.cookies.refreshToken as string)
            res.clearCookie('refreshToken')
            res.status(204).send('Logout')
        } catch (e) {
            next(e)
        }
    }

    async passwordRecovery(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.passwordRecovery(req.body.email)
            res.status(204).send('Ссылка для восстановления пароля отправлена')
        } catch (e) {
            next(e)
        }
    }

    async newPasswordApprove(req: Request, res: Response, next: NextFunction) {
        try {
            await authService.approveNewPassword(req.body)
            res.status(204).send('Email подтвержден')
        } catch (e) {
            next(e)
        }
    }

}

export const authController = new AuthController();
