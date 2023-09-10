export type TPlanFetched = {
    id: string;
    title: string;
    userID: string;
    days: number,
    createdAt: Date;
    updatedAt: Date;
}

export type TDayPlanFetched = {
    planID: string;
    day: number;
  };

export type TClientDataDesingPlan = {
    planID: string;
    day: number;
    dayPlanMoves: Array<TDayPlan>
}

export type TDayPlan = {
    title: string;
    set: number;
    rep: number
    dayPlanId: string
  }