// src/shared/data/fakeTableData.ts
import { faker } from "@faker-js/faker";

export interface TableRow {
  id: number;
  selected: boolean;
  client: string;
  name: string;
  workorder: number;
  status: "success" | "error" | "warning" | "info";
}

export function generateFakeTableData(count = 20): TableRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    selected: Math.random() > 0.5,
    client: faker.person.firstName(),
    name: faker.person.lastName(),
    workorder: Math.random(),
    status: faker.helpers.arrayElement(["success", "error", "warning", "info"]),
  }));
}
