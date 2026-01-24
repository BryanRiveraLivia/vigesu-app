import { IFullTypeInspection } from "../../types/IFullTypeInspection";

export interface GenerateStep1Props {
  inspection: IFullTypeInspection;
  loading: boolean;
  onRefresh: () => void;
}
