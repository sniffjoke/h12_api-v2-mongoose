import {UserInstance} from "../../../interfaces/users.interface";

export class CreateUserDto {
    public id: string;
    public login: string;
    public email: string;
    public createdAt: string;

    constructor(model: UserInstance) {
        this.id = model._id;
        this.login = model.login;
        this.email = model.email;
        this.createdAt = model.createdAt;
    }
}
