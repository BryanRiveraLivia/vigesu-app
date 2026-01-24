export interface TemplateInspectionItem {
  templateInspectionId: number;
  name: string;
  filePath: string;
}

export interface TemplateInspectionResponse {
  items: TemplateInspectionItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
