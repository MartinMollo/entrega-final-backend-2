import CartDAO from "../dao/cart.dao.js";
import ProductDAO from "../dao/product.dao.js";

class CartService {
  async getOrCreateCartByUserId(userId) {
    return await CartDAO.getOrCreateCartByUserId(userId);
  }

  async addProductToCart(userId, productId, quantity) {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a cero");
    }

    const product = await ProductDAO.getProductById(productId);
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    if (quantity > product.stock) {
      throw new Error("La cantidad supera el stock disponible");
    }

    return await CartDAO.addProductToCart(userId, productId, quantity);
  }

  async removeProductFromCart(userId, productId, quantity) {
    if (quantity <= 0) {
      throw new Error("La cantidad debe ser mayor a cero");
    }

    const cart = await CartDAO.getCartByUserId(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const item = cart.products.find(
      (p) => p.product._id.toString() === productId
    );

    if (!item) {
      throw new Error("El producto no está en el carrito");
    }

    if (quantity > item.quantity) {
      throw new Error("La cantidad supera la cantidad en el carrito");
    }

    return await CartDAO.removeProductFromCart(userId, productId, quantity);
  }

  async clearCart(userId) {
    return await CartDAO.clearCart(userId);
  }
}

export default new CartService();