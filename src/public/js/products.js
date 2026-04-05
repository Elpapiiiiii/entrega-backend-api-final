// products.js
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  // 🔹 Necesitamos tu cartId aquí
  const cartId = "69d27b2bfe69bac31fdeb7da"; // <- pon tu ID del carrito

  buttons.forEach(btn => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;

      try {
        const res = await fetch(`/api/carts/${cartId}/products/${productId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ quantity: 1 }) // 🔹 cantidad por defecto
        });

        const data = await res.json();

        if (data.status === "success") {
          alert("Producto agregado al carrito!");
        } else {
          alert("Error: " + data.message);
        }

      } catch (err) {
        console.error(err);
        alert("Error al agregar producto");
      }
    });
  });
});