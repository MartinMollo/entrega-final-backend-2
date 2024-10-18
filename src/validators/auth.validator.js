import { body } from "express-validator";

export const validateLogin = [
  body("email").isEmail().withMessage("El correo electrónico es inválido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];

export const validateRegister = [
  body("first_name").notEmpty().withMessage("El nombre es obligatorio"),
  body("last_name").notEmpty().withMessage("El apellido es obligatorio"),
  body("email").isEmail().withMessage("El correo electrónico es inválido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("age")
    .isInt({ min: 1 })
    .withMessage("La edad debe ser un número válido"),
];
