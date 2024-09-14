import {param} from "express-validator";
import {deviceModel} from "../../../models/devicesModel";

export const idDeviceValidator = param('id')
    .custom(async id => {
        const device: any = await deviceModel.findOne({deviceId: id})
        if (!device) {
            throw new Error('Not found')
        } else {
            return !!device
        }
    }).withMessage('Сессия с заданным id не найден!')
