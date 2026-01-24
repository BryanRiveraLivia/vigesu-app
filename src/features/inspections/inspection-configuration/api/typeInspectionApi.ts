// 📁 src/features/inspections/inspection-configuration/api/typeInspectionApi.ts

import { axiosInstance } from "@/core/utils/axiosInstance";
import { GetTypeInspectionResponse } from "../models/typeInspection";

export interface GetTypeInspectionParams {
  Name?: string;
  PageNumber?: number;
  PageSize?: number;
}

export interface TypeInspectionItem {
  typeInspectionID: number;
  templateInspectionID: number;
  customerID: string;
  name: string;
  description: string;
  status: number;
}

export interface TypeInspectionResponse {
  items: TypeInspectionItem[];
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export const getTypeInspections = async (
  params: GetTypeInspectionParams
): Promise<GetTypeInspectionResponse> => {
  const { data } = await axiosInstance.get("/TypeInspection", { params });
  return data;
};
