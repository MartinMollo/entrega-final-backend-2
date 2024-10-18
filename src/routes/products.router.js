import { Router } from "express";
import passport from "passport";
import ProductController from "../controllers/product.controller.js";

const router = Router();

// Ruta para obtener todos los productos
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProductController.getAllProducts
);

// Ruta para obtener un producto por su ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ProductController.getProductById
);

// Ruta para crear un nuevo producto
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ProductController.createProduct
);

// Ruta para actualizar un producto por su ID
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ProductController.updateProduct
);

// Ruta para eliminar un producto por su ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ProductController.deleteProduct
);

export default router;

