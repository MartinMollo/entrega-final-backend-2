import productModel from "../models/product.model.js";

class ProductDAO {
  async getAllProductsPaginated(options) {
    return await productModel.paginate({}, options);
  }

  async getAllProducts() {
    return await productModel.find();
  }

  async getProductById(id) {
    return await productModel.findById(id);
  }

  async getProductByCode(code) {
    return await productModel.findOne({ code });
  }

  async createProduct(productData) {
    const newProduct = new productModel(productData);
    return await newProduct.save();
  }

  async updateProduct(id, data) {
    return await productModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteProduct(id) {
    return await productModel.findByIdAndDelete(id);
  }
}

export default new ProductDAO();
