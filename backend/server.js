import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import connectMongoDB from "./config/database.js";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/user.route.js"

const app = express();
dotenv.config()
const port = process.env.PORT || 3001;
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

app.use('/api/auth', authRoutes)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`app is running on port ${port}`)
    connectMongoDB()
});
