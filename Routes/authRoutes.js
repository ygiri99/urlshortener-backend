import express from 'express';
import { register, signin, signout, forgotPassword, resetPassword, activate } from "../controllers/authControllers.js";

const router = express.Router();

//AUTHENTICATION routes
router.post("/register", register);
router.post("/activate", activate);
router.post("/signin", signin);
router.get("/signout", signout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;