const manageBasketDisplay = () => {
  //Vérifier si le panier possède au moins une fourniture :
  if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
    document.getElementsByClassName("basketPage").parentNode.hidden = true;
  } else {
    document.getElementsByClassName("basketPage").parentNode.hidden = false;
    }
}
  

const getFurniture = (id) => {
  fetch("http://localhost:9000/api/furniture/" + id)
    .then(response => response.json())
    .then(data => {
      showFurniture(data);
      // ecouter clics sur le bouton addToBasket
      let addItemtoBasket = document.getElementById("addToBasket");
      addItemtoBasket.addEventListener("click", function () {addToBasket(data)}, false);
      addItemtoBasket.addEventListener("click", function(){
        document.getElementById('confirmText').style.display = 'block';
        setTimeout(function(){
          document.getElementById('confirmText').style.display = 'none';
        }, 1000);
      })
    })
}

const showFurniture = (data) => {
  // Recuperation elements
  let name = document.getElementById("name"),
    price = document.getElementById("price"),
    description = document.getElementById("description"),
    image = document.getElementById("image"),
    selectVarnish = document.querySelector("select");

    // Remplissage elements
  name.appendChild(document.createTextNode(data.name));
  image.src = data.imageUrl;
  price.appendChild(document.createTextNode((data.price / 100).toLocaleString("en") + "$"));
  description.appendChild(document.createTextNode(data.description));
  for (i = 0; i < data.varnish.length; i++) {
      let option = document.createElement("option");
      option.textContent = data.varnish[i];
      selectVarnish.appendChild(option);
  }
}

const addToBasket = (data) => {
  //Création du panier dans le localStorage s'il n'existe pas déjà
  if (typeof localStorage.getItem("basket") !== "string") {
    let basket = [];
    localStorage.setItem("basket", JSON.stringify(basket));
  }
  //Récupérer les informations de la fourniture
  data.selectedVarnish = document.querySelector("option:checked").innerText;
  data.selectedQuantity = document.querySelector("input").value;
  delete data.varnish;
  //création d'une variable pour manipuler le panier
  let basket = JSON.parse(localStorage.getItem("basket"));
  //Vérification que l'item n'existe pas déjà dans le panier
  let isThisItemExist = false;
  let existingItem;
  for (let i = 0; i < basket.length; i++) {
    if (data._id === basket[i]._id && data.price === basket[i].price && data.selectedVarnish === basket[i].selectedVarnish) {
      isThisItemExist = true;
      existingItem = basket[i];
    }
  }
  //Ajouter la furniture au panier
  if (isThisItemExist === false) {
    basket.push(data);
    localStorage.setItem("basket", JSON.stringify(basket));
  } else {
    existingItem.selectedQuantity = parseInt(existingItem.selectedQuantity, 10) + parseInt(data.selectedQuantity, 10);
    localStorage.setItem("basket", JSON.stringify(basket));
  }
  manageBasketDisplay();
}

let params = (new URL(document.location)).searchParams;
let id = params.get("id");
getFurniture(id);
manageBasketDisplay();