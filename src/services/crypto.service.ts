// import {hash} from "bcrypt";
// import * as bcrypt from "bcrypt";
//
//
// export const cryptoService = {
//     async hashPassword(password: string): Promise<string> {
//         const hashPassword = await hash(password, 3)
//         return hashPassword
//     },
//
//     async comparePassword(password: string, hashPassword: string): Promise<boolean> {
//         const isCompare = await bcrypt.compare(password, hashPassword)
//         return isCompare
//     }
// }


import {compare, hash} from "bcrypt";

class CryptoService {
    async hashPassword(password: string): Promise<string> {
        const hashPassword = await hash(password, 3)
        return hashPassword
    }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        const isCompare = await compare(password, hashPassword)
        return isCompare
    }
}

export const cryptoService = new CryptoService();
