export type TPlanCreate = {
  // Other elements in the schema.prisma are created by prisma
	title: string;
  userID: string;
  days: number;
};

export type TDayPlanCreate = {
  id: string
  planID: string;
  day: number;
};

export type TMoves = {
  title: string;
  set: number;
  rep: number;
};

