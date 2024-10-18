import CartService from "../services/cart.service.js";
import Ticket from "../models/ticket.model.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

class CartController {
  async addProductToCart(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      await CartService.addProductToCart(req.user._id, productId, quantity);
      res
        .status(200)
        .json({ status: "success", message: "Producto agregado al carrito" });
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      await CartService.removeProductFromCart(
        req.user._id,
        productId,
        quantity
      );
      res
        .status(200)
        .json({ status: "success", message: "Producto eliminado del carrito" });
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async clearCart(req, res) {
    try {
      await CartService.clearCart(req.user._id);
      res
        .status(200)
        .json({ status: "success", message: "Carrito vaciado correctamente" });
    } catch (error) {
      console.error("Error al vaciar el carrito:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al vaciar el carrito" });
    }
  }

  async getMyCart(req, res) {
    try {
      const cart = await CartService.getOrCreateCartByUserId(req.user._id);
      res.json({ status: "success", cart });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener el carrito" });
    }
  }

  async purchaseCart(req, res) {
    try {
      const cart = await CartService.getOrCreateCartByUserId(req.user._id);
      const userEmail = req.user.email;

      if (!cart || cart.products.length === 0) {
        return res.status(400).json({ status: "error", message: "El carrito está vacío" });
      }

      const totalAmount = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

      const ticket = await Ticket.create({
        amount: totalAmount,
        purchaser: userEmail,
      });

      const productRows = cart.products.map(item => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.product.title}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">$${item.product.price.toFixed(2)}</td>
        </tr>
      `).join('');

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">¡Gracias por tu compra!</h2>
          <p>A continuación, te presentamos los detalles de tu compra:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Código del Ticket</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${ticket.code}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Fecha de Compra</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${ticket.purchase_datetime}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total de la Compra</th>
              <td style="border: 1px solid #ddd; padding: 8px;">$${ticket.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Comprador</th>
              <td style="border: 1px solid #ddd; padding: 8px;">${ticket.purchaser}</td>
            </tr>
          </table>

          <h3>Detalles de los productos comprados:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Producto</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Cantidad</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>

          <p style="color: #777;">Si tienes alguna duda, no dudes en contactarnos.</p>
          <p>Atentamente,<br>Tu tienda online</p>
        </div>
      `;

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: userEmail,
        subject: "Tu Ticket de Compra",
        html: htmlContent,
      };

      await transporter.sendMail(mailOptions);

      await CartService.clearCart(req.user._id);

      res.status(200).json({ status: "success", message: "Compra realizada con éxito y ticket enviado por correo." });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ status: "error", message: "Error al procesar la compra." });
    }
  }
}

export default new CartController();