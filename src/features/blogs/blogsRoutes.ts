import express from "express";
import {blogsController} from "./blogsController";
import {postsController} from "../posts/postsController";
import {
    descriptionBlogValidator,
    idBlogValidator,
    nameBlogValidator,
    websiteUrlValidator
} from "./validators/blogsValidators";
import {errorExpressValidatorMiddleware} from "../../middlewares/errors/errorExpressValidatorMiddleware";
import {authMiddlewareWithBasic} from "../../middlewares/auth/authMiddlewareWithBasic";
import {
    contentPostValidator,
    shortDescriptionPostValidator,
    titlePostValidator
} from "../posts/validators/postsValidators";

const router = express.Router();

router.route('/')
    .get(
        blogsController.getBLogsWithParams
    )
    .post(
        authMiddlewareWithBasic,
        nameBlogValidator,
        descriptionBlogValidator,
        websiteUrlValidator,
        errorExpressValidatorMiddleware,
        blogsController.createBlog
    )

router.route('/:id')
    .get(
        idBlogValidator,
        errorExpressValidatorMiddleware,
        blogsController.getBlogById
    )
    .put(
        authMiddlewareWithBasic,
        idBlogValidator,
        nameBlogValidator,
        websiteUrlValidator,
        descriptionBlogValidator,
        errorExpressValidatorMiddleware,
        blogsController.updateBlog
    )
    .delete(
        authMiddlewareWithBasic,
        idBlogValidator,
        errorExpressValidatorMiddleware,
        blogsController.deleteBlog
    )

router.route('/:id/posts')
    .get(
        idBlogValidator,
        errorExpressValidatorMiddleware,
        postsController.getAllPostsByBlogIdSortWithQuery
    )
    .post(
        authMiddlewareWithBasic,
        idBlogValidator,
        contentPostValidator,
        shortDescriptionPostValidator,
        titlePostValidator,
        errorExpressValidatorMiddleware,
        postsController.createPostByBlogId
    )

export default router













