export interface User{
    uid:string
    email:string
    password: string
    isOwner:boolean
    isAnonymous:boolean
    isOrganisation:boolean
    isRemoved?:boolean
    reasonForRemoval?:string
    name: string;
    organisationName:string
    image: string;
    phoneNumber:string;
    notificationTokens:Array<string>
}