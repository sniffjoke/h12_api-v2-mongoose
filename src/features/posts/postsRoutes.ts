import {Router} from 'express';
import {postsController} from "./postsController";
import {commentsController} from "../comments/commentsController";
import {
    blogIdInPostValidator,
    contentPostValidator,
    idPostValidator,
    shortDescriptionPostValidator,
    titlePostValidator
} from "./validators/postsValidators";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";
import {contentCommentValidator} from "../comments/validators/commentsValidators";
import {authMiddlewareWithBearer} from "../../middlewares/auth/authMiddlewareWithBearer";
import {authMiddlewareWithBasic} from "../../middlewares/auth/authMiddlewareWithBasic";

const router = Router();

router.route("/")
    .get(
        postsController.getPostsWithParams
    )
    .post(
        authMiddlewareWithBasic,
        titlePostValidator,
        contentPostValidator,
        blogIdInPostValidator,
        shortDescriptionPostValidator,
        errorExpressValidatorMiddleware,
        postsController.createPost
    )

router.route("/:id")
    .get(
        idPostValidator,
        errorExpressValidatorMiddleware,
        postsController.getPostById
    )
    .put(
        authMiddlewareWithBasic,
        idPostValidator,
        titlePostValidator,
        contentPostValidator,
        blogIdInPostValidator,
        shortDescriptionPostValidator,
        errorExpressValidatorMiddleware,
        postsController.updatePostById
    )
    .delete(
        authMiddlewareWithBasic,
        idPostValidator,
        errorExpressValidatorMiddleware,
        postsController.deletePostById
    )

router.route('/:id/comments')
    .get(
        idPostValidator,
        errorExpressValidatorMiddleware,
        commentsController.getAllCommentsByPostId
    )
    .post(
        authMiddlewareWithBearer,
        idPostValidator,
        contentCommentValidator,
        errorExpressValidatorMiddleware,
        commentsController.createCommentByPostId
    )


export default router
