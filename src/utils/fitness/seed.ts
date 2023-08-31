import { db } from "./db.server.js";

export type TPlan = {
  // Other elements in the schema.prisma are created by prisma
	title: string;
  email: string;
  days: number;
};

export type TDayPlan = {
  day: number;
};

export type TMoves = {
  title: string;
  set: number;
  rep: number;
};

