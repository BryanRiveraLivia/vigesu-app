export interface IUser {
  userId: number;
  userName: string;
  password: string;
  employeeId: string;
  employeeName: string;
  rol: number;
}

// Estructura esperada desde /User
export interface GetUsersResponse {
  items: IUser[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
