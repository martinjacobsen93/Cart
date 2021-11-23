const videoGames = [{ // array de objetos que serán parte de cards.
        nombre: "Nintendo Switch",
        id: 1,
        fabricante: "Nintendo",
        img: "../img/nintendo2.jpg",
        precio: 70000
    },

    {
        nombre: "Nintendo Switch Limited Edition",
        id: 2,
        fabricante: "Nintendo",
        img: "../img/nintendo1.jpg",
        precio: 80000
    },

    {
        nombre: "Mario Kart Deluxe",
        id: 3,
        fabricante: "Nintendo",
        img: "../img/mariokart.jpg",
        precio: 10000
    },

    {
        nombre: "Playstation 5",
        id: 4,
        fabricante: "Sony",
        img: "../img/ps5-negra.jpg",
        precio: 200000
    },
    {
        nombre: "PS5 Eternal Blue Controller",
        id: 5,
        fabricante: "Sony",
        img: "../img/ps-controller1.jpg",
        precio: 20000
    },
    {
        nombre: "PS5 Eternal Red Controller",
        id: 6,
        fabricante: "Sony",
        img: "../img/ps-controller2.jpg",
        precio: 22000
    },
    {
        nombre: "X-Box X Series",
        id: 7,
        fabricante: "Microsoft",
        img: "../img/xbox3.jpg",
        precio: 250000
    },
    {
        nombre: "Tarjeta Gráfica RTX 3090",
        id: 8,
        fabricante: "Nvidia",
        img: "../img/rtx3090.jpg",
        precio: 350000
    }
];

$(document).ready(() => {

    videoGames.forEach((videoGame, index) => {
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card")
        cardContainer.innerHTML = `<img src="${videoGame.img}" class="card-img-top" alt="videoGame-article">
                                   <div class="card-body">
                                    <h5 class="card-title">${videoGame.nombre}</h5>
                                    <p class="card-text">Fabricante: ${videoGame.fabricante}</p>
                                    <p class="card-text">Precio: $${videoGame.precio}</p>
                                    <button class="btn btn-primary" onclick="buyItem(${index})">Sumar al carrito</button>
                                   </div>`
        $(".productos").append(cardContainer)
    });

    $(".compras").append(`<h2 id="cantidadProductos" class="text-light m-3">Productos en carrito: ${cantidadDeProductos}</h2>`);
    $(".compras").append(`<h2 id="montoTotalAPagar" class="text-light m-3">Monto a pagar: $${montoHastaAhora}</h2>`);

});

let cantidadDeProductos = 0;
let montoHastaAhora = 0;
let cart = [];

function buyItem(productIndex) {
    cantidadDeProductos++
    $("#cantidadProductos").html(`Productos en carrito: ${cantidadDeProductos}`);
    montoHastaAhora = montoHastaAhora + videoGames[productIndex].precio;
    $("#montoTotalAPagar").html(`Monto a pagar: $${montoHastaAhora}`);
    addItemToCart(productIndex);
}

function addItemToCart(productIndex) {              // Este evento es llamado al dar click en "sumar al carrito", y pushea al array cart el objeto dado, y luego lo muestra en pantalla con la función "showItems"
    const indexFound = cart.findIndex(product => product.id == videoGames[productIndex].id);
    if (indexFound === -1) {
        const productToAdd = videoGames[productIndex];
        productToAdd.cantidad = 1;
        cart.push(productToAdd);
        showItems();
    } else {
        cart[indexFound].cantidad += 1;
        showItems();
    }
}

// let totalPriceToPay = 0;

const carritoContainer = document.getElementById("carrito")

function showItems() {                      // EVENTO QUE AL DAR CLICK EN EL BOTON "Sumar a Carrito" CREA UN NUEVO ELEMENTO CON LOS DETALLES DEL PRODUCTO SELECCIONADO Y LO MUESTRA EN PANTALLA. 
    carritoContainer.className = "carrito";
    carritoContainer.innerHTML = "";
    totalPriceToPay = 0;
    if (cart.length > 0) {
        cart.forEach((product, index) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("cart-item", `cart-item${index}`, "m-2");
            let itemSubtotal = (product.precio * product.cantidad)
            itemContainer.innerHTML = `<p class="text-light text-center item-text">Producto: ${product.nombre}<p>
                                           <p class="text-light text-center item-text">Precio $${product.precio}</p>
                                           <p class="text-light text-center item-text">Cantidad: ${product.cantidad}</p>
                                           <p class="text-light text-center item-text">Subtotal: $${itemSubtotal}</p>
                                           <button class="btn btn-danger" onclick='removeItem(${index})'>Eliminar</button>`
            // totalPriceToPay = totalPriceToPay + itemSubtotal;
            $("#carrito").append(itemContainer);
        });
        $(".carrito").append("<h3 class='text-light fs-4 mt-3'>Desea finalizar su compra?</h3>")
        $(".carrito").append("<button class='finalizarCompra btn text-center' onclick='finalizarCompra()'>Finalizar Compra</button>")
        $(".finalizarCompra").css("width", "200px")
        $("#carrito").addClass("d-flex flex-column align-items-center")
    }
}

function finalizarCompra() {
    alert(`Tu compra por un monto de: $${montoHastaAhora} ha sido aprobada y realizada con éxito`);
    emptyCart()
}

function emptyCart() {  // LLAMADA EN LA FUNCIÓN DE ARRIBA "finalizarCompra", ES USADA COMO EVENTO AL APRETAR "FINALIZAR COMPRA", 
                        // EL CARRITO SE VACÍA Y LOS CONTADORES DE CANTIDAD Y MONTO SE SETEAN EN 0 DE NUEVO.

    cart = []
    montoHastaAhora = 0
    cantidadDeProductos = 0
    $("#carrito").html("");
    $("#carrito").removeClass("carrito");
    $("#montoTotalAPagar").html(`Monto a pagar: $${montoHastaAhora}`);
    $("#cantidadProductos").html(`Productos en carrito: ${cantidadDeProductos}`);
    for (const item of videoGames) {
        item.cantidad = 0;
    }
}

function removeItem(productIndex) {                                         // REMUEVO EL PRODUCTO SELECCIONADO, Y CON EL LA CANTIDAD DE PRODUCTOS SELECCIONADOS DEL MISMO.
    cantidadDeProductos = cantidadDeProductos - cart[productIndex].cantidad;
    montoHastaAhora = montoHastaAhora - (cart[productIndex].precio * cart[productIndex].cantidad)
    $("#montoTotalAPagar").html(`Monto a pagar: $${montoHastaAhora}`);     // SE RESTA EL MONTO DE DICHO PRODUCTO * CANTIDAD DEL MISMO.
    $("#cantidadProductos").html(`Productos en carrito: ${cantidadDeProductos}`); // SE RESTA A CANTIDAD DE PRODUCTOS LA CANTIDAD SELECCIONADA DE DICHO PRODUCTO.
    cart.splice(productIndex, 1);
    showItems();
    if (cart.length == 0) {             // SI LA CANTIDAD DE PRODUCTOS EN EL CARRITO ES 0, ENTONCES EL DIV "#carrito" NO SE MUESTRA EN PANTALLA.
        $("#carrito").html("");
        $("#carrito").removeClass("carrito");
    }

}

// AJAX

const URL = 'https://api.coinbase.com/v2/prices/BTC-USD/buy';   // REQUEST DE PRECIO DE BTC A USD DE API COINBASE.

$.get(URL, (response, status) => { // TRAIGO DESDE LA API DE COINBASE EL PRECIO DE BITCOIN
    if (status === "success") {
        console.log(response)
        const { data: {amount: precio }} = response;
        $(".cripto").append(`<h3 class="text-light text-center bitcoin-title">Aceptamos Bitcoin como método de pago a través del mercado P2P</h3>
                              <p class="fs-4 text-center bitcoin-price">Precio actual de Bitcoin: <span class="btc-price">USD ${precio}</span></p>`);
    }
});