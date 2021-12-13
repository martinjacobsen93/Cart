const videoGames = [{ // array de objetos que serán parte de cards.
        nombre: "Nintendo Switch",
        id: 1,
        fabricante: "Nintendo",
        img: "./img/nintendo2.jpg",
        precio: 70000
    },

    {
        nombre: "Nintendo Switch Limited Edition",
        id: 2,
        fabricante: "Nintendo",
        img: "./img/nintendo1.jpg",
        precio: 80000
    },

    {
        nombre: "Mario Kart Deluxe",
        id: 3,
        fabricante: "Nintendo",
        img: "./img/mariokart.jpg",
        precio: 10000
    },

    {
        nombre: "Playstation 5",
        id: 4,
        fabricante: "Sony",
        img: "./img/ps5-negra.jpg",
        precio: 200000
    },
    {
        nombre: "PS5 Eternal Blue Controller",
        id: 5,
        fabricante: "Sony",
        img: "./img/ps-controller1.jpg",
        precio: 20000
    },
    {
        nombre: "PS5 Eternal Red Controller",
        id: 6,
        fabricante: "Sony",
        img: "./img/ps-controller2.jpg",
        precio: 22000
    },
    {
        nombre: "X-Box X Series",
        id: 7,
        fabricante: "Microsoft",
        img: "./img/xbox3.jpg",
        precio: 250000
    },
    {
        nombre: "Tarjeta Gráfica RTX 3090",
        id: 8,
        fabricante: "Nvidia",
        img: "./img/rtx3090.jpg",
        precio: 350000
    }
];

let cantidadDeProductos = 0; // valor que se va a ir incrementando o decrementando segun productos agregados
let montoHastaAhora = 0; // monto total por la cantidad de productos en carrito
let cart = []; // array que representa al carrito de compras
const URL = 'https://api.coinbase.com/v2/prices/BTC-USD/buy'; // REQUEST DE PRECIO DE BTC A USD DE API COINBASE.

function showAvailableProducts() {
    /* Se trae la información de cada uno de los objetos del array videoGames, y a partir del mismo se crean cards por cada objeto, y luego se appendean en el contenedor ".productos.
       Esta funcion se llama en la linea 84 dentro del document.ready, y en las lineas 211 y 221 */
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
}

$(document).ready(() => {
    showAvailableProducts()
    $(".compras").append(`<h2 id="cantidadProductos" class="text-light m-3 text-center">Productos en carrito: ${cantidadDeProductos}</h2>`);
    $(".compras").append(`<h2 id="montoTotalAPagar" class="text-light m-3 text-center">Monto a pagar: $${montoHastaAhora}</h2>`);

});

// AJAX

$.get(URL, (response, status) => {
    // TRAIGO DESDE LA API DE COINBASE EL PRECIO DE BITCOIN
    if (status === "success") {
        const {
            data: {
                amount: precio
            }
        } = response;
        $(".cripto").append(`<h3 class="text-light text-center bitcoin-title">Aceptamos Bitcoin como método de pago a través del mercado P2P</h3>
                              <p class="fs-4 text-center bitcoin-price">Precio actual de Bitcoin: <span class="btc-price">USD ${precio}</span></p>`);
    }
});

function buyItem(productIndex) {
    // funcion llamada en linea 75, agregada como evento del boton "Sumar al carrito".
    cantidadDeProductos++
    $("#cantidadProductos").html(`Productos en carrito: ${cantidadDeProductos}`);
    montoHastaAhora = montoHastaAhora + videoGames[productIndex].precio;
    $("#montoTotalAPagar").html(`Monto a pagar: $${montoHastaAhora}`);
    addItemToCart(productIndex);
}

function addItemToCart(productIndex) {
    // Funcion llamada dentro de evento buyItem, en linea 109. Pushea al array "cart" el objeto con el indice dado, y luego lo muestra en pantalla con el evento "showItems".
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

function showItems() {
    // evento que al dar click en el boton "sumar a carrito", crea un nuevo elemento de tipo contenedor con los detalles del producto seleccionado y lo muestra en pantalla
    $("#carrito").addClass("carrito")
    $(".carrito").html("")
    totalPriceToPay = 0;
    if (cart.length > 0) {
        cart.forEach((product, index) => {
            const itemContainer = document.createElement("div");
            itemContainer.classList.add("cart-item", `cart-item${index}`, "m-2");
            let itemSubtotal = (product.precio * product.cantidad)
            itemContainer.innerHTML = `<p class="text-light text-center item-text">Producto: ${product.nombre}<p>
                                           <p class="text-light text-center item-text">Precio: $${product.precio}</p>
                                           <p class="text-light text-center item-text">Cantidad: ${product.cantidad}</p>
                                           <p class="text-light text-center item-text">Subtotal: $${itemSubtotal}</p>
                                           <button class="btn btn-danger" onclick='eliminarProducto(${index})'>Eliminar</button>`
            $("#carrito").append(itemContainer);
        });
        $(".carrito").append("<h3 class='text-light fs-4 mt-3 text-center'>Desea finalizar su compra?</h3>");
        $(".carrito").append("<button class='finalizarCompra btn text-center' onclick='finalizarCompra()'>Finalizar Compra</button>");
        $(".carrito").append("<button class='cancelarCompra btn text-center' onclick='cancelarCompra()'>Cancelar Compra</button>");
        $(".carrito").addClass("d-flex flex-column align-items-center");
    }
}

function cancelarCompra() {
    /* Se vacía array cart, y la spa vuelve a su estado inicial, es decir los productos vuelven a mostrarse y los productos que antes estaban en el carrito ya no están.
       Esta función se llama en la linea 147, en el evento click del boton cancelar compra.*/
    vaciarCarrito();
}

function finalizarCompra() {
    /* Se vacían contenedores productos y carrito para proceder a finalizar la compra y se crea un formulario para completar con los datos del usuario y asi poder continuar con el proceso de compra.
    Función llamada en el método click de la linea 146.*/
    $(".finalizarCompra").hide();
    $("#carrito").html(""); // Vacío el InnerHTML del contenedor carrito, CREO UN CONTAINER Y DENTRO UN FORMULARIO CON LOS CORRESPONDIENTES INPUT.
    $("#productos").html("");
    $("#carrito").append(`<div class="formulario-container">
                                <h2 class="text-light text-center p-2 form-title">Datos para el envío de su pedido</h2>
                                <form class="formularioCompra border-light border-2 p-3 d-flex flex-column" id="formularioCompra">
                                    <input name='nombre' placeholder="Ingrese su nombre" type="text" class="input" required id="nombreInput">
                                    <input name='apellido' placeholder="Ingrese su apellido" type="text" class="input" required id="apellidoInput">
                                    <input name='dirección' placeholder="Ingrese la dirección de envío" type="text" class="input" required id="direccionInput">
                                    <input name='email' placeholder="Ingrese su correo electrónico" type="email" class="input" required id="emailInput">
                                    <select name="select" class="p-2" required>
                                        <option value="" disabled selected>Método de pago</option>
                                        <option value="bitcoin">Bitcoin</option>
                                        <option value="transfer">Transferencia bancaria</option>
                                    </select>
                                    <input name='Submit' value="Enviar" type="submit" class="input input-submit">
                                    <button class="btn btn-volverAtras" onclick='volverAtras()'>Volver atrás</button>
                                </form>
                              </div>`);

    $("#formularioCompra").on("submit", function (e) {
        e.preventDefault();
        $(".formulario-container").fadeOut(300, () => {
            $("#carrito").append(`<h2 class="fs-2 procesando-compra">Procesando tu compra...</h2>
                                  <img src="./img/loading.svg" alt="loading-img" class="loading-img">`)
                .delay(2000)
            $("#carrito").fadeOut(1000, () => {
                $(".procesando-compra").remove()
                $(".loading-img").remove()
                $("#montoTotalAPagar").hide();
                $("#cantidadProductos").hide();
                $(".formulario-container").hide();
                $("#carrito").show()
                $("#carrito").append(`<h2 class="text-light text-center">Muchas gracias por tu compra ${$("#nombreInput").val()} ${$("#apellidoInput").val()}</h2>
                                      <p class="text-light fs-3 text-center">Tu pedido se ha realizado con éxito y será despachado con destino: <span class="direccionEnvio">${$("#direccionInput").val()}</span> dentro de las próximas 72hs hábiles</p>
                                    `);
                $(".formulario-container").remove();
                verResumenDeCompra()
            })
        });
    });
}

function volverAtras() {
    /* Al querer volver atrás, se vacía el contenedor "#carrito" y se vuelven a mostrar los productos disponibles en pantalla, además de los items en el carrito.
    Función utilizada en el evento 'click' del boton de linea 173.*/
    $(".formulario-container").fadeOut(100, () => {
        $("#carrito").html("");
        showAvailableProducts();
        showItems()
    });
}

function finalizarRevision() {
    /* Una vez luego de finalizar la revisión de la compra, los productos se vuelven a mostrar en pantalla, se vacía el carrito y se remueven el formulario y el resumen.
       Evento utilizado en el boton de la linea 262.*/
    $("#montoTotalAPagar").show();
    $("#cantidadProductos").show();
    showAvailableProducts();
    vaciarCarrito();
    $(".formulario-container").remove();
    $(".resume-container").remove();
}

function vaciarCarrito() {
    /* Función utilizada en el evento de la linea 152 "cancelarCompra()", y en la función finalizarRevisión() de la linea 208. 
       El carrito se vacía y los contadores de cantidad y monto se setean en 0 de nuevo, asi como el atributo "cantidad" de cada producto previamente seleccionado.
    */
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

function eliminarProducto(productIndex) {
    /* Se remueve el producto con el indice dado del array "cart", y y la propiedad "cantidad" del mismo vuelve a 0.*/ 
    cantidadDeProductos = cantidadDeProductos - cart[productIndex].cantidad;
    montoHastaAhora = montoHastaAhora - (cart[productIndex].precio * cart[productIndex].cantidad)
    $("#montoTotalAPagar").html(`Monto a pagar: $${montoHastaAhora}`); // SE RESTA EL MONTO DE DICHO PRODUCTO * CANTIDAD DEL MISMO.
    $("#cantidadProductos").html(`Productos en carrito: ${cantidadDeProductos}`); // SE RESTA A CANTIDAD DE PRODUCTOS LA CANTIDAD SELECCIONADA DE DICHO PRODUCTO.
    cart.splice(productIndex, 1);
    showItems();
    if (cart.length == 0) { // SI LA CANTIDAD DE PRODUCTOS EN EL CARRITO ES 0, ENTONCES EL DIV "#carrito" NO SE MUESTRA EN PANTALLA.
        $("#carrito").html("");
        $("#carrito").removeClass("carrito");
    }
}

function verResumenDeCompra() { 
    /* Creo un nuevo contenedor donde se va a guardar un resumen de compra, mostrando los detalles de compra y de cada producto comprado.
       Evento llamado en la linea 191, dentro del evento submit del formulario de compra en linea 161.*/
    $("#carrito").after(`<div class="resume-container" id="resume-container">
                         </div>
                        `)
    $(".resume-container").append("<h2 class='resume__title fs-2'>Resumen de compra</h2>")
    cart.forEach(product => {
        const itemContainer = document.createElement("div")
        itemContainer.classList.add("resume__itemContainer")
        itemContainer.innerHTML =`<p class="resume__itemDetail resume__itemName">${product.nombre}</p>
                                  <p class="resume__itemDetail resume__itemQuantity">Cantidad: ${product.cantidad}</p>
                                  <p class="resume__itemDetail resume__itemTotalPrice">Subtotal: $${product.precio * product.cantidad}</p>
                                 `
        $(".resume-container").append(itemContainer);
    })
    $(".resume-container").append(`<h3 class="resume__total fs-2">Total: $${montoHastaAhora}</h3>
                                   <button class="btn btn-danger btn-finalizarResumen" onclick='finalizarRevision()'>Finalizar revisión</button>`)
}