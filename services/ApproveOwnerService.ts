import {getAuth} from "firebase/auth";
import {getDatabase, push, ref, set} from "firebase/database";
import {getLoggedInUser, updateUserPhoneNumber} from "./UserService";
import {getDownloadURL, getStorage, ref as refStorage, uploadBytes} from "firebase/storage";

export interface AddApprovalProps{
    premisesId: number
    fileUrl: string,
    phoneNumber:string
}

export async function addApproval({premisesId, fileUrl, phoneNumber}:AddApprovalProps){
    const db = getDatabase()
    const storage = getStorage()

    await updateUserPhoneNumber(phoneNumber)

    const user = await getLoggedInUser()

    const approveOwnerFileRef = refStorage(storage, `approveOwner/${user?.uid}/${premisesId}`);

    const file = await fetch(fileUrl)
    const bytes = await file.blob()

    await uploadBytes(approveOwnerFileRef, bytes)

    const downloadUrl = await getDownloadURL(approveOwnerFileRef)

    const newRef = push(ref(db, "ApproveRequests"));
    await set(newRef, {
        userId: user!.uid,
        premiseId: premisesId,
        fileUrl: downloadUrl,
    });
}