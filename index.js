import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserRouter from "./src/routes/user.routes.js";
import ProductRouter from "./src/routes/product.routes.js";
import OrderRouter from "./src/routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

//* ROUTES
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/order", OrderRouter);



app.get("/", (req, res) => {
    res.send("HELLO BOSS MAN!");
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT} 🚀`);
        });
    })
    .catch((err) => {
        console.log("MONGO DB connection failed !!! ", err);
    });
