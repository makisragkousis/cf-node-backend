import express from "express";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use("/api/user", userRoutes);

export default app;
