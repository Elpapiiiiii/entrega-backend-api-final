const socket = io();

const productForm = document.getElementById("productForm");
const deleteForm = document.getElementById("deleteForm");
const productsList = document.getElementById("productsList");

socket.on("updateProducts", (products) => {
  productsList.innerHTML = "";

  products.forEach((product) => {
    const li = document.createElement("li");
    li.textContent = `ID: ${product.id} | ${product.title} | $${product.price}`;
    productsList.appendChild(li);
  });
});

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(productForm);

  const product = {
    title: formData.get("title"),
    description: formData.get("description"),
    code: formData.get("code"),
    price: Number(formData.get("price")),
    status: formData.get("status") === "true",
    stock: Number(formData.get("stock")),
    category: formData.get("category"),
    thumbnails: formData.get("thumbnails")
      ? [formData.get("thumbnails")]
      : []
  };

  const response = await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(product)
  });

  const result = await response.json();

  if (result.status === "success") {
    productForm.reset();
  } else {
    alert(result.error);
  }
});

deleteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(deleteForm);
  const id = formData.get("id");

  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE"
  });

  const result = await response.json();

  if (result.status === "success") {
    deleteForm.reset();
  } else {
    alert(result.error);
  }
});