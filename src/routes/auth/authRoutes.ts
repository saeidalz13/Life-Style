import { Router } from "express";
import {
  get_signup,
  post_signup,
} from "../../controllers/auth/signupControllers.js";
import { get_logout } from "../../controllers/auth/logoutControllers.js";
import {
  get_login,
  post_login,
} from "../../controllers/auth/loginControllers.js";

const router = Router();

router.get("/login", get_login);
router.post("/login", post_login);

router.get("/signup", get_signup);
router.post("/signup", post_signup);

router.get("/logout", get_logout);

export default router;
