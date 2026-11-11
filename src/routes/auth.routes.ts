import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import { loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

router.post("/login", validate(loginSchema), authCtrl.login);

export default router;
