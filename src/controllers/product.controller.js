import ProductService from "../services/product.service.js";
class ProductController {
  async getAllProducts(req, res) {
    try {
      const { page = 1 } = req.query;
      const products = await ProductService.getAllProductsPaginated(page);
      res.json({ status: "success", payload: products });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener productos" });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (product) {
        res.json({ status: "success", payload: product });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al obtener el producto:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al obtener el producto" });
    }
  }

  async createProduct(req, res) {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      console.error("Error al crear producto:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.id,
        req.body
      );
      if (product) {
        res.json({ status: "success", payload: product });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const result = await ProductService.deleteProduct(req.params.id);
      if (result) {
        res.json({ status: "success", message: "Producto eliminado" });
      } else {
        res
          .status(404)
          .json({ status: "error", message: "Producto no encontrado" });
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error al eliminar producto" });
    }
  }
}

export default new ProductController();
