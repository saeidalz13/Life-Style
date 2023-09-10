import jwt from "jsonwebtoken";
import {
  HTTPCodes,
  TDecodedToken,
  TDecodedError,
  secretKey,
  stringOrVoid,
} from "../../globalConstants.js";
import { db } from "../../utils/fitness/db.server.js";
import { TPlanCreate, TDayPlanCreate } from "../../utils/fitness/seed.js";
import {
  TPlanFetched,
  TDayPlanFetched,
  TClientDataDesingPlan,
  TDayPlan
} from "../../utils/fitness/constants.js";
import { Request, Response } from "express";

// const Plan1: TPlan = {
//   title: "PlanSaeid",
//   userID: "saeidalz96@gmail.com",
//   days: 3,
// };

// async function main() {
//   //   const user = await db.plan.create({ data: Plan1 });

//   // Find all the users (as an array)
//   const users = await db.plan.findMany();

//   console.log(users);
// }

// main()
//   .then(() => console.log("Successful operation"))
//   .catch((error) => console.error(error))
//   .finally(async () => {
//     await db.$disconnect();
//   });

const extract_token = (req: Request): stringOrVoid => {
  const token = req.cookies.jwt;
  if (!token) {
    console.log("Fetching the token failed, redirecting to login page");
    return;
  }
  return token;
};

const create_fitplan = async (
  planData: TPlanCreate
): Promise<TPlanCreate | void> => {
  try {
    const createdPlan = await db.plan.create({ data: planData });
    return createdPlan;
  } catch (error) {
    console.log("Creating a new plan failed!", error);
    return;
  }
};

const create_dayplan = async (
  dayPlan: TDayPlanFetched
): Promise<TDayPlanCreate | void> => {
  try {
    const createdDayPlan = await db.dayPlan.create({
      data: dayPlan,
    });
    return createdDayPlan;
  } catch (error) {
    console.log(error);
    return;
  }
};

const create_moves = async (dayPlanMoves: Array<TDayPlan>): Promise<any|void> => {
  try {
    let allCreatedMoves: any = []
    dayPlanMoves.forEach(async (row) => {
      if (row) {
        const createdMoves = await db.moves.create({
          data: row,
        });
        allCreatedMoves.push(createdMoves)
      }
    })
    return allCreatedMoves
  } catch (error) {
    console.log(error)
    return;
  }
}

// Verify token function
const verifyToken = (token: string): Promise<TDecodedToken> => {
  return new Promise((resolve, reject) => {
    if (!secretKey) {
      console.log("Error in fetching secret key to verify the user");
      return;
    }
    jwt.verify(
      token,
      secretKey,
      (err: TDecodedError, decodedToken: TDecodedToken) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(decodedToken);
        }
      }
    );
  });
};

const fetch_one_plan = async (
  planID: string
): Promise<TPlanFetched | null | {}> => {
  try {
    const plan = await db.plan.findFirst({
      where: { id: planID },
    });
    return plan;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const fetch_plans = async (
  userID: string
): Promise<Array<TPlanFetched> | unknown> => {
  try {
    const plans = await db.plan.findMany({
      where: { userID: userID },
    });
    return plans;
  } catch (error) {
    return error;
  }
};

export const get_show_plan = async (req: Request, res: Response) => {
  try {
    const planID = req.params.id;
    const plan = await fetch_one_plan(planID);

    return res.status(HTTPCodes.OK).render("fitness/showPlan", {
      title: "Plan",
      plan: plan,
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTPCodes.BadRequest).redirect("/login");
  }
};

export const get_fitness_index = async (req: Request, res: Response) => {
  try {
    const token = extract_token(req);
    if (!token) {
      return res.status(HTTPCodes.BadRequest).redirect("/login");
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken || typeof decodedToken === "string") {
      console.log("Type of decodedToken is not valid to obtain the userID");
      return res.status(HTTPCodes.InternalServerError).redirect("/login");
    }

    if (!("userID" in decodedToken)) {
      console.log("userID did not exist in decodedToken");
      return res.status(HTTPCodes.InternalServerError).redirect("/login");
    }

    const userID = decodedToken["userID"];
    const plans = await fetch_plans(userID);

    return res.status(HTTPCodes.OK).render("fitness/index", {
      title: "Fitness",
      plans: plans,
    });
  } catch (error) {
    console.log("Rendering fitness index page failed!", error);
    return res.status(HTTPCodes.BadRequest).redirect("/login");
  }
};

export const get_design_plan = async (req: Request, res: Response) => {
  try {
    const planID = req.params.id;
    const plan = await fetch_one_plan(planID);

    if (plan && "days" in plan) {
      return res.status(HTTPCodes.Accepted).render("fitness/designPlan", {
        title: "Design Plan",
        days: plan.days,
      });
    }

    console.log("Failed to retrieve any plans with the fetched planID");
    return res.status(HTTPCodes.NotFound).redirect("/fitness");
  } catch (error) {
    console.log("Rendering fitness index page failed!", error);
    return res.status(HTTPCodes.BadRequest).redirect("/login");
  }
};

export const post_fitness_plan = async (req: Request, res: Response) => {
  const newPlan = req.body;
  const token = extract_token(req);

  if (!token) {
    return res.status(HTTPCodes.BadRequest).redirect("/login");
  }
  if (!newPlan) {
    return res.status(HTTPCodes.InternalServerError).redirect("/login");
  }

  const decodedToken = await verifyToken(token);
  if (decodedToken && typeof decodedToken !== "string") {
    if ("userID" in decodedToken) {
      const userID = decodedToken["userID"];
      newPlan["userID"] = userID;

      try {
        const createdPlan = await create_fitplan(newPlan);
        if (!createdPlan) {
          let errors = { msg: "Plan creation failed!" };
          await db.$disconnect();
          return res.status(HTTPCodes.BadRequest).json({ errors });
        }

        await db.$disconnect();

        if ("id" in createdPlan) {
          let success = { id: createdPlan["id"] };
          return res.status(HTTPCodes.Created).json({ success });
        }
      } catch (error) {
        console.log(error);
        let errors = { msg: "Unexpected error! Try again later" };
        return res.status(HTTPCodes.BadRequest).json({ errors });
      }
    }
  }
};

export const post_design_plan = async (req: Request, res: Response) => {
  let dayPlan = {} as TDayPlanFetched
  const clientData = req.body as TClientDataDesingPlan;
  dayPlan.planID = clientData.planID
  dayPlan.day = clientData.day
  
  const dayPlanCreated = await create_dayplan(dayPlan)
  if (!dayPlanCreated) {
    const errors = {msg: "Something went wrong; Try again!"}
    return res.status(HTTPCodes.InternalServerError).json({errors})
  }
  const dayPlanCreatedID = dayPlanCreated.id
  const dayPlanMoves = clientData.dayPlanMoves

  for (let i = 0; i < dayPlanMoves.length; i++) {
    let row = dayPlanMoves[i]
    row["dayPlanId"] = dayPlanCreatedID
    dayPlanMoves[i] = row
  }

  const allCreatedMoves = create_moves(dayPlanMoves)
  console.log(allCreatedMoves)
  return;
};
