import express from "express";
import {usersController} from "./usersController";
import {authMiddlewareWithBasic} from "../../middlewares/auth/authMiddlewareWithBasic";
import {emailUserValidator, loginUserValidator, passwordUserValidator} from "./validators/usersValidators";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";

const router = express.Router();

router.route('/')
    .get(
        usersController.getUsersWithParams
    )
    .post(
        authMiddlewareWithBasic,
        loginUserValidator,
        emailUserValidator,
        passwordUserValidator,
        errorExpressValidatorMiddleware,
        usersController.createUser
    )

router.route('/:id')
    .delete(
        authMiddlewareWithBasic,
        // idUserValidator,
        errorExpressValidatorMiddleware,
        usersController.deleteUserById
    )

export default router;
