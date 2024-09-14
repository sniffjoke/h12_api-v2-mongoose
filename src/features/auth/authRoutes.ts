// import express from "express";
// import {
//     activateEmailUserController,
//     getMeController,
//     loginController, refreshTokenController,
//     registerController, logoutController, resendEmailController
// } from "../controllers/authController";
// import {errorMiddleware} from "../middlewares/errors/errorMiddleware";
// import {
//     emailAuthRegisterValidator,
//     loginAuthRegisterValidator,
//     passwordAuthRegisterValidator
// } from "../middlewares/express-validators/authValidators";
// import {authMiddlewareWithBearer} from "../middlewares/auth/authMiddlewareWithBearer";
// import {rateLimitMiddleware} from "../middlewares/rateLimitMiddleware";
//
//
// const router = express.Router();
//
// router.route('/login')
//     .post(
//         rateLimitMiddleware,
//         loginController
//     );
//
//
//
// router.route('/registration')
//     .post(
//         rateLimitMiddleware,
//         loginAuthRegisterValidator,
//         emailAuthRegisterValidator,
//         passwordAuthRegisterValidator,
//         errorMiddleware,
//         registerController
//     );
//
// router.route('/registration-confirmation')
//     .post(
//         rateLimitMiddleware,
//         activateEmailUserController
//     );
//
// router.route('/registration-email-resending')
//     .post(
//         rateLimitMiddleware,
//         emailAuthRegisterValidator,
//         errorMiddleware,
//         resendEmailController
//     );
//
//
// router.route('/me')
//     .get(
//         authMiddlewareWithBearer,
//         errorMiddleware,
//         getMeController
//     );
//
// router.route('/refresh-token')
//     .post(
//         refreshTokenController
//     )
//
// router.route('/logout')
//     .post(
//         logoutController
//     )
//
// export default router

import {Router} from 'express';
import {authController} from "./authController";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";
import {
    emailAuthValidator,
    loginAuthValidator,
    newPasswordAuthValidator,
    passwordAuthValidator
} from "./validators/authValidators";
import {authMiddlewareWithBearer} from "../../middlewares/auth/authMiddlewareWithBearer";
import {rateLimitMiddleware} from "../../middlewares/rateLimitMiddleware";

const router = Router();

router.route('/login')
    .post(
        rateLimitMiddleware,
        authController.login
    )

router.route('/registration')
    .post(
        rateLimitMiddleware,
        loginAuthValidator,
        emailAuthValidator,
        passwordAuthValidator,
        errorExpressValidatorMiddleware,
        authController.register
    );

router.route('/me')
    .get(
        authMiddlewareWithBearer,
        errorExpressValidatorMiddleware,
        authController.getMe
    );

router.route('/registration-email-resending')
    .post(
        rateLimitMiddleware,
        emailAuthValidator,
        errorExpressValidatorMiddleware,
        authController.resendEmail
    );

router.route('/registration-confirmation')
    .post(
        rateLimitMiddleware,
        authController.activateEmailUser
    );

router.route('/refresh-token')
    .post(
        authController.refreshToken
    )

router.route('/logout')
    .post(
        authController.logout
    )

router.route('/password-recovery')
    .post(
        rateLimitMiddleware,
        emailAuthValidator,
        errorExpressValidatorMiddleware,
        authController.passwordRecovery
    )

router.route('/new-password')
    .post(
        rateLimitMiddleware,
        newPasswordAuthValidator,
        errorExpressValidatorMiddleware,
        authController.newPasswordApprove
    )

export default router
