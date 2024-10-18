import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv-flow";
import passport from "./config/passport.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import cors from "cors";
import hbs from "hbs";


import authRouter from "./routes/auth.router.js";
import viewsRouter from "./routes/views.router.js";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

connectDB();

// Determinar entorno
const isProduction = process.env.NODE_ENV === "production";

// Configuración CORS
app.use(
  cors({
    origin: isProduction ? "http://localhost:3030" : "http://localhost:8080",
    credentials: true,
  })
);

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware
app.use((req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
    next();
  })(req, res, next);
});

//vistas
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
hbs.registerPartials(path.join(__dirname, "views", "partials"));

// rutas
app.use("/auth", authRouter);
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor abierto en el puerto ${PORT}`);
});
