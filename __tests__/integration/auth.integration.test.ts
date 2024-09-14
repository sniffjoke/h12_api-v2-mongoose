import {client, connectToDB, userCollection} from "../../src/db/db";
import mailService from "../../src/services/mail.service";
import {UserDBType} from "../../src/dtos/users.dto";
import {mockUser} from "../helpers/test-helpers";
import {userService} from "../../src/services/user.service";


describe('AUTH-INTEGRATION', () => {
    beforeAll(async () => {
        await connectToDB()
        await userCollection.deleteMany()
    })
    afterAll(async () => {
        await client.close()
    })

    afterAll((done) => done())

    describe('User Registration', () => {
        mailService.sendActivationMail = jest.fn()
            .mockImplementation((email: string, code: string, template: (code: string) => string) => true)

        it('should register user with correct data', async () => {
            const userData: UserDBType = mockUser(1)
            const newUser = await userService.createUser(userData, false)
            expect(mailService.sendActivationMail).toHaveBeenCalled()
            expect(mailService.sendActivationMail).toHaveBeenCalledTimes(1)
        });
    })
})
