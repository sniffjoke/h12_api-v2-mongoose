import {Request, Response, NextFunction} from "express";
import {tokenService} from "../../services/token.service";
import {ApiError} from "../../exceptions/api.error";
import {deviceModel} from "../../models/devicesModel";
import {DeviceInstance} from "../../interfaces/devices.interface";
import {tokenModel} from "../../models/tokensModel";
import {usersRepository} from "../users/usersRepository";

class DevicesController {

    async getDevices(req: Request<any, any, any, any>, res: Response, next: NextFunction) {
        const token = req.cookies.refreshToken;
        const validateToken: any = tokenService.validateRefreshToken(token)
        if (!validateToken) {
            return next(ApiError.UnauthorizedError())
        }
        const user = await usersRepository.findUserById(validateToken._id)
        const devices = await deviceModel.find({userId: user?._id.toString()})
        const deviceMap = (device: DeviceInstance) => ({
            deviceId: device.deviceId,
            ip: device.ip,
            title: device.title,
            lastActiveDate: device.lastActiveDate,
        })
        const devicesOutput = devices.map((device) => {
            return deviceMap(device)
        })
        res.status(200).json(devicesOutput)
    }

    async deleteDeviceByDeviceIdField(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.cookies.refreshToken;
            const validateToken: any = tokenService.validateRefreshToken(token)
            if (!validateToken) {
                return next(ApiError.UnauthorizedError())
            }
            const findToken = await tokenModel.findOne({deviceId: req.params.id})
            if (!findToken) {
                return next(ApiError.UnauthorizedError())
            }
            if (validateToken._id !== findToken?.userId.toString()) {
                res.status(403).send('Сессия принадлежит другому пользователю')
                return
            }
            await deviceModel.deleteOne({deviceId: req.params.id})
            const updateTokenInfo = await tokenModel.updateMany({deviceId: req.params.id}, {$set: {blackList: true}})
            if (!updateTokenInfo) {
                return next(ApiError.UnauthorizedError())
            }
            res.status(204).send('Удалено');
        } catch (e) {
            res.status(500).send(e)
        }
    }

    async deleteAllDevicesExceptCurrent(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.refreshToken;
        const validateToken: any = tokenService.validateRefreshToken(token)
        if (!validateToken) {
            return next(ApiError.UnauthorizedError())
        }
        // await deviceModel.deleteMany({userId: {$ne: validateToken.userId}})
        // await deviceModel.deleteMany({deviceId: {$ne: validateToken.deviceId}})
        await deviceModel.deleteMany({userId: validateToken._id, deviceId: {$ne: validateToken.deviceId}})
        await tokenModel.updateMany({userId: validateToken._id, deviceId: {$ne: validateToken.deviceId}}, {$set: {blackList: true}})
        res.status(204).send('Удалено');
    } catch (e) {
        res.status(500).send(e)
    }

}

}

export const devicesController = new DevicesController();
