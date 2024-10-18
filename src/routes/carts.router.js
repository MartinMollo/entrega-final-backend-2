import { Router } from "express";
import passport from "passport";
import CartController from "../controllers/cart.controller.js";

const router = Router();

// Ruta para agregar un producto al carrito
router.post(
  "/add/:productId",
  passport.authenticate("jwt", { session: false }),
  CartController.addProductToCart
);

// Ruta para remover un producto del carrito
router.post(
  "/remove/:productId",
  passport.authenticate("jwt", { session: false }),
  CartController.removeProductFromCart
);

// Ruta para vaciar el carrito
router.post(
  "/clear",
  passport.authenticate("jwt", { session: false }),
  CartController.clearCart
);

// Ruta para obtener el carrito del usuario actual
router.get(
  "/mycart",
  passport.authenticate("jwt", { session: false }),
  CartController.getMyCart
);

// Ruta para procesar la compra del carrito
router.post(
  "/purchase",
  passport.authenticate("jwt", { session: false }),
  CartController.purchaseCart
);

export default router;
