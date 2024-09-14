import {client, connectToDB, userCollection} from "../../src/db/db";
import {UserDBType} from "../../src/dtos/users.dto";
import {codeAuth, mockLoginData, mockUser, req} from "../helpers/test-helpers";
import {SETTINGS} from "../../src/settings";

describe('users', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        await connectToDB()
        await userCollection.deleteMany()
    })

    afterAll(async () => {
        await client.close()
    })

// --------------------------------------------------------------------------------------------- //

    it('should Login success', async () => {
        const userData: UserDBType = mockUser(1)

        const newUser = await req
            .post(SETTINGS.PATH.USERS)
            .set({'Authorization': `Basic ` + codeAuth(SETTINGS.VARIABLES.ADMIN)})
            .send(userData)
            .expect(201)

        const loginSuccess = await req
            .post(SETTINGS.PATH.AUTH + '/login')
            .send(mockLoginData(1))
            .expect(200)
        expect(loginSuccess.status).toBe(200)
        expect(typeof loginSuccess.body.accessToken).toEqual('string')
    })

    it('should Register success', async () => {

        const registerSuccess = await req
            .post(SETTINGS.PATH.AUTH + '/registration')
            .send(mockUser(2))
            .expect(204)
        expect(registerSuccess.status).toBe(204)
    })

    it('should Resend email', async () => {

        const registerSuccess = await req
            .post(SETTINGS.PATH.AUTH + '/registration')
            .send(mockUser(3))
            .expect(204)
        expect(registerSuccess.status).toBe(204)

        const findUser = await req
            .post(SETTINGS.PATH.USERS + `/${registerSuccess.body.id}`)


        const {email} = mockUser(3)
        const resendEmail = await req
            .post(SETTINGS.PATH.AUTH + '/registration-email-resending')
            .send({email})
            .expect(204)
        expect(resendEmail.status).toBe(204)
    })

})
