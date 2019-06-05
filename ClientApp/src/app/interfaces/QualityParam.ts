export interface QualityParam {
    paramType: ParamTypes;
    paramImportancePrecent: number;
}

export enum ParamTypes {
    price,
    totalTripLength,
    numberOfStops
}
