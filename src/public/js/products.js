const cartId = "69d27b2bfe69bac31fdeb7da";

// INIT
window.addEventListener("DOMContentLoaded", () => {
  loadCartCount();
  loadCartTotal();
});

// CONTADOR
async function loadCartCount() {
  try {
    const res = await fetch(`/api/carts/${cartId}`);
    const data = await res.json();

    let total = 0;
    data.payload.products.forEach(p => total += p.quantity);

    const el = document.getElementById("cart-count");
    if (el) el.innerText = total;

  } catch (error) {
    console.error(error);
  }
}

// TOTAL $
async function loadCartTotal() {
  try {
    const res = await fetch(`/api/carts/${cartId}`);
    const data = await res.json();

    let total = 0;

    data.payload.products.forEach(p => {
      if (p.product?.price) {
        total += p.product.price * p.quantity;
      }
    });

    const el = document.getElementById("cart-total");
    if (el) el.innerText = total;

  } catch (error) {
    console.error(error);
  }
}

// AGREGAR
async function addToCart(productId) {
  const cartId = "69d27b2bfe69bac31fdeb7da";

  console.log("Agregando producto:", productId);

  try {
    const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ quantity: 1 })
    });

    const data = await response.json();
    console.log("RESPUESTA:", data);

    if (!response.ok) {
      throw new Error(data.error || "Error al agregar");
    }

    alert("🛒 Producto agregado correctamente");

    loadCartCount();

  } catch (error) {
    console.error("ERROR:", error);
    alert("❌ No se pudo agregar");
  }
}

// ELIMINAR
async function removeFromCart(productId) {
  if (!productId) {
    alert("❌ ID inválido");
    return;
  }

  console.log("Eliminando:", productId);

  try {
    const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    alert("❌ Eliminado");

    location.reload();

  } catch (error) {
    console.error(error);
  }
}

// CHECKOUT
async function checkout() {
  try {
    const res = await fetch(`/api/carts/${cartId}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    alert("✅ Compra finalizada");

    window.location.href = "/products";

  } catch (error) {
    console.error(error);
  }
}