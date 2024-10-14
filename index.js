import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./DB/connection.js";
import authRouter from "./Routes/authRoutes.js";
import userRouter from "./Routes/userRoutes.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

db();

app.get("/server", (req, res) => {
    res.status(200).send(`URL Shortener server is running`);
})

app.use(authRouter);
app.use(userRouter);

const PORT = process.env.PORT || 8008;

app.listen(PORT, () => {
    console.log(`urlshortener server is running at ${PORT}`);
})
