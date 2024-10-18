import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controller.js";

const router = Router();

// Ruta para obtener todos los usuarios
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  UserController.getAllUsers
);

// Ruta para obtener un usuario por su ID
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.getUserById
);

// Ruta para actualizar un usuario por su ID
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.updateUser
);

// Ruta para eliminar un usuario por su ID
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  UserController.deleteUser
);

// Ruta para cambiar la contraseña de un usuario por su ID
router.put(
  "/:id/password",
  passport.authenticate("jwt", { session: false }),
  UserController.changeUserPassword
);

// Ruta para actualizar el rol de un usuario por su ID
router.put(
  "/:id/role",
  passport.authenticate("jwt", { session: false }),
  UserController.updateUserRole
);

export default router;

