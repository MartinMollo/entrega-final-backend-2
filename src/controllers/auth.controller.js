
import UserService from "../services/user.service.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import twilio from "twilio";


const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const loginUser = async (req, res) => {
  try {
    const token = await UserService.login(req.body.email, req.body.password);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 60 * 1000,
    });
    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error("Error en login:", error);
    res.render("login", { error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const token = await UserService.register(req.body);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 5 * 60 * 60 * 1000,
    });
    res.redirect("/realtimeproducts");
  } catch (error) {
    console.error("Error en registro:", error);
    res.render("register", { error: error.message });
  }
};

export const sendResetPassword = async (req, res) => {
  try {
    const { email, method } = req.body;
    const user = await UserService.getUserByEmail(email);

    if (!user) {
      return res.status(404).render("requestResetPassword", { error: "El usuario no fue encontrado." });
    }

    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

    await user.save();

    const resetUrl = `http://${req.headers.host}/auth/reset-password/${token}`;

    if (method === "email") {
      const mailOptions = {
        to: user.email,
        from: process.env.EMAIL_USERNAME,
        subject: "Recuperación de contraseña",
        text: `Recibiste este correo porque solicitaste restablecer tu contraseña.\n\n
              Por favor pega el enlace en tu navegador desde tu pc para completar el proceso:\n\n
              ${resetUrl}\n\n
              Si no solicitaste este correo, ignóralo.\n`,
      };
      await transporter.sendMail(mailOptions);
    } else if (method === "sms") {
      const smsOptions = {
        body: `Por favor pega el enlace en tu navegador desde tu pc para completar el proceso: ${resetUrl}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: user.phone,
      };

      try {
        const message = await client.messages.create(smsOptions);
        console.log("Mensaje enviado correctamente:", message.sid);
      } catch (error) {
        console.error("Error al enviar SMS:", error);
        return res.status(500).render("requestResetPassword", { error: "Error al enviar SMS." });
      }
    }

    // Redirigimos a una vista de confirmación
    res.render("resetConfirmation", { message: "Se ha enviado un enlace de recuperación a tu correo electrónico o SMS." });
  } catch (error) {
    console.error("Error al enviar el enlace de recuperación:", error);
    res.status(500).render("requestResetPassword", { error: "Error al enviar el enlace de recuperación." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await UserService.getUserByToken(token);

    if (!user) {
      return res.status(400).render("resetPassword", {
        error: "El token es inválido o el usuario no fue encontrado.",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).render("resetPassword", {
        error: "El token ha expirado.",
      });
    }

    const hashedPassword = await UserService.hashPassword(newPassword);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Pasamos una variable de éxito al redirigir a la vista de login
    res.render("login", { passwordResetSuccess: true });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).render("resetPassword", {
      error: "Error al restablecer la contraseña.",
    });
  }
};