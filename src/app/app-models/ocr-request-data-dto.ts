import { fieldDataDTO } from './field-data-dto';
import { fieldTableDataDTO } from './field-table-data-dto';

export class OcrFieldDataRequestDTO {
  invoiceId!: number;
  companyId!: number;
  validationGroupId!: number;
  validationGroupName!: string;
  fieldData?: fieldDataDTO;
  fieldTableData?: fieldTableDataDTO;
  fieldTableDataDelete?: fieldTableDataDTO;
  actionType!: string;
  appId!: string;
}
