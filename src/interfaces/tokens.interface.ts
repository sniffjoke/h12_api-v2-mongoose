export interface TokenInstance {
    _id: string;
    userId: string;
    deviceId: string;
    refreshToken: string;
    blackList: boolean
    createdAt: string;
}
