export interface Premise {
    type: string;
    geometry: {
        type: string;
        coordinates: number[][][] | number[][][][];
    };
    properties: {
        OBJECTID: number;
        SHAPE_Area: number;
        SHAPE_Length: number;
        from_api: boolean;
        ownerId: string;
        pnd_district: string;
        pnd_district_code: string;
        pnd_id: string;
        pva_huisnr1: string;
        pva_huisnr2: string;
        pva_postcode: string;
        pva_straat: string;
        reg_aard: string;
        reg_entiteit: string;
        reg_opnamedatum: number;
        reg_status: string;
        image: string;
        state: string;
        size: number;
        type: string;
    };
}
