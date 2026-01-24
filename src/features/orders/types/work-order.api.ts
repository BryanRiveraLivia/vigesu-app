export interface CustomerOption {
  id: number;
  name: string;
}

export interface MechanicOption {
  id: number;
  name: string;
}

export interface ItemOption {
  id: number;
  name: string;
}

export interface WorkOrderDetail {
  observation?: string;
  quantity?: number | string;
  itemId?: number;
}
