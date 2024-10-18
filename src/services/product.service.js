import ProductDAO from "../dao/product.dao.js";

class ProductService {
  async getAllProductsPaginated(page) {
    const options = {
      page: parseInt(page, 10),
      limit: 10,
    };
    return await ProductDAO.getAllProductsPaginated(options);
  }

  async getProductById(id) {
    const product = await ProductDAO.getProductById(id);
    if (!product) {
      throw new Error("Producto no encontrado");
    }
    return product;
  }

  async createProduct(productData) {
    const { title, code, price } = productData;

    if (price < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    const existingProduct = await ProductDAO.getProductByCode(code);
    if (existingProduct) {
      throw new Error("El código de producto ya existe");
    }

    return await ProductDAO.createProduct(productData);
  }

  async updateProduct(id, productData) {
    const existingProduct = await ProductDAO.getProductById(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    if (productData.price && productData.price < 0) {
      throw new Error("El precio no puede ser negativo");
    }

    return await ProductDAO.updateProduct(id, productData);
  }

  async deleteProduct(id) {
    const existingProduct = await ProductDAO.getProductById(id);
    if (!existingProduct) {
      throw new Error("Producto no encontrado");
    }

    return await ProductDAO.deleteProduct(id);
  }
}

export default new ProductService();