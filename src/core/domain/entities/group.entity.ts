export enum GroupStatusEnum {
  Active = 0,
  Inactive = 1,
}

export const GroupStatusLabel: Record<GroupStatusEnum, string> = {
  [GroupStatusEnum.Active]: "Active",
  [GroupStatusEnum.Inactive]: "Inactive",
};

export interface Group {
  groupId: number;
  name: string;
  status: GroupStatusEnum;
}
