export interface ItemOption {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  _uid?: string;
}

export interface ModalUsingItemProps {
  onClose: () => void;
  onSave: (items: ItemOption[]) => void;
  initialItems?: ItemOption[];
}
