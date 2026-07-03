export interface WorkOrderFilters {
  client: string;
  status: string;
  workorder: string;
  worker: string;
  creationdate: Date | undefined;
}
