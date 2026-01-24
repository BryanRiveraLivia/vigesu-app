export interface TableListProps {
  objFilter: {
    client: string;
    status: string;
    name: string;
  };
  refreshSignal?: boolean;
}
