import cartModel from "../models/cart.model.js";
class CartDAO {
  async createCart(userId) {
    return await cartModel.create({ user: userId, products: [] });
  }

  async getCartByUserId(userId) {
    return await cartModel
      .findOne({ user: userId })
      .populate("products.product");
  }

  async getOrCreateCartByUserId(userId) {
    let cart = await this.getCartByUserId(userId);
    if (!cart) {
      cart = await this.createCart(userId);
    }
    return cart;
  }

  async addProductToCart(userId, productId, quantity) {
    let cart = await this.getOrCreateCartByUserId(userId);
    const productIndex = cart.products.findIndex(
      (p) => p.product._id.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    return await cart.save();
  }

  async removeProductFromCart(userId, productId, quantity) {
    const cart = await this.getCartByUserId(userId);
    if (!cart) {
      throw new Error("Carrito no encontrado");
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product._id.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity -= quantity;

      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }

      return await cart.save();
    } else {
      throw new Error("El producto no está en el carrito");
    }
  }

  async clearCart(userId) {
    const cart = await this.getCartByUserId(userId);
    if (cart) {
      console.log("Carrito encontrado, vaciando productos para el usuario:", userId);
      cart.products = [];
      const savedCart = await cart.save();
      console.log("Carrito vaciado y guardado:", savedCart);
      return savedCart;
    } else {
      console.log("No se encontró carrito para el usuario:", userId);
    }
    return null;
  }
}

export default new CartDAO();

