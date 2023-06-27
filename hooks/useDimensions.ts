import {Dimensions} from "react-native";

const { width, height } = Dimensions.get('window')

export function useHorizontalScale(size:number):number{
    return width * (size/100)
}

export function useVerticalScale(size:number):number{
    return height * (size/100)
}