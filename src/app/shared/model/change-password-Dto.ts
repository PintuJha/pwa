export class ChangePasswordDTO {
    isEncryptionRequired!: number;
    minimumLength!: number;
    isUpperCaseMust!: number;
    isLowerCaseMust!: number;
    numericDigitRequired!: number;
    specialCharRequired!: number;
    passwordNeverExpire!: number;
    noOfExpiryDays!: number;
    expiryReminderDays!: number;
    maxPasswordHistoryCount!: number;
    maxBadLoginAttempts!: number;
    isPassMinLengthMust!: number;
    maxmumLength!: number;
    isPassMaxLengthMust!: number;
    lastPWDnotallowcount!: number;
    allowUsernameinpwd!: number;
    lastpwdmatchcount!:number;
    enablecaptcha!: number;
    email!: string;
    languageId!: number;

}