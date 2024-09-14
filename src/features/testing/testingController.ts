import {Request, Response} from 'express'
import {testingRepository} from "./testingRepository";

class TestingController {
    async testingDeleteAll(req: Request, res: Response) {
        await testingRepository.deleteAll()
        res.status(204).send('База очищена')
    }
}

export const testingController = new TestingController()
