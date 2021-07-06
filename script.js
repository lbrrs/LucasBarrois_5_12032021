const getFurnitureIndex = () => {
    fetch("http://localhost:9000/api/furniture")
    .then(
        response => {
            return response.json();
        })
    .then(
        function (data) {
            for (let i = 0; i < data.length; i++) {
                getOneFurniture(data[i]);
            }
        }
    )
}

const getOneFurniture = (furniture) => {
    let furnitures = document.querySelector(".furnitures"),
        furnitureItemBody = document.createElement("div"),
        furnitureItem = document.createElement("a"),
        name = document.createElement("h4"),
        price = document.createElement("h5"),
        description = document.createElement("p"),
        image = document.createElement("img"),
        productLink = document.getElementsByClassName("productLink"),
        urlPage = "produit.html?id=" + furniture._id;

    name.appendChild(document.createTextNode(furniture.name));
    image.src = furniture.imageUrl;
    description.appendChild(document.createTextNode(furniture.description));
    price.appendChild(document.createTextNode((furniture.price / 100).toLocaleString("en") + "$"));
    
    furnitureItem.href = urlPage;
    furnitureItem.classList.add("card", "box_shadow", "w-30", "h-100");
    image.classList.add("card-img-top");
    furnitureItemBody.classList.add("card-body");
    name.classList.add("card-title", "text-center");

    furnitureItemBody.appendChild(description);
    furnitureItemBody.appendChild(price);
    furnitureItem.appendChild(name);
    furnitureItem.appendChild(image);
    furnitureItem.appendChild(furnitureItemBody);
    furnitures.appendChild(furnitureItem);
}

getFurnitureIndex();

