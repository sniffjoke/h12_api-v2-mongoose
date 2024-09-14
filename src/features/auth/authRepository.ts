// import {userCollection} from "../db/mongo-db";
// import {EmailConfirmationModel} from "./usersRepository";
//
//
// export const authRepository = {
//
//     async updateUserWithResendActivateEmail(email: string, emailConfirmation: EmailConfirmationModel) {
//         const updateUserInfo = await userCollection.updateOne({email}, {$set: {emailConfirmation}});
//         return updateUserInfo
//     },
//
//     async checkActivateEmailByCode(confirmationCode: string) {
//         const checkActivate = await userCollection.findOne({'emailConfirmation.confirmationCode': confirmationCode})
//         return checkActivate;
//     },
//
//     async toActivateEmail(confirmationCode: string) {
//         const updateEmail = await userCollection.findOneAndUpdate(
//             {'emailConfirmation.confirmationCode': confirmationCode},
//             {$set: {emailConfirmation: {isConfirmed: true}}}
//         )
//         return updateEmail
//     }
//
// }

import {userModel} from "../../models/usersModel";
import {EmailConfirmationModel} from "../../interfaces/services.interface";

class AuthRepository {

    public users = userModel

    async updateUserWithResendActivateEmail(email: string, emailConfirmation: EmailConfirmationModel) {
        const updateUserInfo = await this.users.updateOne({email}, {$set: {emailConfirmation}});
        return updateUserInfo
    }

    async checkActivateEmailByCode(confirmationCode: string) {
        const checkActivate = await this.users.findOne({'emailConfirmation.confirmationCode': confirmationCode})
        return checkActivate;
    }

    async toActivateEmail(confirmationCode: string) {
        const updateEmail = await this.users.findOneAndUpdate(
            {'emailConfirmation.confirmationCode': confirmationCode},
            {$set: {emailConfirmation: {isConfirmed: true}}}
        )
        return updateEmail
    }

    async updateUserWithRecoveryCode(email: string, recoveryCode: string) {
        const updateUserInfo = await this.users.updateOne({email}, {$set: {'emailConfirmation.confirmationCode': recoveryCode}});
        return updateUserInfo
    }

}

export const authRepository = new AuthRepository();
