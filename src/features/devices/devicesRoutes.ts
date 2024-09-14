// import express from "express";
// import {
//     deleteAllDevicesExceptCurrentController,
//     deleteDeviceByIdController,
//     getDevicesController
// } from "../controllers/devicesController";
// import {idDeviceValidator} from "../middlewares/express-validators/devicesValidators";
// import {errorMiddleware} from "../middlewares/errors/errorMiddleware";
//
//
// const router = express.Router();
//
// router.route('/')
//     .get(
//         getDevicesController
//     )
//     .delete(
//         deleteAllDevicesExceptCurrentController
//     )
//
// router.route('/:id')
//     .delete(
//         idDeviceValidator,
//         errorMiddleware,
//         deleteDeviceByIdController
//     )
//
// export default router

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
