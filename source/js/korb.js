let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', () => {
  if (cart.style.right === '-100%') {
    cart.style.right = '0';
    container.style.transform = 'translateX(-400px)';
  } else {
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
  }
});

close.addEventListener('click', () => {
  cart.style.right = '-100%';
  container.style.transform = 'translateX(0)';
});

let products = null;

// Holen der Daten aus der JSON-Datei
fetch('source/json/product.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    addDataToHTML();
  });

// Zeige Daten in der Produktliste im HTML an
function addDataToHTML() {
  let listProductHTML = document.querySelector('.listProduct');
  listProductHTML.innerHTML = '';

  if (products !== null) {
    products.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.innerHTML =
        `<img src="${product.image}">
        <h2>${product.name}</h2>
        <div class="description">${product.description}</div>
        <div class="oldPrice">${product.oldPrice}€</div>
        <div class="price">${product.price}€</div>
        <button onclick="addCart(${product.id})">In den Warenkorb</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
}

let listCart = {};

// Cookie-Daten für den Warenkorb abrufen
function checkCart() {
  var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
  if (cookieValue) {
    listCart = JSON.parse(cookieValue.split('=')[1]);
  }
}
checkCart();

function addCart(productId) {
  let productCopy = JSON.parse(JSON.stringify(products));

  if (!listCart[productId]) {
    let dataProduct = productCopy.find(product => product.id === productId);
    listCart[productId] = dataProduct;
    listCart[productId].quantity = 1;
  } else {
    listCart[productId].quantity++;
  }

  let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
  document.cookie = `listCart=${JSON.stringify(listCart)}; ${timeSave}; path=/;`;
  addCartToHTML();
}

function clearCart() {
  listCart = {}; // Leert den Warenkorb, indem ein leeres Objekt zugewiesen wird
  let timeSave = "expires=Thu, 31 Dec 2025 23:59:59 UTC";
  document.cookie = `listCart=${JSON.stringify(listCart)}; ${timeSave}; path=/;`;
  addCartToHTML(); // Aktualisiert die Anzeige des Warenkorbs
}

function addCartToHTML() {
  let listCartHTML = document.querySelector('.listCart');
  listCartHTML.innerHTML = '';

  let totalHTML = document.querySelector('.totalQuantity');
  let totalQuantity = 0;

  Object.values(listCart).forEach(product => {
    if (product) {
      let newCart = document.createElement('div');
      newCart.classList.add('item');
      newCart.innerHTML = `
        <img src="${product.image}">
        <div class="content">
          <div class="name">${product.name}</div>
          <div class="description"><ul></ul></div>
          <div class="price">${product.price}€/1 product</div>
        </div>
        <div class="quantity">
          <button onclick="changeQuantity(${product.id}, '-')">-</button>
          <span class="value">${product.quantity}</span>
          <button onclick="changeQuantity(${product.id}, '+')">+</button>
        </div>`;
      listCartHTML.appendChild(newCart);
      totalQuantity += product.quantity;
    }
  });

  totalHTML.innerText = totalQuantity;
}

function changeQuantity(productId, type) {
  if (listCart[productId]) {
    if (type === '+' && listCart[productId].quantity < 10) {
      listCart[productId].quantity++;
    } else if (type === '-' && listCart[productId].quantity > 1) {
      listCart[productId].quantity--;
    }
    addCartToHTML();
  }
}
