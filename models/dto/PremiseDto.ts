import {Premise} from "../Premise";

export interface PremiseDto {
    premise: Premise;
    isFavorite: boolean;
    favoritesCount:number;
    isOwner: boolean;
    hasChat?: string;
    canChat: boolean;
}