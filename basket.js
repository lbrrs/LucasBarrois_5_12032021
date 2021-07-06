let basketItems = JSON.parse(localStorage.getItem("basket"));
let productsID = [];

 /*const manageBasketDisplay = () => {
  //Vérifier si le panier possède au moins une fourniture :
  if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
    document.querySelector(".basketPage").parentNode.hidden = true;
  } else {
    document.querySelector(".basketPage").parentNode.hidden = false;
  }
}*/

const returnToHomePageIfUserEmptyTheBasket = () => {
  if (localStorage.getItem("basket") === null || localStorage.getItem("basket") === "[]") {
    window.location.href = "index.html";
  }
}

const getBasketItem = (i) => {
  productsID.push(basketItems[i]._id);
  // Création des éléments
  let basket = document.querySelector("#basket"),
    basketItem = document.createElement("div"),
    basketItemBody = document.createElement("div"),
    name = document.createElement("h3"),
    price = document.createElement("h4"),
    image = document.createElement("img"),
    urlPage = "product.html?id=" + basketItems[i]._id,
    selectedVarnish = document.createElement("h4"),
    quantity = document.createElement("div"),
    selectedQuantity = document.createElement("input"),
    modifyQuantityButton = document.createElement("button"),
    deleteItemButton = document.createElement("button");
    modifyQuantityButton.dataset.itemId = basketItems[i]._id;
    modifyQuantityButton.dataset.varnish = basketItems[i].selectedVarnish;
  // Remplissage des éléments
  name.appendChild(document.createTextNode(basketItems[i].name));
  image.src = basketItems[i].imageUrl;
  selectedVarnish.appendChild(document.createTextNode(basketItems[i].selectedVarnish));
  modifyQuantityButton.appendChild(document.createTextNode("Modifier la quantité"));
  deleteItemButton.appendChild(document.createTextNode("Supprimer"));
  price.appendChild(document.createTextNode((basketItems[i].price * basketItems[i].selectedQuantity / 100).toLocaleString("en") + " $"));

  //Stylisation des éléments
  basketItem.classList.add("card", "border-light", "text-center", "m-4", "basket_card");
  basketItem.setAttribute("data-id", basketItems[i]._id);
  basketItem.setAttribute("data-lense", basketItems[i].selectedVarnish);
  image.classList.add("card-img-top");
  basketItemBody.classList.add("card-body");
  name.classList.add("card-title");
  quantity.classList.add("d-flex", "flex-row");
  selectedQuantity.classList.add("form-control", "w-25");
  selectedQuantity.setAttribute("value", basketItems[i].selectedQuantity);
  modifyQuantityButton.classList.add("modifyQuantity", "btn", "btn-light", "w-75");
  modifyQuantityButton.addEventListener("click", function(event){
    modifyQuantity(this, event);
  });
  modifyQuantityButton.addEventListener("click", function(){
    document.getElementById('greenText').style.display = 'block';
    setTimeout(function(){
      window.location.reload(true);
    }, 1000);
    
  })
  deleteItemButton.classList.add("deleteItem", "btn", "btn-danger", "m-3");
  deleteItemButton.addEventListener("click", deleteItem, false);


  deleteItemButton.addEventListener('click', function(){
    document.getElementById('redText').style.display = 'block';
    setTimeout(function(){
      window.location.reload(true);
    }, 1000);
  })

  // Placement des éléments de la fourniture
  basketItemBody.appendChild(price);
  basketItemBody.appendChild(quantity);
  quantity.appendChild(selectedQuantity);
  quantity.appendChild(modifyQuantityButton);
  basketItem.appendChild(name);
  basketItem.appendChild(selectedVarnish);
  basketItem.appendChild(image);
  basketItem.appendChild(basketItemBody);
  basketItem.appendChild(deleteItemButton);

  // Placement de la fourniture dans le ul
  basket.appendChild(basketItem);
}

const basket = () => {
  for (let i = 0; i < basketItems.length; i++) {
    getBasketItem(i);
  }
  totalPrice()
}

const totalPrice = () => {
  let total = 0;
  for (let j = 0; j < basketItems.length; j++) {
    total = total + (basketItems[j].price * basketItems[j].selectedQuantity);
  }
  document.querySelector("#total").appendChild(document.createTextNode("Total : " + (total / 100).toLocaleString("en") + " $"));
}

const modifyQuantity = (mybutton, event) => {
  console.log(mybutton);
  //Sélectionner le bouton puis la carte à laquelle il appartient
  //Identifier l'item associé dans le local storage
  let itemId = mybutton.dataset.itemId;
  let itemVarnish = mybutton.dataset.varnish;
  console.log(itemId);
  for (let i = 0; i < basketItems.length; i++) {
    if (itemId === basketItems[i]._id && itemVarnish === basketItems[i].selectedVarnish) {
      basketItemIndex = i;
    }
  }
  //Modifier la quantité dans le local storage
  basketItems[basketItemIndex].selectedQuantity = event.target.previousSibling.value;
  localStorage.setItem("basket", (JSON.stringify(basketItems)));
}

const deleteItem = () => {
  //Sélectionner le bouton puis la carte à laquelle il appartient
  let itemCard = event.target.parentNode;
  //Identifier l'item associé dans le local storage
  let itemId = itemCard.getAttribute("data-id");
  let itemVarnish = itemCard.getAttribute("data-varnish");
  let basketItemIndex;
  for (let i = 0; i < basketItems.length; i++) {
    if (itemId === basketItems[i]._id && itemVarnish === basketItems[i].selectedVarnish) {
      basketItemIndex = i;
    }
  }
  //Supprimer l'item dans le local storage
  basketItems.splice(basketItemIndex, 1);
  localStorage.setItem("basket", (JSON.stringify(basketItems)));
  returnToHomePageIfUserEmptyTheBasket()
}

const checkIfFieldIsValid = (input, regExp) => {
  return input.value.match(regExp) !== null;
}

const submitPayment = () => {
  //Si la fonction a déjà été utilisée on réinitialise le formulaire
  //suppr div
  //suppr is-valid/is-invalid
  let inputs = document.querySelectorAll("input");
  for (let i = 0; i < inputs.length ; i++) {
    inputs[i].classList.remove("is-invalid");
    inputs[i].classList.remove("is-valid");

  }

  let alertMessages = document.querySelectorAll(".alertMessages");
  for (let i = 0; i < alertMessages.length ; i++) {
    alertMessages[i].remove();
  };

  //Récupérer les informations du formulaire
  let firstName = document.querySelector("#firstName"),
    lastName = document.querySelector("#lastName"),
    address = document.querySelector("#address"),
    city = document.querySelector("#city"),
    email = document.querySelector("#email");

  //Définition des expressions régulières pour la vérification de la validité des champs
  let stringRegExp = /([A-Za-z0-9_\s\-'\u00C0-\u024F]+)/;
  emailRegExp = /^([\w\-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/i;

  //Vérification de la validité des champs
  let isfirstNameValid = checkIfFieldIsValid(firstName, stringRegExp),
    isLastNameValid = checkIfFieldIsValid(lastName, stringRegExp);
    isAddressValid = checkIfFieldIsValid(address, stringRegExp);
    isCityValid = checkIfFieldIsValid(city, stringRegExp);
    isEmailValid = checkIfFieldIsValid(email, emailRegExp);

  //Alerter l'utilisateur s'il a mal rempli le formulaire
  let fields = [firstName, lastName, address, city, email],
    fieldsValidity = [isfirstNameValid, isLastNameValid, isAddressValid, isCityValid, isEmailValid],
    isAFieldInvalid = false;

  for (let i = 0; i < fields.length; i++) {
    if (!fieldsValidity[i]) { //si un champ n'est pas valide
      isAFieldInvalid = true; //un champ au moins est incorrect, sera utilisé plus loin pour empêcher la requête POST à l'API

      //Création du message à envoyer à l'utilisateur
      let message;
      if (fields[i] === document.querySelector("#firstName")) {
        message = "Le prénom est incorrect !";
      } else if (fields[i] === document.querySelector("#lastName")) {
        message = "Le nom est incorrect !";
      } else if (fields[i] === document.querySelector("#address")) {
        message = "L'adresse postale est incorrecte !";
      } else if (fields[i] === document.querySelector("#city")) {
        message = "La ville est incorrecte !";
      } else {
        message = "L'adresse mail est incorrecte !";
      }

      //Création et stylisation de l'alerte
      let alert = document.createElement("div");
      alert.appendChild(document.createTextNode(message));
      fields[i].classList.add("is-invalid");
      alert.classList.add("alertMessages", "invalid-feedback");
      fields[i].parentElement.appendChild(alert);

    } else {
      fields[i].classList.add("is-valid");
    }
  }
  //Si l'un des champs a été vidé ...
  if (isAFieldInvalid) return; //la fonction s'arrête 
  //sinon on continue

  //Les entrer dans un objet
  let contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  },
    products = productsID;
    
  //Récupérer l'orderId
  fetch('http://localhost:9000/api/furniture/order', {
    method: 'post',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contact: contact,
      products: products
    })
  })
    .then(response => response.json())
    .then(order => {
      console.log(order);
      localStorage.setItem("orderId", order.orderId);
      window.location.href = "order.html";
    })
    .catch(error => alert("Un des champ du formulaire n'est pas correct !"));
}

//manageBasketDisplay();
basket();
document.querySelector("#submitPayment").addEventListener("click", submitPayment, false);