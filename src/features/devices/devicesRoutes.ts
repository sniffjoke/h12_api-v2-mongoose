import { Router } from 'express';
import {devicesController} from "./devicesController";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";
import {idDeviceValidator} from "./validators/devicesValidators";

const router = Router();

router.route('/')
    .get(
        devicesController.getDevices
    )
    .delete(
        devicesController.deleteAllDevicesExceptCurrent
    )

router.route('/:id')
    .delete(
        idDeviceValidator,
        errorExpressValidatorMiddleware,
        devicesController.deleteDeviceByDeviceIdField
    )

export default router
