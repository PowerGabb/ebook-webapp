import express from "express";
import authRoutes from "./authRoutes.js";
import bookRoutes from "./bookRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import userRoutes from "./userRoutes.js";
import isAdmin from "../middlewares/isAdmin.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import paymentRoutes from "./paymentRoutes.js";
const routes = express.Router();

routes.get("/", (req, res) => {
  res.send("Hello World");
});

routes.use("/auth", authRoutes);

routes.use(authenticateToken);
routes.use("/book", bookRoutes);
routes.use("/category", categoryRoutes);
routes.use("/dashboard", isAdmin, dashboardRoutes);
routes.use("/user", userRoutes);
routes.use("/payment", paymentRoutes)



export default routes;
