import { Router } from "express";
import * as homeRoutes from "../../controllers/home/homeControllers.js";
const router = Router();


router.get("/", homeRoutes.get_home);

export default router;
