

export class ApiError extends Error {
        status;
        field;

    constructor(status: number, message: string, field: string) {
        super(message);
        this.status = status;
        this.field = field
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизован', 'login')
    }

    static AnyUnauthorizedError(message: string): ApiError {
        return new ApiError(401, message, 'Any field')
    }

    static BadRequest(message: string, field: string) {
        return new ApiError(400, message, field);
    }

    static RateLimitError() {
        return new ApiError(429, 'Слишком частая попытка входа', 'Any field')
    }

}
