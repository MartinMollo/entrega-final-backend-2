import { Router } from "express";
import passport from "passport";
import ProductDAO from "../dao/product.dao.js";
import CartDAO from "../dao/cart.dao.js";
import { isAdmin } from "../middleware/auth.js";

const router = Router();


router.get("/", (req, res) => {
  res.render("home");
});

//ruta que renderiza los productos en tiempo real y el carrito del usuario
router.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {

      if (req.user && req.user.role === "admin") {
        return res.redirect("/admin/products");
      }

      const products = await ProductDAO.getAllProducts();
      const cart = await CartDAO.getOrCreateCartByUserId(req.user._id);

      res.render("realTimeProducts", { products, cart });
    } catch (error) {
      console.error("Error al renderizar realtimeproducts:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ruta que renderiza la vista de administrador de productos (admin)
router.get(
  "/admin/products",
  passport.authenticate("jwt", { session: false }),
  isAdmin,
  async (req, res) => {
    try {
      const products = await ProductDAO.getAllProducts();
      res.render("adminCrudProducts", { products });
    } catch (error) {
      console.error("Error al renderizar la vista de admin:", error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

// ruta que renderiza la vista de login
router.get("/auth/login", (req, res) => res.render("login"));

// ruta que renderiza la vista de registro
router.get("/auth/register", (req, res) => res.render("register"));

// ruta que renderiza la vista del usuario actual (current)
router.get(
  "/auth/current",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    res.render("current");
  }
);

// Ruta para cerrar sesión (logout)
router.get("/auth/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/auth/login");
});

export default router;

