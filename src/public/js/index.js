function fetchProducts(page = 1) {
    fetch(`/api/products?page=${page}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          window.location.href = "/auth/login";
          return;
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          renderProducts(data.payload.docs);
          setupPagination(data.payload.totalPages, page);
        }
      })
      .catch((error) => console.error("Error al obtener productos:", error));
  }
  
  function renderProducts(products) {
    const productsList = document.getElementById("products");
    productsList.innerHTML = "";
  
    products.forEach((product) => {
      const productItem = document.createElement("div");
      productItem.className = "col-md-4";
      productItem.innerHTML = `
        <div class="card mb-4 shadow-sm">
          ${
            product.thumbnails && product.thumbnails[0]
              ? `<img src="${product.thumbnails[0]}" class="card-img-top" alt="${product.title}">`
              : '<img src="https://via.placeholder.com/150" class="card-img-top" alt="Imagen de producto">'
          }
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text">${product.description}</p>
            <p class="card-text"><strong>Precio:</strong> $${product.price}</p>
            <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
            <button class="btn btn-sm btn-success" onclick="addToCart('${
              product._id
            }', ${product.stock})">Agregar al Carrito</button>
          </div>
        </div>`;
      productsList.appendChild(productItem);
    });
  }
  
  function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
  
    for (let page = 1; page <= totalPages; page++) {
      const pageItem = document.createElement("li");
      pageItem.className = `page-item ${page === currentPage ? "active" : ""}`;
      pageItem.innerHTML = `<a class="page-link" href="#">${page}</a>`;
      pageItem.addEventListener("click", (e) => {
        e.preventDefault();
        fetchProducts(page);
      });
      pagination.appendChild(pageItem);
    }
  }
  
  function addToCart(productId, maxQuantity) {
    Swal.fire({
      title: "Ingrese la cantidad",
      input: "number",
      inputAttributes: {
        min: 1,
        max: maxQuantity,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value < 1 || value > maxQuantity) {
          return `Ingrese una cantidad entre 1 y ${maxQuantity}`;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = parseInt(result.value);
        fetch(`/api/carts/add/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Producto agregado al carrito",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchCart();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al agregar al carrito",
              });
            }
          })
          .catch((error) => console.error("Error al agregar al carrito:", error));
      }
    });
  }
  
  async function purchaseCart() {
    try {
      const response = await fetch("/api/carts/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "¡Compra Exitosa!",
          text: result.message,
          confirmButtonText: 'OK'
        }).then(() => {
          document.getElementById('cart-items').innerHTML = '';
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en la compra",
          text: result.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al procesar la compra.",
      });
    }
  }
  
  function clearCart() {
    fetch("/api/carts/clear", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Carrito vaciado correctamente",
            showConfirmButton: false,
            timer: 1500,
          });
          fetchCart();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al vaciar el carrito",
          });
        }
      })
      .catch((error) => console.error("Error al vaciar el carrito:", error));
  }
  
  function fetchCart() {
    fetch("/api/carts/mycart", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          renderCart(data.cart);
        }
      })
      .catch((error) => console.error("Error al obtener el carrito:", error));
  }
  
  function renderCart(cart) {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let totalCartPrice = 0;
  
    if (cart.products.length > 0) {
      cart.products.forEach((item) => {
        const totalPrice = item.product.price * item.quantity;
        totalCartPrice += totalPrice;
  
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <div>
            ${item.product.title} - ${item.quantity} unidad(es)
            <br>
            <small>Precio total: $${totalPrice.toFixed(2)}</small>
          </div>
          <div>
            <button class="btn btn-sm btn-danger" onclick="removeFromCart('${
              item.product._id
            }', ${item.quantity})">Eliminar</button>
          </div>
        `;
        cartItems.appendChild(li);
      });
  
      const totalLi = document.createElement("li");
      totalLi.className =
        "list-group-item d-flex justify-content-between align-items-center font-weight-bold";
      totalLi.innerHTML = `
        Total del Carrito:
        <span>$${totalCartPrice.toFixed(2)}</span>
      `;
      cartItems.appendChild(totalLi);
    } else {
      cartItems.innerHTML =
        '<li class="list-group-item">Tu carrito está vacío</li>';
    }
  }
  
  function removeFromCart(productId, maxQuantity) {
    Swal.fire({
      title: "Ingrese la cantidad a eliminar",
      input: "number",
      inputAttributes: {
        min: 1,
        max: maxQuantity,
        step: 1,
      },
      inputValue: 1,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value || value < 1 || value > maxQuantity) {
          return `Ingrese una cantidad entre 1 y ${maxQuantity}`;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = parseInt(result.value);
        fetch(`/api/carts/remove/${productId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire({
                icon: "success",
                title: "Producto eliminado del carrito",
                showConfirmButton: false,
                timer: 1500,
              });
              fetchCart();
            } else {
              Swal.fire({
                icon: "error",
                title: "Error al eliminar del carrito",
              });
            }
          })
          .catch((error) =>
            console.error("Error al eliminar del carrito:", error)
          );
      }
    });
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
    fetchCart();
  });
  