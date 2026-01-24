export interface ItemWithQuantity {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface ExportedAnswer {
  response: string;
  usingItem: boolean;
  selectedItems: ItemWithQuantity[];
  subAnswers: ExportedAnswer[];
}
