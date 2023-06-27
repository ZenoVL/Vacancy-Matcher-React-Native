import {useMutation, useQuery} from "react-query";
import {
    getLoggedInUser, getUserData,
    loginUser,
    logoutUser,
    registerUser, updateProfilePicture, updateProfilePictureProps, updateUserDisplayName,
    updateUserEmail,
    updateUserEmailProps,
    updateUserFunction, updateUserOrganisation,
    updateUserPassword,
    updateUserPasswordProps, updateUserPhoneNumber,
    updateUserPrivacy
} from "../services/UserService";
import {RegisterUserDto} from "../models/dto/RegisterUserDto";
import {LoginUserDto} from "../models/dto/LoginUserDto";

interface useUserProps{
    onSuccess: ()=>void
}

export function useRegisterUser({onSuccess}:useUserProps){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (user:RegisterUserDto) => registerUser(user),
        {
            onSuccess: onSuccess
        }
    );

    return {
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useLoginUser({onSuccess}:useUserProps){
    const {
        mutate,
        isLoading,
        isError,
        error
    } = useMutation(
        (user:LoginUserDto) => loginUser({email: user.email, password: user.password}),
        {
            onSuccess: onSuccess
        }
    )

    return{
        mutate,
        isLoading,
        isError,
        error
    }
}

export function useGetLoggedInUser(){
    const {isLoading, isError, data, refetch} = useQuery(["loggedInUser"],getLoggedInUser)

    let isLoggedIn = false

    if(data!==null){
        isLoggedIn = true
    }

    return{
        isLoading,
        isError,
        isLoggedIn,
        data,
        refetch
    }
}

export function useGetUserData(uid:string){
    const {
        isLoading,
        isError,
        data
    } = useQuery(['getUserData', uid],()=>getUserData(uid))

    return {
        isLoading,
        isError,
        data
    }
}

export function useLogoutUser(){
    const {isLoading, isError} = useQuery(["logoutUser"],logoutUser)

    return{
        isLoading,
        isError
    }
}

export function useUpdateProfilePicture(){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (props:updateProfilePictureProps) => updateProfilePicture(props))

    return{
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useUpdateUserEmail(){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (props:updateUserEmailProps) => updateUserEmail(props))

    return{
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useUpdateUserPassword(){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (props:updateUserPasswordProps) => updateUserPassword(props))

    return{
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useUpdateUserPrivacy(){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (value: boolean) => updateUserPrivacy(value))

    return{
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useUpdateUserFunction(){
    const {
        mutate,
        isLoading,
        isError,
        isSuccess
    } = useMutation(
        (value:boolean) => updateUserFunction(value))

    return{
        mutate,
        isLoading,
        isError,
        isSuccess
    }
}

export function useUpdateUserOrganisation(){
    const {
        isLoading,
        isError,
        isSuccess,
        mutate
    } = useMutation((value:boolean)=>updateUserOrganisation(value))

    return{
        isLoading,
        isError,
        isSuccess,
        mutate
    }
}

export function useUpdateUserDisplayName(){
    const {
        isLoading,
        isError,
        isSuccess,
        mutate
    } = useMutation(
        (value:string)=>updateUserDisplayName(value))

    return{
        isLoading,
        isError,
        isSuccess,
        mutate
    }
}

export function useUpdateUserPhoneNumber(){
    const {
        isLoading,
        isError,
        isSuccess,
        mutate
    } = useMutation((value:string)=>updateUserPhoneNumber(value))

    return{
        isLoading,
        isError,
        isSuccess,
        mutate
    }
}