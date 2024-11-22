import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./src/db/connectDB.js";
import userRoute from "./src/router/user.route.js";
import categoryRouter from "./src/router/category.route.js";
import uploadeImageRouter from "./src/router/uploade.route.js";
import subCategoryRoute from "./src/router/subCategory.route.js";
import productRouter from "./src/router/product.route.js";

// middel
const app = express();
const port = 8080;
app.use(
  cors({
    origin: process.env.URL,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

connectDB().then(() =>
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
);

//

app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/file", uploadeImageRouter);
app.use("/api/v1/subcategory" , subCategoryRoute );
app.use("/api/v1/product" , productRouter );
