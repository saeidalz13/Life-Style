import { db } from "../../utils/fitness/db.server.js";
import { TPlan } from "../../utils/fitness/seed.js";

const Plan1: TPlan = {
  title: "PlanSaeid",
  email: "saeidalz96@gmail.com",
  days: 3,
};

async function main() {
//   const user = await db.plan.create({ data: Plan1 });

  // Find all the users (as an array)
  const users = await db.plan.findMany()
  
  console.log(users)
}

main()
  .then(() => console.log("Successful operation"))
  .catch((error) => console.error(error))
  .finally(async () => {
    await db.$disconnect();
  });
