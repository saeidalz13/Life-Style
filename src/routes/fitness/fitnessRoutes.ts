import { Router } from "express";
import { checkUserAuthenticated } from "../../middlewares/auth/authMiddlewares.js";
import {
  get_fitness_index,
  get_design_plan,
  get_show_plan,
  post_fitness_plan,
  post_design_plan
} from "../../controllers/fitness/fitnessControllers.js";

const router = Router();

router.get("/fitness", checkUserAuthenticated, get_fitness_index);
router.post("/fitness", post_fitness_plan);

router.get("/fitness/design-plan/:id", checkUserAuthenticated, get_design_plan)
router.post("/fitness/design-plan/:id", post_design_plan)

router.get("/fitness/show-plan/:id", checkUserAuthenticated, get_show_plan)

export default router;
