import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import { loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: User Login
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *    responses:
 *      200:
 *        description: Login Succesfull, returns JWT
 *      401:
 *        description: Wrong Credentials
 */
router.post("/login", validate(loginSchema), authCtrl.login);

router.post("/google-auth", authCtrl.googleLogin);
export default router;
