import {UserInstance} from "../../../interfaces/users.interface";

export class CreateUserInfoDto {
    public userId: string;
    public email: string;
    public login: string;

    constructor(model: UserInstance) {
        this.userId = model._id;
        this.email = model.email;
        this.login = model.login;
    }
}
