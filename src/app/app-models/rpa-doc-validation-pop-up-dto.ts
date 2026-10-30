import { fieldDataDTO } from "./field-data-dto"

export class rpaDocValidationPopUpDTO {
    filePath!: string
    validationGroupId!: number
    validationGroupName!: string
    validationGroupStatus!: string
    order!: number
    fieldData!: fieldDataDTO[]
}