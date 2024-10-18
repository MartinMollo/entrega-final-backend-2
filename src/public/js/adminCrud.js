document.addEventListener("DOMContentLoaded", function () {
    const deleteButtons = document.querySelectorAll(".deleteProduct");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        if (confirm("¿Seguro que deseas eliminar este producto?")) {
          fetch(`/api/products/${productId}`, {
            method: "DELETE",
          }).then((response) => {
            if (response.ok) {
              alert("Producto eliminado");
              location.reload();
            } else {
              alert("Error al eliminar producto");
            }
          });
        }
      });
    });
  
    const editButtons = document.querySelectorAll(".editProduct");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.getAttribute("data-id");
        fetch(`/api/products/${productId}`)
          .then((response) => response.json())
          .then((data) => {
            document.getElementById("productId").value = data.payload._id;
            document.getElementById("title").value = data.payload.title;
            document.getElementById("description").value =
              data.payload.description;
            document.getElementById("code").value = data.payload.code;
            document.getElementById("price").value = data.payload.price;
            document.getElementById("stock").value = data.payload.stock;
            document.getElementById("category").value = data.payload.category;
          });
      });
    });
  
    document
      .getElementById("productForm")
      .addEventListener("submit", function (event) {
        event.preventDefault();
  
        const productId = document.getElementById("productId").value;
        const method = productId ? "PUT" : "POST";
        const url = productId ? `/api/products/${productId}` : "/api/products";
  
        const productData = {
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          code: document.getElementById("code").value,
          price: parseFloat(document.getElementById("price").value),
          stock: parseInt(document.getElementById("stock").value, 10),
          category: document.getElementById("category").value,
        };
  
        fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }).then((response) => {
          if (response.ok) {
            alert("Producto guardado");
            location.reload();
          } else {
            alert("Error al guardar producto");
          }
        });
      });
  });
  