import { fieldDataDTO } from "./field-data-dto"
import { fieldTableDataDTO } from "./field-table-data-dto"

export class viewDocumentPopUpDTO {
    validationGroupId!: number
    validationGroupName!: string
    validationGroupStatus!: string
    order!: number
    fieldData!: fieldDataDTO[]
    fieldTableData!: fieldTableDataDTO[] | null
}