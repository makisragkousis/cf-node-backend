import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
import { validateEmail } from "../middlewares/validateEmail.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { hasAdminRole } from "../middlewares/user.middleware.js";
const router = Router();

router.get("/", userCtrl.getAll);
router.get("/email/:email", validateEmail(), userCtrl.getOneByEmail);
router.post(
  "/",
  authenticate,
  hasAdminRole,
  validate(createUserSchema),
  userCtrl.create,
);
router.put("/:username", validate(updateUserSchema), userCtrl.update);
router.delete("/:username", userCtrl.remove);
export default router;
