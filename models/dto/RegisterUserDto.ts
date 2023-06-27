export interface RegisterUserDto{
    email: string,
    password: string,
    repeatPassword: string
    isOwner:boolean
    isAnonymous:boolean
    notificationToken:string
}