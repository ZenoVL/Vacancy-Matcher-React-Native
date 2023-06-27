import {useMutation} from "react-query";
import {addApproval, AddApprovalProps} from "../services/ApproveOwnerService";
import {Alert} from "react-native";

export function useAddApprove(){
    const {
        isLoading,
        isError,
        mutate
    } = useMutation(
        (props:AddApprovalProps)=>addApproval(props),{
            onSuccess:()=>alert("Uw eigenaars verzoek is ingediend")
        }
    )

    return {
        isLoading,
        isError,
        mutate
    }
}