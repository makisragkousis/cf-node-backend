import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
const router = Router();

router.get("/", userCtrl.getAll);
router.get("/email/:email", userCtrl.getOneByEmail);

export default router;
