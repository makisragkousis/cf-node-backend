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

/**
 * @openapi
 * /users:
 *  get:
 *    summary: Return all users from my mongo db
 *    tags: [Users]
 *    responses:
 *      200:
 *        description: Returns array of users
 */
router.get("/", userCtrl.getAll);

/**
 * @openapi
 * /users/email/{email}:
 *  get:
 *    summary: Get a user my email
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: email
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Returns a user by email
 *      404:
 *        description: User not found by email
 */
router.get("/email/:email", validateEmail(), userCtrl.getOneByEmail);

/**
 * @openapi
 * /users:
 *  post:
 *    summary: Creates a new user
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      201:
 *        description: User created
 */
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
