export interface EmailConfirmationModel {
    confirmationCode?: string
    expirationDate?: string
    isConfirmed: boolean
}

export interface RecoveryPasswordModel {
    newPassword: string
    recoveryCode: string
}
