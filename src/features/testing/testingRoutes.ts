import express from "express";
import {testingController} from "./testingController";

const router = express.Router();

router.route('/')
    .delete(
        testingController.testingDeleteAll
    )

export default router;
