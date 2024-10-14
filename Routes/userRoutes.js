import express from "express";
import { isAuth } from "../utils/authentication.js";
import { generate, shorturls, dashboard, redirectUrl } from "../controllers/userControllers.js";

const router = express.Router();

//User routes
router.post("/", isAuth, dashboard);
router.post("/generate", isAuth, generate);
router.post("/shorturls", isAuth, shorturls);
router.get("/shorturls/:shorturl", redirectUrl);

export default router;